import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const inputPath = path.resolve(process.argv[2] || '');
const outputPath = path.resolve(
  process.argv[3] || path.join('data', 'normalized', 'technical-training.json'),
);
if (!process.argv[2]) throw new Error('Provide the source course-content .xlsx path.');

function clean(value) {
  const text = value == null ? '' : String(value).replace(/\u00a0/g, ' ').trim();
  return text || null;
}

function unique(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function splitSourceContent(value) {
  const text = clean(value);
  if (!text) return [];
  return unique(text
    .split(/\r?\n/)
    .map((line) => line
      .replace(/^\s*(?:[•●▪◦*-]|\d+[.)])\s*/, '')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean));
}

function summaryExcerpt(values, fallback) {
  const first = values.flatMap(splitSourceContent).find(Boolean) || fallback;
  if (first.length <= 420) return first;
  const shortened = first.slice(0, 417);
  return `${shortened.slice(0, Math.max(shortened.lastIndexOf(' '), 300))}...`;
}

function normalizeDuration(sourceDuration, structureType, structureCount) {
  const source = clean(sourceDuration);
  if (!source) {
    if ((structureType || '').toLowerCase() === 'day' && Number(structureCount) > 0) {
      return { minutes: Number(structureCount) * 8 * 60, method: 'inferred-8-hours-per-source-day' };
    }
    return { minutes: 16 * 60, method: 'default-16-hours-missing-source-duration' };
  }

  const normalized = source.toLowerCase().replace(/[–—]/g, '-');
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*-?\s*minutes?/);
  if (minuteMatch) return { minutes: Math.round(Number(minuteMatch[1])), method: 'explicit-minutes' };

  const weekMatch = normalized.match(/(\d+(?:\.\d+)?)\s*weeks?/);
  const perDayMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)\.?\s*(?:per\s*day|daily)/);
  if (weekMatch && perDayMatch) {
    return {
      minutes: Math.round(Number(weekMatch[1]) * 5 * Number(perDayMatch[1]) * 60),
      method: 'inferred-5-days-per-week-using-source-daily-hours',
    };
  }

  const dayValues = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*days?/g)].map((match) => Number(match[1]));
  const hourValues = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)/g)].map((match) => Number(match[1]));
  const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*days?/);
  if (rangeMatch && hourValues.length === 0) {
    return { minutes: Math.round(Number(rangeMatch[2]) * 8 * 60), method: 'inferred-8-hours-per-day-using-range-maximum' };
  }
  if (dayValues.length > 0 && perDayMatch) {
    return {
      minutes: Math.round(Math.max(...dayValues) * Number(perDayMatch[1]) * 60),
      method: 'calculated-source-days-times-daily-hours',
    };
  }
  if (hourValues.length > 0) {
    return { minutes: Math.round(Math.max(...hourValues) * 60), method: 'explicit-hours' };
  }
  if (dayValues.length > 0) {
    return { minutes: Math.round(Math.max(...dayValues) * 8 * 60), method: 'inferred-8-hours-per-source-day' };
  }
  return { minutes: 16 * 60, method: 'default-16-hours-unrecognized-source-duration' };
}

function levelForDuration(minutes) {
  if (minutes <= 240) return 'Awareness';
  if (minutes <= 480) return 'Basic';
  if (minutes <= 960) return 'Intermediate';
  if (minutes <= 1920) return 'Advanced';
  return 'Expert';
}

const technologyRules = [
  ['Microsoft Power Platform', /power platform|power apps|power automate|power virtual agents/i, 'Microsoft'],
  ['Power BI', /power\s*bi/i, 'Microsoft'],
  ['Microsoft Azure', /\bazure\b|\baz-\d|\bdp-\d|\bpl-\d/i, 'Microsoft'],
  ['Amazon Web Services', /\baws\b|amazon web services/i, 'Amazon Web Services'],
  ['Google Cloud', /google cloud|\bgcp\b/i, 'Google'],
  ['Databricks', /databricks/i, 'Databricks'],
  ['Tableau', /tableau/i, 'Salesforce'],
  ['MicroStrategy', /micro\s*strategy/i, 'MicroStrategy'],
  ['Apache Hadoop', /hadoop/i, 'Apache Software Foundation'],
  ['Apache Spark', /\bspark\b/i, 'Apache Software Foundation'],
  ['SQL', /\bsql\b|ssis|ssrs|data warehouse/i, 'Various'],
  ['Python', /\bpython\b/i, 'Python Software Foundation'],
  ['Java', /\bjava\b|spring framework/i, 'Oracle'],
  ['.NET', /\.net|asp\.net|c#/i, 'Microsoft'],
  ['React', /react\s*js|reactjs|redux/i, 'Meta'],
  ['Angular', /angular/i, 'Google'],
  ['Vue.js', /vue\s*js/i, 'Open Source'],
  ['Node.js', /node\.?js/i, 'OpenJS Foundation'],
  ['Xamarin', /xamarin/i, 'Microsoft'],
  ['iOS', /\bios\b|swift/i, 'Apple'],
  ['Android', /android/i, 'Google'],
  ['Selenium', /selenium/i, 'Open Source'],
  ['Git', /\bgit\b|github/i, 'GitHub'],
  ['Docker', /docker/i, 'Docker'],
  ['Kubernetes', /kubernetes|\bk8s\b/i, 'Cloud Native Computing Foundation'],
  ['Internet of Things', /internet of things|\biot\b/i, 'Various'],
  ['Artificial Intelligence', /generative ai|machine learning|deep learning|artificial intelligence|\bai\b|\bml\b/i, 'Various'],
  ['Agile & Scrum', /agile|scrum/i, 'Various'],
];

function domainFor(title, technologies) {
  const text = `${title} ${technologies.join(' ')}`.toLowerCase();
  if (/power platform|power apps|power automate|power bi/.test(text)) return 'Power Platform & Business Intelligence';
  if (/aws|azure|google cloud|gcp|cloud/.test(text)) return 'Cloud Computing';
  if (/devops|docker|kubernetes|jenkins|terraform|git/.test(text)) return 'DevOps & Platform Engineering';
  if (/security|cyber|ethical hack|penetration|purview/.test(text)) return 'Cybersecurity';
  if (/internet of things|\biot\b/.test(text)) return 'Internet of Things';
  if (/generative ai|machine learning|deep learning|artificial intelligence|data science|\bai\b|\bml\b/.test(text)) return 'AI & Data Science';
  if (/data|sql|hadoop|spark|databricks|tableau|microstrategy|ssis|ssrs|database|warehouse|analytics/.test(text)) return 'Data & Analytics';
  if (/react|angular|vue|node|javascript|html|css|web/.test(text)) return 'Web Development';
  if (/xamarin|android|\bios\b|swift|mobile/.test(text)) return 'Mobile Development';
  if (/test|selenium|quality assurance|\bqa\b/.test(text)) return 'Testing & QA';
  if (/agile|scrum|itil|kanban/.test(text)) return 'Process & Delivery';
  return 'Software & Engineering';
}

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extractorPath = path.join(rootDirectory, 'scripts', 'extract-course-workbook.py');
const pythonExecutable = process.env.PYTHON_EXECUTABLE?.trim() || 'python';
const execFileAsync = promisify(execFile);
const { stdout } = await execFileAsync(pythonExecutable, [extractorPath, inputPath], {
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024,
  windowsHide: true,
});
const extractedWorkbook = JSON.parse(stdout);
const indexRows = extractedWorkbook['Course index'];
const detailRows = extractedWorkbook['Course details'];
const curriculumRows = extractedWorkbook.Curriculum;
const checkRows = extractedWorkbook['Source checks'];

const detailsById = new Map();
for (const row of detailRows) {
  const courseId = row.courseid?.toUpperCase();
  if (!detailsById.has(courseId)) detailsById.set(courseId, []);
  detailsById.get(courseId).push(row);
}
const curriculumById = new Map();
for (const row of curriculumRows) {
  const courseId = row.courseid?.toUpperCase();
  if (!curriculumById.has(courseId)) curriculumById.set(courseId, []);
  curriculumById.get(courseId).push(row);
}
const checksById = new Map();
for (const row of checkRows) {
  const courseId = row.courseid?.toUpperCase();
  if (!checksById.has(courseId)) checksById.set(courseId, []);
  checksById.get(courseId).push({
    type: row.checktype,
    observation: row.observation,
    priority: row.priority,
  });
}

const courses = indexRows.map((source, index) => {
  const sourceCourseId = source.courseid?.toUpperCase();
  const courseId = `TC${String(index + 1).padStart(4, '0')}`;
  const title = source.coursetitle;
  const details = detailsById.get(sourceCourseId) || [];
  const curriculum = curriculumById.get(sourceCourseId) || [];
  const sections = (pattern) => details
    .filter((row) => pattern.test(row.standardsection || ''))
    .map((row) => row.contentsourcewording)
    .filter(Boolean);
  const descriptions = sections(/description|overview|about/i);
  const objectiveSections = sections(/objective|learning outcome/i);
  const objectives = unique([
    ...objectiveSections.flatMap(splitSourceContent),
    ...curriculum.flatMap((row) => splitSourceContent(row.learningobjectiveifexplicitlypresent)),
  ]);
  const audiences = unique(sections(/audience|who should|participant profile|target/i).flatMap(splitSourceContent));
  const prerequisites = unique(sections(/prereq|pre requisite|participant readiness/i).flatMap(splitSourceContent));
  const deliveryValues = sections(/training mode|delivery mode|delivery|format/i).flatMap(splitSourceContent);
  const technologies = unique(technologyRules
    .filter(([, pattern]) => pattern.test(title))
    .map(([name]) => name));
  const primaryRule = technologyRules.find(([, pattern]) => pattern.test(title));
  const primaryTechnology = primaryRule?.[0] || 'General Technology';
  const vendor = primaryRule?.[2] || 'Various';
  const domain = domainFor(title, technologies);
  const duration = normalizeDuration(source.durationsource, source.curriculumbasis, source.structurecount);

  const modules = curriculum.map((module, moduleIndex) => ({
    moduleCode: String(moduleIndex + 1).padStart(2, '0'),
    title: module.sectiontitle || module.structurelabel || `${module.structuretype || 'Module'} ${moduleIndex + 1}`,
    learningObjectives: splitSourceContent(module.learningobjectiveifexplicitlypresent),
    concepts: splitSourceContent(module.topicscontent),
    practicalActivities: splitSourceContent(module.handsonlabifexplicitlypresent),
    sourcePages: module.sourcepages || null,
  }));
  const summarySources = descriptions.length > 0
    ? descriptions
    : objectiveSections.length > 0
      ? objectiveSections
      : curriculum.map((module) => module.topicscontent).filter(Boolean);

  return {
    courseId,
    category: 'technical-training',
    title,
    level: levelForDuration(duration.minutes),
    durationMinutes: duration.minutes,
    format: deliveryValues.find((value) => /instructor|virtual|classroom|self.?paced|blended/i.test(value)) || null,
    delivery: deliveryValues.join(' | ') || null,
    summary: summaryExcerpt(summarySources, title),
    objectives,
    toolsCovered: technologies.length > 0 ? technologies : [primaryTechnology],
    relatedSkills: technologies.length > 0 ? technologies : [domain],
    audiences,
    prerequisites,
    modules,
    scenarios: [],
    technologyCategories: [domain],
    skillArea: domain,
    domain,
    primaryTechnology,
    vendor,
    sourceCourseId,
    sourceDuration: source.durationsource,
    sourcePdf: source.sourcepdf,
    durationNormalization: duration.method,
    sourceIssues: checksById.get(sourceCourseId) || [],
  };
});

const ids = new Set();
for (const course of courses) {
  if (!/^TC\d{4,}$/.test(course.courseId)) throw new Error(`Invalid generated Course ID: ${course.courseId}`);
  if (ids.has(course.courseId)) throw new Error(`Duplicate generated Course ID: ${course.courseId}`);
  ids.add(course.courseId);
  if (!course.title || !Number.isInteger(course.durationMinutes) || course.durationMinutes <= 0) {
    throw new Error(`Invalid core data for ${course.courseId}`);
  }
  const moduleCodes = new Set();
  for (const module of course.modules) {
    if (!module.title || moduleCodes.has(module.moduleCode)) {
      throw new Error(`Invalid module data for ${course.courseId}`);
    }
    moduleCodes.add(module.moduleCode);
  }
}

const output = {
  schemaVersion: 1,
  category: 'technical-training',
  sourceWorkbook: path.basename(inputPath),
  conversionRules: {
    courseId: 'Source C001-C141 mapped sequentially to TC0001-TC0141.',
    dayDuration: 'Eight hours per source day; ranges use the maximum day count.',
    missingDuration: 'Source day structures use eight hours per day; other missing durations default to sixteen hours.',
    level: 'Awareness <=4h, Basic <=8h, Intermediate <=16h, Advanced <=32h, Expert >32h.',
  },
  courses,
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Converted ${courses.length} courses and ${courses.reduce((sum, course) => sum + course.modules.length, 0)} curriculum rows.`);
console.log(`Output: ${outputPath}`);
