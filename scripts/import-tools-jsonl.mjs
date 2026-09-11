import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const cliArguments = process.argv.slice(2);
const mergeExisting = cliArguments.includes('--merge');
const inputArgument = cliArguments.find((argument) => argument !== '--merge');

if (!inputArgument) {
  console.error('Usage: npm run import:tools -- <path-to-jsonl> [--merge]');
  process.exit(1);
}

const inputPath = path.resolve(inputArgument);
const canonicalPath = path.resolve('data/normalized/tools-technology.json');
const reportPath = path.resolve('data/import-reports/tools-technology-last.json');
const appDataPath = path.resolve('src/data/toolsTechProgrammes.ts');

const allowedLevels = new Set(['Awareness', 'Basic', 'Intermediate', 'Advanced', 'Expert']);
const levelByDuration = new Map([
  [240, 'Awareness'],
  [480, 'Basic'],
  [960, 'Intermediate'],
  [1920, 'Advanced'],
]);
const toolDefaults = new Map([
  ['chatgpt', { vendor: 'OpenAI', skillArea: 'Generative AI', technologyCategories: ['AI'] }],
  ['gemini', { vendor: 'Google', skillArea: 'Generative AI', technologyCategories: ['AI'] }],
  ['claude', { vendor: 'Anthropic', skillArea: 'Generative AI', technologyCategories: ['AI'] }],
]);

const input = await fs.readFile(inputPath, 'utf8');
const sourceSha256 = createHash('sha256').update(input).digest('hex');
const lines = input.split(/\r?\n/);
const issues = [];
const parsedRecords = [];
const seenIds = new Map();

function addIssue(severity, code, line, courseId, field, message, appliedValue) {
  const issue = { severity, code, line, courseId: courseId || null, field, message };
  if (appliedValue !== undefined) issue.appliedValue = appliedValue;
  issues.push(issue);
}

function cleanString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function cleanStringArray(value, field, line, courseId) {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    addIssue('error', 'INVALID_ARRAY', line, courseId, field, `${field} must be an array.`);
    return [];
  }

  const cleaned = [];
  value.forEach((item, index) => {
    const text = cleanString(item);
    if (text) cleaned.push(text);
    else addIssue('warning', 'EMPTY_LIST_ITEM', line, courseId, `${field}[${index}]`, 'Empty list item removed.');
  });
  return cleaned;
}

for (let index = 0; index < lines.length; index += 1) {
  const lineNumber = index + 1;
  const sourceLine = lines[index].trim();
  if (!sourceLine) continue;

  let raw;
  try {
    raw = JSON.parse(sourceLine);
  } catch (error) {
    addIssue('error', 'INVALID_JSON', lineNumber, null, 'record', error.message);
    continue;
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    addIssue('error', 'INVALID_RECORD', lineNumber, null, 'record', 'Each line must contain one JSON object.');
    continue;
  }

  const courseId = cleanString(raw.courseId)?.toUpperCase() || null;
  if (!courseId || !/^TT\d{4,}$/.test(courseId)) {
    addIssue('error', 'INVALID_COURSE_ID', lineNumber, courseId, 'courseId', 'Course ID must use TT followed by at least four digits.');
  } else if (seenIds.has(courseId)) {
    addIssue('error', 'DUPLICATE_COURSE_ID', lineNumber, courseId, 'courseId', `Course ID already appeared on line ${seenIds.get(courseId)}.`);
  } else {
    seenIds.set(courseId, lineNumber);
  }

  const category = cleanString(raw.category);
  if (category !== 'tools-technology') {
    addIssue('error', 'INVALID_CATEGORY', lineNumber, courseId, 'category', 'Tools import accepts only tools-technology records.');
  }

  const title = cleanString(raw.title);
  if (!title) addIssue('error', 'MISSING_TITLE', lineNumber, courseId, 'title', 'Title is required.');

  const toolName = cleanString(raw.toolName);
  if (!toolName) addIssue('error', 'MISSING_TOOL_NAME', lineNumber, courseId, 'toolName', 'Tool Name is required.');

  const durationMinutes = Number(raw.durationMinutes);
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    addIssue('error', 'INVALID_DURATION', lineNumber, courseId, 'durationMinutes', 'Duration must be a positive whole number of minutes.');
  }

  let level = cleanString(raw.level);
  if (!level && levelByDuration.has(durationMinutes)) {
    level = levelByDuration.get(durationMinutes);
    addIssue('warning', 'LEVEL_INFERRED', lineNumber, courseId, 'level', 'Missing level inferred from the standard duration mapping.', level);
  } else if (!level) {
    addIssue('error', 'MISSING_LEVEL', lineNumber, courseId, 'level', 'Level is required and could not be inferred from duration.');
  } else if (!allowedLevels.has(level)) {
    addIssue('error', 'INVALID_LEVEL', lineNumber, courseId, 'level', `Level must be one of: ${[...allowedLevels].join(', ')}.`);
  }

  const defaults = toolDefaults.get(toolName?.toLowerCase());
  let vendor = cleanString(raw.vendor);
  if (!vendor && defaults) {
    vendor = defaults.vendor;
    addIssue('warning', 'VENDOR_INFERRED', lineNumber, courseId, 'vendor', 'Missing vendor inferred from Tool Name.', vendor);
  } else if (!vendor) {
    addIssue('error', 'MISSING_VENDOR', lineNumber, courseId, 'vendor', 'Vendor is required and no Tool Name mapping exists.');
  }

  const objectives = cleanStringArray(raw.objectives, 'objectives', lineNumber, courseId);
  if (objectives.length === 0) {
    addIssue('error', 'MISSING_OBJECTIVES', lineNumber, courseId, 'objectives', 'At least one programme objective is required.');
  }

  let summary = cleanString(raw.summary);
  if (!summary && objectives.length > 0) {
    summary = objectives[0];
    addIssue('warning', 'SUMMARY_DERIVED', lineNumber, courseId, 'summary', 'Missing summary derived from the first programme objective.', summary);
  }

  const format = cleanString(raw.format);
  if (!format) {
    addIssue('warning', 'FORMAT_EMPTY', lineNumber, courseId, 'format', 'Format is empty and will remain unset.');
  }

  const moduleCodes = new Set();
  const modules = Array.isArray(raw.modules)
    ? raw.modules.map((module, moduleIndex) => {
        const rawCode = cleanString(module?.moduleCode) || String(moduleIndex + 1);
        const moduleCode = /^\d+$/.test(rawCode) ? rawCode.padStart(2, '0') : rawCode;
        const moduleTitle = cleanString(module?.title);
        const concepts = cleanStringArray(module?.concepts, `modules[${moduleIndex}].concepts`, lineNumber, courseId);
        const practicalActivities = cleanStringArray(
          module?.practicalActivities,
          `modules[${moduleIndex}].practicalActivities`,
          lineNumber,
          courseId,
        );

        if (moduleCodes.has(moduleCode)) {
          addIssue('error', 'DUPLICATE_MODULE_CODE', lineNumber, courseId, `modules[${moduleIndex}].moduleCode`, `Duplicate Module Code ${moduleCode}.`);
        }
        moduleCodes.add(moduleCode);

        if (!moduleTitle) {
          addIssue('error', 'MISSING_MODULE_TITLE', lineNumber, courseId, `modules[${moduleIndex}].title`, 'Module title is required.');
        }
        if (concepts.length === 0 && practicalActivities.length === 0) {
          addIssue('warning', 'EMPTY_MODULE_CONTENT', lineNumber, courseId, `modules[${moduleIndex}]`, 'Module has no concept or practical activity items.');
        }

        return { moduleCode, title: moduleTitle, concepts, practicalActivities };
      })
    : [];

  if (!Array.isArray(raw.modules)) {
    addIssue('error', 'INVALID_MODULES', lineNumber, courseId, 'modules', 'Modules must be an array.');
  } else if (modules.length === 0) {
    addIssue('error', 'MISSING_MODULES', lineNumber, courseId, 'modules', 'At least one module is required.');
  }

  const scenarios = Array.isArray(raw.scenarios)
    ? raw.scenarios.map((scenario, scenarioIndex) => {
        const scenarioTitle = cleanString(scenario?.title);
        const workflow = cleanString(scenario?.workflow);
        const description = cleanString(scenario?.description);
        if (!scenarioTitle) addIssue('error', 'MISSING_SCENARIO_TITLE', lineNumber, courseId, `scenarios[${scenarioIndex}].title`, 'Scenario title is required.');
        if (!description) addIssue('error', 'MISSING_SCENARIO_DESCRIPTION', lineNumber, courseId, `scenarios[${scenarioIndex}].description`, 'Scenario description is required.');
        return { title: scenarioTitle, workflow, description };
      })
    : [];

  if (!Array.isArray(raw.scenarios)) {
    addIssue('error', 'INVALID_SCENARIOS', lineNumber, courseId, 'scenarios', 'Scenarios must be an array.');
  }

  const providedTechnologyCategories = cleanStringArray(
    raw.technologyCategories,
    'technologyCategories',
    lineNumber,
    courseId,
  );

  parsedRecords.push({
    sourceLine: lineNumber,
    courseId,
    category: 'tools-technology',
    title,
    toolName,
    vendor,
    level,
    durationMinutes,
    format,
    delivery: cleanString(raw.delivery),
    summary,
    objectives,
    toolsCovered: cleanStringArray(raw.toolsCovered, 'toolsCovered', lineNumber, courseId),
    audiences: cleanStringArray(raw.audiences, 'audiences', lineNumber, courseId),
    prerequisites: cleanStringArray(raw.prerequisites, 'prerequisites', lineNumber, courseId),
    modules,
    scenarios,
    toolLogoUrl: cleanString(raw.toolLogoUrl),
    skillArea: cleanString(raw.skillArea) || defaults?.skillArea || null,
    technologyCategories: providedTechnologyCategories.length > 0
      ? providedTechnologyCategories
      : defaults?.technologyCategories || [],
  });
}

const validCourseIds = new Set(
  parsedRecords
    .filter((record) => !issues.some((issue) => issue.severity === 'error' && issue.courseId === record.courseId))
    .map((record) => record.courseId),
);
const validRecords = parsedRecords.filter((record) => validCourseIds.has(record.courseId));
let outputRecords = validRecords;

if (mergeExisting && !issues.some((issue) => issue.severity === 'error')) {
  try {
    const currentCanonical = JSON.parse(await fs.readFile(canonicalPath, 'utf8'));
    if (!Array.isArray(currentCanonical.courses)) {
      throw new Error('The current canonical file does not contain a courses array.');
    }

    const replacements = new Map(validRecords.map((course) => [course.courseId, course]));
    const existingIds = new Set(currentCanonical.courses.map((course) => course.courseId));
    outputRecords = currentCanonical.courses.map((course) => replacements.get(course.courseId) || course);
    outputRecords.push(...validRecords.filter((course) => !existingIds.has(course.courseId)));
  } catch (error) {
    addIssue('error', 'MERGE_SOURCE_UNAVAILABLE', null, null, 'canonical', `Unable to merge with the current canonical catalogue: ${error.message}`);
  }
}

const errorCount = issues.filter((issue) => issue.severity === 'error').length;
const warningCount = issues.filter((issue) => issue.severity === 'warning').length;

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: { fileName: path.basename(inputPath), sha256: sourceSha256 },
  mode: mergeExisting ? 'merge' : 'replace',
  result: errorCount === 0 ? 'validated' : 'rejected',
  counts: {
    nonEmptyLines: lines.filter((line) => line.trim()).length,
    parsedRecords: parsedRecords.length,
    validRecords: validRecords.length,
    finalRecords: errorCount === 0 ? outputRecords.length : null,
    errors: errorCount,
    warnings: warningCount,
  },
  issues,
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (errorCount > 0) {
  console.error(`Import rejected: ${errorCount} error(s), ${warningCount} warning(s).`);
  console.error(`Report: ${reportPath}`);
  process.exit(1);
}

const canonical = {
  schemaVersion: 1,
  category: 'tools-technology',
  sourceSha256,
  courses: outputRecords.map(({ sourceLine, ...course }) => course),
};

function durationLabel(minutes) {
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
  }
  return `${minutes} Minutes`;
}

const appProgrammes = outputRecords.map((course) => {
  const details = {
    summary: course.summary,
    objective: course.objectives.join('\n'),
    objectives: course.objectives,
    audience: course.audiences,
    prerequisitesList: course.prerequisites,
    delivery: course.delivery || undefined,
    toolsCovered: course.toolsCovered,
    modules: course.modules.map((module) => ({
      id: module.moduleCode,
      title: module.title,
      learningOutcomes: [...module.concepts, ...module.practicalActivities],
      concepts: module.concepts,
      practicalActivities: module.practicalActivities,
    })),
    scenarios: course.scenarios.map((scenario) => ({
      title: scenario.title,
      workflow: scenario.workflow || undefined,
      description: scenario.description,
      content: [scenario.workflow, scenario.description].filter(Boolean).join('\n\n'),
    })),
  };
  if (course.format) details.format = course.format;

  return {
    id: course.courseId,
    title: course.title,
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolLogoUrl: course.toolLogoUrl || '',
    toolName: course.toolName,
    vendor: course.vendor,
    level: course.level,
    duration: durationLabel(course.durationMinutes),
    skillArea: course.skillArea,
    technologyCategory: course.technologyCategories,
    details,
  };
});

const generatedSource = [
  "import type { ToolsTechProgramme } from '../types';",
  '',
  '// Generated by scripts/import-tools-jsonl.mjs. Do not edit by hand.',
  `export const toolsTechnologyProgrammes: ToolsTechProgramme[] = ${JSON.stringify(appProgrammes, null, 2)};`,
  '',
].join('\n');

await fs.mkdir(path.dirname(canonicalPath), { recursive: true });
await Promise.all([
  fs.writeFile(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`, 'utf8'),
  fs.writeFile(appDataPath, generatedSource, 'utf8'),
]);

console.log(`Validated ${validRecords.length} incoming course(s): 0 errors, ${warningCount} warning(s).`);
console.log(`Catalogue now contains ${outputRecords.length} course(s).`);
console.log(`Canonical data: ${canonicalPath}`);
console.log(`Website data: ${appDataPath}`);
console.log(`Report: ${reportPath}`);
