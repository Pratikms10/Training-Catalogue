import path from 'node:path';

function clean(value) {
  if (value == null) return null;
  const normalized = String(value)
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return normalized || null;
}

function section(markdown, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = new RegExp(`^##\\s+${escaped}\\s*$`, 'mi').exec(markdown);
  if (!start) return null;
  const contentStart = start.index + start[0].length;
  const next = /^##\s+/m.exec(markdown.slice(contentStart));
  return clean(markdown.slice(contentStart, next ? contentStart + next.index : markdown.length));
}

function subsection(content, title) {
  if (!content) return null;
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const heading = new RegExp(`^\\*\\*${escaped}\\*\\*\\s*$`, 'mi').exec(content);
  if (!heading) return null;
  const contentStart = heading.index + heading[0].length;
  const next = /^\*\*[^\n]+\*\*\s*$/m.exec(content.slice(contentStart));
  return clean(content.slice(contentStart, next ? contentStart + next.index : content.length));
}

function commaList(value) {
  return value
    ? [...new Set(value.split(',').map((item) => clean(item)).filter(Boolean))]
    : [];
}

function listItems(value) {
  if (!value) return [];
  const items = [];
  let current = null;
  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      if (current) items.push(clean(current));
      current = bullet[1];
    } else if (current && line && !/^#{1,6}\s/.test(line) && !/^\*\*.+\*\*$/.test(line)) {
      current += ` ${line}`;
    }
  }
  if (current) items.push(clean(current));
  return [...new Set(items.filter(Boolean))];
}

function audienceItems(value) {
  if (!value) return [];
  const bullets = listItems(value);
  const prose = clean(value.replace(/^[-*]\s+.*$/gm, '').replace(/\n+/g, ' '));
  return [...new Set([prose, ...bullets].filter(Boolean))];
}

function normalizeLevel(value) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function durationMinutes(value) {
  const match = /(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)/i.exec(value || '');
  if (!match) return null;
  const amount = Number.parseFloat(match[1]);
  return /hour|hr/i.test(match[2]) ? Math.round(amount * 60) : Math.round(amount);
}

function parseModules(syllabus) {
  if (!syllabus) return [];
  const learningPaths = [...syllabus.matchAll(/^###\s+Learning Path:\s*(.+)$/gmi)];
  const moduleHeadings = [...syllabus.matchAll(/^####\s+Module\s+(\d+):\s*(.+)$/gmi)];

  return moduleHeadings.map((heading, index) => {
    const contentStart = heading.index + heading[0].length;
    const contentEnd = moduleHeadings[index + 1]?.index ?? syllabus.length;
    const content = syllabus.slice(contentStart, contentEnd);
    const learningPath = [...learningPaths]
      .reverse()
      .find((candidate) => candidate.index < heading.index);
    const nextLearningPath = learningPaths.find((candidate) => candidate.index > heading.index);
    const effectiveContent = nextLearningPath && nextLearningPath.index < contentEnd
      ? syllabus.slice(contentStart, nextLearningPath.index)
      : content;
    const pathDescription = learningPath
      ? clean(syllabus.slice(
          learningPath.index + learningPath[0].length,
          moduleHeadings.find((candidate) => candidate.index > learningPath.index)?.index ?? heading.index,
        ))
      : null;

    return {
      moduleCode: heading[1].padStart(2, '0'),
      title: clean(heading[2]),
      description: clean(subsection(effectiveContent, 'Description')),
      learningPathTitle: clean(learningPath?.[1]),
      learningPathDescription: pathDescription,
      learningObjectives: listItems(subsection(effectiveContent, 'Learning objectives')),
      topics: listItems(subsection(effectiveContent, 'Topics / Units')),
      labs: listItems(subsection(effectiveContent, 'Exercises / Labs')),
    };
  });
}

export function parseMicrosoftCertificationMarkdown(markdown, fileName) {
  const name = path.basename(fileName);
  const fileMatch = /^(\d+)_([A-Z0-9][A-Z0-9-]*)\.md$/i.exec(name);
  if (!fileMatch) {
    throw new Error(`Filename ${name} must follow <sequence>_<course-code>.md.`);
  }

  const sourceSequence = Number.parseInt(fileMatch[1], 10);
  const courseCode = fileMatch[2].toUpperCase();
  const headingCode = clean(/^#\s+([^\s]+)\s*$/m.exec(markdown)?.[1])?.toUpperCase();
  if (!headingCode) throw new Error(`${name} is missing its H1 course code.`);
  if (headingCode !== courseCode) {
    throw new Error(`${name} contains heading ${headingCode}, which does not match filename code ${courseCode}.`);
  }

  const title = section(markdown, 'Course title');
  const duration = durationMinutes(section(markdown, 'Duration'));
  const level = normalizeLevel(section(markdown, 'Level'));
  const modules = parseModules(section(markdown, 'Course syllabus'));
  if (!title) throw new Error(`${name} is missing Course title.`);
  if (!duration) throw new Error(`${name} has no valid Duration.`);
  if (!level) throw new Error(`${name} is missing Level.`);
  if (modules.length === 0) throw new Error(`${name} contains no syllabus modules.`);

  return {
    courseId: courseCode,
    courseCode,
    category: 'certifications',
    provider: 'Microsoft',
    sourceSequence,
    sourceFile: name,
    title,
    courseUrl: section(markdown, 'Course URL'),
    summary: section(markdown, 'Overview'),
    level,
    durationMinutes: duration,
    format: null,
    delivery: null,
    productTechnologies: commaList(section(markdown, 'Product / technology')),
    roles: commaList(section(markdown, 'Role')),
    subjects: commaList(section(markdown, 'Subject')),
    languageCodes: commaList(section(markdown, 'Course language')),
    audiences: audienceItems(section(markdown, 'Audience profile')),
    prerequisites: audienceItems(section(markdown, 'Prerequisites')),
    objectives: listItems(section(markdown, 'Learning objectives / Skills gained')),
    modules,
    certificationInformation: section(markdown, 'Certification / Exam information'),
    instructorLedInformation: section(markdown, 'Instructor-led training information'),
    selfPacedInformation: section(markdown, 'Self-paced training information'),
    additionalInformation: section(markdown, 'Additional course information'),
  };
}

export function validateCertificationBatch(courses) {
  const seen = new Set();
  for (const course of courses) {
    if (seen.has(course.courseId)) throw new Error(`Duplicate certification code ${course.courseId}.`);
    seen.add(course.courseId);
    if (course.provider !== 'Microsoft') throw new Error(`Unsupported provider ${course.provider}.`);
    if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(course.level)) {
      throw new Error(`${course.courseId} has unsupported level ${course.level}.`);
    }
  }
  return courses;
}
