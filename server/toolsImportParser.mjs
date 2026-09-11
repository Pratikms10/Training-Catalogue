import ExcelJS from 'exceljs';

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
const vendorByTool = new Map(Object.entries({
  'Amazon Q Developer': 'Amazon Web Services',
  'Bolt.new': 'StackBlitz',
  Claude: 'Anthropic',
  'Claude Code': 'Anthropic',
  Codex: 'OpenAI',
  Copilot: 'Microsoft',
  'Copilot for Microsoft 365': 'Microsoft',
  Cursor: 'Anysphere',
  'DALL·E': 'OpenAI',
  'Firebase Studio': 'Google',
  'Gemini Code Assist': 'Google',
  'Gemini for Google Workspace': 'Google',
  'GitHub Copilot': 'GitHub',
  'Google Veo': 'Google',
  Grok: 'xAI',
  'JetBrains AI Assistant': 'JetBrains',
  Kimi: 'Moonshot AI',
  'Microsoft Copilot Studio': 'Microsoft',
  Mistral: 'Mistral AI',
  'Nano Banana': 'Google',
  Perplexity: 'Perplexity AI',
  Poe: 'Quora',
  Seedance: 'ByteDance',
}));

function cleanString(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function splitList(value) {
  if (Array.isArray(value)) return value.map(cleanString).filter(Boolean);
  const text = cleanString(value);
  return text ? text.split(/\r?\n|\s*\|\s*|\s*;\s*/).map(cleanString).filter(Boolean) : [];
}

function cellText(cell) {
  const value = cell?.value;
  if (value == null) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== 'object') return String(value).trim();
  if (Array.isArray(value.richText)) return value.richText.map((part) => part.text).join('').trim();
  if ('result' in value && value.result != null) return String(value.result).trim();
  if ('text' in value && value.text != null) return String(value.text).trim();
  return String(cell.text || '').trim();
}

function normalizeHeader(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findSheet(workbook, name) {
  const expected = normalizeHeader(name);
  return workbook.worksheets.find((sheet) => normalizeHeader(sheet.name) === expected);
}

function sheetRows(sheet) {
  if (!sheet || sheet.actualRowCount < 2) return [];
  const headers = new Map();
  sheet.getRow(1).eachCell({ includeEmpty: false }, (cell, columnNumber) => {
    headers.set(normalizeHeader(cellText(cell)), columnNumber);
  });

  const rows = [];
  for (let rowNumber = 2; rowNumber <= sheet.actualRowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const values = {};
    for (const [header, columnNumber] of headers) values[header] = cellText(row.getCell(columnNumber));
    if (Object.values(values).some(Boolean)) rows.push({ ...values, __sourceRow: rowNumber, __sheet: sheet.name });
  }
  return rows;
}

function issue(severity, code, sourceRow, courseId, field, message, appliedValue) {
  return {
    severity,
    code,
    sourceRow: sourceRow || null,
    courseId: courseId || null,
    field,
    message,
    ...(appliedValue !== undefined ? { appliedValue } : {}),
  };
}

export async function parseImportSource(buffer, fileName) {
  const extension = fileName.toLowerCase().split('.').pop();
  if (extension === 'xlsx') return parseWorkbook(buffer);
  if (extension === 'json' || extension === 'jsonl' || extension === 'ndjson' || extension === 'txt') {
    const text = buffer.toString('utf8');
    if (text.includes('**Course ID:**') && text.includes('## Modules')) return parseStructuredCourseText(text);
    return parseJsonText(text, extension);
  }
  throw new Error('Supported files are .xlsx, .json, and .jsonl.');
}

function stripMarkdown(value) {
  return cleanString(value
    ?.replace(/^\s*[*-]\s+/, '')
    .replace(/^(?:🔴|🟢)\s*/u, '')
    .replace(/\*\*/g, ''));
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return cleanString(markdown.match(new RegExp(`^\\*\\*${escaped}:\\*\\*[ \\t]*(.*)$`, 'mi'))?.[1]);
}

function inferToolNameFromMarkdown(markdown) {
  const searchableText = `${field(markdown, 'Title') || ''} ${field(markdown, 'Tools Covered') || ''}`.toLowerCase();
  const knownTools = [...new Set(['ChatGPT', 'Gemini', ...vendorByTool.keys()])]
    .sort((left, right) => right.length - left.length);
  return knownTools.find((toolName) => searchableText.includes(toolName.toLowerCase())) || null;
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`^#{1,4}\\s+${escaped}\\s*$`, 'mi').exec(markdown);
  if (!match) return '';
  const rest = markdown.slice(match.index + match[0].length);
  const nextHeading = /^#{1,4}\s+.+$/m.exec(rest);
  return (nextHeading ? rest.slice(0, nextHeading.index) : rest).trim();
}

function bulletItems(markdown) {
  return [...markdown.matchAll(/^\s*[*-]\s+(.+)$/gm)]
    .map((match) => stripMarkdown(match[1]))
    .filter(Boolean);
}

function inferTechnologyCategories(toolName) {
  if (['Make.com', 'n8n', 'Zapier'].includes(toolName)) return ['Automation / No-Code'];
  if (['Amazon Q Developer', 'Bolt.new', 'Claude Code', 'Codex', 'Cursor', 'Firebase Studio', 'Gemini Code Assist', 'GitHub Copilot', 'JetBrains AI Assistant', 'Lovable.dev', 'Replit', 'Windsurf'].includes(toolName)) {
    return ['DevOps & Development Tools'];
  }
  if (['Adobe', 'Canva', 'DALL·E', 'Google Veo', 'HeyGen', 'Higgsfield', 'Midjourney', 'Nano Banana', 'Pika', 'Seedance', 'Synthesia'].includes(toolName)) {
    return ['Design, Content & Learning'];
  }
  return ['AI'];
}

function inferDepartmentFromMarkdown(markdown) {
  const title = field(markdown, 'Title') || '';
  return cleanString(title.match(/\bfor\s+(.+?):/i)?.[1]);
}

function parseStructuredCourseText(text) {
  const toolsRowHeader = /^(?<tool>[^\t\r\n]+)\t(?<duration>[^\t\r\n]+)\t"(?=\*\*Course ID:\*\*)/gm;
  const roleRowHeader = /^(?<headerCourseId>RB\d{4,})\t(?<tool>[^\t\r\n]+)\t(?<department>[^\t\r\n]+)\t(?<duration>[^\t\r\n]+)\t"(?=\*\*Course ID:\*\*)/gm;
  let normalizedText = text;
  let rowHeader = roleRowHeader;
  let headers = [...normalizedText.matchAll(rowHeader)];
  if (headers.length === 0) {
    rowHeader = toolsRowHeader;
    headers = [...normalizedText.matchAll(rowHeader)];
  }
  const standaloneMarkdown = text.trimStart().replace(/^"/, '');
  if (headers.length === 0 && field(standaloneMarkdown, 'Course ID')) {
    const courseId = field(standaloneMarkdown, 'Course ID').toUpperCase();
    const toolName = inferToolNameFromMarkdown(standaloneMarkdown);
    const duration = field(standaloneMarkdown, 'Duration');
    if (!toolName) throw new Error('Could not infer the tool name from the standalone course title or tools covered.');
    if (!duration) throw new Error('The standalone course is missing a duration.');
    if (courseId.startsWith('RB')) {
      const department = inferDepartmentFromMarkdown(standaloneMarkdown);
      if (!department) throw new Error('Could not infer the department from the standalone Role-Based course title.');
      rowHeader = roleRowHeader;
      normalizedText = `${courseId}\t${toolName}\t${department}\t${duration}\t"${standaloneMarkdown}`;
    } else {
      rowHeader = toolsRowHeader;
      normalizedText = `${toolName}\t${duration}\t"${standaloneMarkdown}`;
    }
    headers = [...normalizedText.matchAll(rowHeader)];
  }
  if (headers.length === 0) throw new Error('No structured course records were found.');

  const records = headers.map((header, index) => {
    const bodyStart = header.index + header[0].length;
    const bodyEnd = index + 1 < headers.length ? headers[index + 1].index : normalizedText.length;
    const markdown = normalizedText.slice(bodyStart, bodyEnd).trim().replace(/"\s*$/, '').trim();
    const toolName = cleanString(header.groups.tool);
    const courseId = field(markdown, 'Course ID')?.toUpperCase();
    const category = courseId?.startsWith('RB') ? 'role-based' : 'tools-technology';
    const durationText = field(markdown, 'Duration') || header.groups.duration;
    const durationHours = Number.parseFloat(durationText);
    const toolsCovered = (field(markdown, 'Tools Covered') || '').split(',').map(cleanString).filter(Boolean);

    const moduleHeadings = [...markdown.matchAll(/^#{1,4}\s+Module\s+(\d+):\s*(.+)$/gmi)];
    const appliedHeading = /^#{1,4}\s+Applied Business Scenarios?\s*$/mi.exec(markdown);
    const modules = moduleHeadings.map((moduleHeading, moduleIndex) => {
      const contentStart = moduleHeading.index + moduleHeading[0].length;
      const nextModule = moduleHeadings[moduleIndex + 1]?.index;
      const contentEnd = nextModule ?? appliedHeading?.index ?? markdown.length;
      const content = markdown.slice(contentStart, contentEnd);
      const concepts = [];
      const practicalActivities = [];
      for (const bullet of [...content.matchAll(/^\s*[*-]\s+(.+)$/gm)]) {
        const rawItem = bullet[1];
        const cleaned = stripMarkdown(rawItem);
        if (!cleaned) continue;
        if (/^🟢/.test(rawItem)) practicalActivities.push(cleaned);
        else concepts.push(cleaned);
      }
      return {
        moduleCode: moduleHeading[1].padStart(2, '0'),
        title: stripMarkdown(moduleHeading[2]),
        concepts,
        practicalActivities,
      };
    });

    const scenarioArea = (appliedHeading ? markdown.slice(appliedHeading.index + appliedHeading[0].length) : '')
      .replace(/(?:\r?\n)+\s*\[\d+\]:[^\r\n]*(?:(?:\r?\n)+\s*\[\d+\]:[^\r\n]*)*\s*$/g, '')
      .trim();
    const scenarioHeadings = [...scenarioArea.matchAll(/^#{1,4}\s+Scenario\s+\d+:\s*(.+)$/gmi)];
    const scenarios = scenarioHeadings.map((scenarioHeading, scenarioIndex) => {
      const contentStart = scenarioHeading.index + scenarioHeading[0].length;
      const contentEnd = scenarioHeadings[scenarioIndex + 1]?.index ?? scenarioArea.length;
      const content = scenarioArea.slice(contentStart, contentEnd).trim();
      const workflowMatch = /^\*\*(.+)\*\*\s*$/m.exec(content);
      const description = cleanString(
        (workflowMatch ? content.slice(workflowMatch.index + workflowMatch[0].length) : content)
          .replace(/"\s*$/, '')
          .trim(),
      );
      return {
        title: stripMarkdown(scenarioHeading[1]),
        workflow: stripMarkdown(workflowMatch?.[1]),
        description,
      };
    });

    const record = {
      __sourceRow: index + 1,
      __headerCourseId: cleanString(header.groups.headerCourseId)?.toUpperCase() || null,
      courseId,
      category,
      title: field(markdown, 'Title'),
      level: field(markdown, 'Level'),
      durationMinutes: durationHours * 60,
      format: field(markdown, 'Format'),
      delivery: field(markdown, 'Delivery'),
      summary: null,
      objectives: bulletItems(section(markdown, 'Programme Objectives')),
      toolsCovered,
      audiences: bulletItems(section(markdown, 'Who Should Attend')),
      prerequisites: bulletItems(section(markdown, 'Prerequisites')),
      modules,
      scenarios,
    };

    if (category === 'role-based') {
      return {
        ...record,
        industry: null,
        department: cleanString(header.groups.department) || inferDepartmentFromMarkdown(markdown),
        functionName: cleanString(header.groups.department) || inferDepartmentFromMarkdown(markdown),
        roleTitle: null,
        imageUrl: null,
        relatedSkills: toolsCovered,
      };
    }

    return {
      ...record,
      toolName,
      vendor: vendorByTool.get(toolName) || toolName,
      toolLogoUrl: null,
      skillArea: 'Artificial Intelligence',
      technologyCategories: inferTechnologyCategories(toolName),
    };
  });

  return { records, sourceIssues: [] };
}

function parseJsonText(text, extension) {
  const sourceIssues = [];
  if (extension === 'json') {
    const parsed = JSON.parse(text);
    const records = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.courses) ? parsed.courses : [parsed];
    return {
      records: records.map((record, index) => ({ ...record, __sourceRow: index + 1 })),
      sourceIssues,
    };
  }

  const records = [];
  text.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) return;
    try {
      const record = JSON.parse(line);
      if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('Line must contain one JSON object.');
      records.push({ ...record, __sourceRow: index + 1 });
    } catch (error) {
      sourceIssues.push(issue('error', 'INVALID_JSON', index + 1, null, 'record', error.message));
    }
  });
  return { records, sourceIssues };
}

async function parseWorkbook(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const courseRows = sheetRows(findSheet(workbook, 'Courses'));
  if (courseRows.length === 0) throw new Error('The Courses sheet is missing or contains no data rows.');

  const records = courseRows.map((row) => {
    const hours = Number(row.durationhours);
    const minutes = Number(row.durationminutes);
    return {
      __sourceRow: row.__sourceRow,
      courseId: row.courseid,
      category: row.category || (cleanString(row.courseid)?.toUpperCase().startsWith('RB') ? 'role-based' : 'tools-technology'),
      title: row.title,
      toolName: row.toolname,
      vendor: row.vendor,
      industry: row.industry,
      department: row.department,
      functionName: row.functionname,
      roleTitle: row.roletitle,
      imageUrl: row.imageurl,
      relatedSkills: splitList(row.relatedskills),
      level: row.level,
      durationMinutes: Number.isFinite(minutes) && minutes > 0 ? minutes : hours * 60,
      format: row.format,
      delivery: row.delivery,
      summary: row.summary,
      toolsCovered: splitList(row.toolscovered),
      technologyCategories: splitList(row.technologycategories),
      skillArea: row.skillarea,
      toolLogoUrl: row.toollogourl,
      objectives: splitList(row.objectives),
      audiences: splitList(row.audiences),
      prerequisites: splitList(row.prerequisites),
      modules: [],
      scenarios: [],
    };
  });

  const byId = new Map(records.map((record) => [cleanString(record.courseId)?.toUpperCase(), record]));
  const sourceIssues = [];
  const attachList = (sheetName, target, valueColumn) => {
    for (const row of sheetRows(findSheet(workbook, sheetName))) {
      const courseId = cleanString(row.courseid)?.toUpperCase();
      const record = byId.get(courseId);
      if (!record) {
        sourceIssues.push(issue('error', 'ORPHAN_CHILD_ROW', row.__sourceRow, courseId, sheetName, `${sheetName} row refers to a Course ID that is not in Courses.`));
        continue;
      }
      const value = cleanString(row[valueColumn]);
      if (value) record[target].push(value);
    }
  };

  attachList('Objectives', 'objectives', 'objective');
  attachList('Audiences', 'audiences', 'audience');
  attachList('Prerequisites', 'prerequisites', 'prerequisite');

  for (const row of sheetRows(findSheet(workbook, 'Modules'))) {
    const courseId = cleanString(row.courseid)?.toUpperCase();
    const record = byId.get(courseId);
    if (!record) {
      sourceIssues.push(issue('error', 'ORPHAN_CHILD_ROW', row.__sourceRow, courseId, 'Modules', 'Module row refers to a Course ID that is not in Courses.'));
      continue;
    }
    record.modules.push({
      moduleCode: row.modulecode,
      title: row.moduletitle || row.title,
      concepts: splitList(row.concepts),
      practicalActivities: splitList(row.practicalactivities),
    });
  }

  for (const row of sheetRows(findSheet(workbook, 'Scenarios'))) {
    const courseId = cleanString(row.courseid)?.toUpperCase();
    const record = byId.get(courseId);
    if (!record) {
      sourceIssues.push(issue('error', 'ORPHAN_CHILD_ROW', row.__sourceRow, courseId, 'Scenarios', 'Scenario row refers to a Course ID that is not in Courses.'));
      continue;
    }
    record.scenarios.push({ title: row.title, workflow: row.workflow, description: row.description });
  }

  return { records, sourceIssues };
}

export function validateCourseRecords(records, sourceIssues = []) {
  const issues = [...sourceIssues];
  const normalized = [];
  const seenIds = new Map();
  let batchCategory = null;
  const add = (...arguments_) => issues.push(issue(...arguments_));

  records.forEach((raw, index) => {
    const sourceRow = raw.__sourceRow || index + 1;
    const courseId = cleanString(raw.courseId)?.toUpperCase() || null;
    const category = cleanString(raw.category) || (courseId?.startsWith('RB') ? 'role-based' : 'tools-technology');
    if (!batchCategory) batchCategory = category;
    else if (category !== batchCategory) {
      add('error', 'MIXED_CATEGORY_BATCH', sourceRow, courseId, 'category', `This batch starts with ${batchCategory} records; import ${category} records separately.`);
    }
    const expectedPrefix = category === 'role-based' ? 'RB' : 'TT';
    if (!courseId || !new RegExp(`^${expectedPrefix}\\d{4,}$`).test(courseId)) {
      add('error', 'INVALID_COURSE_ID', sourceRow, courseId, 'courseId', `Course ID must use ${expectedPrefix} followed by at least four digits.`);
    } else if (seenIds.has(courseId)) {
      add('error', 'DUPLICATE_COURSE_ID', sourceRow, courseId, 'courseId', `Course ID already appeared on row ${seenIds.get(courseId)}.`);
    } else seenIds.set(courseId, sourceRow);
    if (raw.__headerCourseId && cleanString(raw.__headerCourseId)?.toUpperCase() !== courseId) {
      add('error', 'HEADER_COURSE_ID_MISMATCH', sourceRow, courseId, 'courseId', `Header Course ID ${raw.__headerCourseId} does not match the Markdown Course ID ${courseId}.`);
    }

    if (!['tools-technology', 'role-based'].includes(category)) {
      add('error', 'INVALID_CATEGORY', sourceRow, courseId, 'category', 'Only tools-technology and role-based records are accepted.');
    }

    const title = cleanString(raw.title);
    const toolName = cleanString(raw.toolName);
    const department = cleanString(raw.department);
    if (!title) add('error', 'MISSING_TITLE', sourceRow, courseId, 'title', 'Title is required.');
    if (category === 'tools-technology' && !toolName) add('error', 'MISSING_TOOL_NAME', sourceRow, courseId, 'toolName', 'Tool Name is required.');
    if (category === 'role-based' && !department) add('error', 'MISSING_DEPARTMENT', sourceRow, courseId, 'department', 'Department is required for a Role-Based course.');

    const durationMinutes = Number(raw.durationMinutes);
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      add('error', 'INVALID_DURATION', sourceRow, courseId, 'durationMinutes', 'Duration must be a positive whole number of minutes.');
    }

    let level = cleanString(raw.level);
    if (!level && levelByDuration.has(durationMinutes)) {
      level = levelByDuration.get(durationMinutes);
      add('warning', 'LEVEL_INFERRED', sourceRow, courseId, 'level', 'Level inferred from duration.', level);
    } else if (!level) add('error', 'MISSING_LEVEL', sourceRow, courseId, 'level', 'Level is required.');
    else if (!allowedLevels.has(level)) add('error', 'INVALID_LEVEL', sourceRow, courseId, 'level', `Level must be one of: ${[...allowedLevels].join(', ')}.`);

    const defaults = toolDefaults.get(toolName?.toLowerCase());
    let vendor = cleanString(raw.vendor);
    if (category === 'tools-technology' && !vendor && defaults) {
      vendor = defaults.vendor;
      add('warning', 'VENDOR_INFERRED', sourceRow, courseId, 'vendor', 'Vendor inferred from Tool Name.', vendor);
    } else if (category === 'tools-technology' && !vendor) add('error', 'MISSING_VENDOR', sourceRow, courseId, 'vendor', 'Vendor is required.');

    const list = (value) => splitList(value);
    const objectives = list(raw.objectives);
    if (objectives.length === 0) add('error', 'MISSING_OBJECTIVES', sourceRow, courseId, 'objectives', 'At least one objective is required.');
    let summary = cleanString(raw.summary);
    if (!summary && objectives.length > 0) {
      summary = objectives[0];
      add('warning', 'SUMMARY_DERIVED', sourceRow, courseId, 'summary', 'Summary derived from the first objective.', summary);
    }

    const moduleCodes = new Set();
    const modules = Array.isArray(raw.modules) ? raw.modules.map((module, moduleIndex) => {
      const rawCode = cleanString(module?.moduleCode) || String(moduleIndex + 1);
      const moduleCode = /^\d+$/.test(rawCode) ? rawCode.padStart(2, '0') : rawCode;
      const moduleTitle = cleanString(module?.title);
      const concepts = list(module?.concepts);
      const practicalActivities = list(module?.practicalActivities);
      if (moduleCodes.has(moduleCode)) add('error', 'DUPLICATE_MODULE_CODE', sourceRow, courseId, `modules[${moduleIndex}].moduleCode`, `Duplicate Module Code ${moduleCode}.`);
      moduleCodes.add(moduleCode);
      if (!moduleTitle) add('error', 'MISSING_MODULE_TITLE', sourceRow, courseId, `modules[${moduleIndex}].title`, 'Module title is required.');
      if (concepts.length === 0 && practicalActivities.length === 0) add('warning', 'EMPTY_MODULE_CONTENT', sourceRow, courseId, `modules[${moduleIndex}]`, 'Module has no concepts or practical activities.');
      return { moduleCode, title: moduleTitle, concepts, practicalActivities };
    }) : [];
    if (modules.length === 0) add('error', 'MISSING_MODULES', sourceRow, courseId, 'modules', 'At least one module is required.');

    const scenarios = Array.isArray(raw.scenarios) ? raw.scenarios.map((scenario, scenarioIndex) => {
      const scenarioTitle = cleanString(scenario?.title);
      const workflow = cleanString(scenario?.workflow);
      const description = cleanString(scenario?.description);
      if (!scenarioTitle) add('error', 'MISSING_SCENARIO_TITLE', sourceRow, courseId, `scenarios[${scenarioIndex}].title`, 'Scenario title is required.');
      if (!description) add('error', 'MISSING_SCENARIO_DESCRIPTION', sourceRow, courseId, `scenarios[${scenarioIndex}].description`, 'Scenario description is required.');
      return { title: scenarioTitle, workflow, description };
    }) : [];

    const normalizedCourse = {
      courseId,
      category,
      title,
      level,
      durationMinutes,
      format: cleanString(raw.format),
      delivery: cleanString(raw.delivery),
      summary,
      objectives,
      toolsCovered: list(raw.toolsCovered),
      audiences: list(raw.audiences),
      prerequisites: list(raw.prerequisites),
      modules,
      scenarios,
    };

    if (category === 'role-based') {
      normalized.push({
        ...normalizedCourse,
        industry: cleanString(raw.industry),
        department,
        functionName: cleanString(raw.functionName) || department,
        roleTitle: cleanString(raw.roleTitle),
        imageUrl: cleanString(raw.imageUrl),
        relatedSkills: list(raw.relatedSkills).length > 0 ? list(raw.relatedSkills) : list(raw.toolsCovered),
      });
    } else {
      normalized.push({
        ...normalizedCourse,
        toolName,
        vendor,
        toolLogoUrl: cleanString(raw.toolLogoUrl),
        skillArea: cleanString(raw.skillArea) || defaults?.skillArea || null,
        technologyCategories: list(raw.technologyCategories).length > 0
          ? list(raw.technologyCategories)
          : defaults?.technologyCategories || [],
      });
    }
  });

  const errorCount = issues.filter((item) => item.severity === 'error').length;
  const warningCount = issues.filter((item) => item.severity === 'warning').length;
  return {
    courses: normalized,
    issues,
    counts: { records: records.length, errors: errorCount, warnings: warningCount },
    valid: errorCount === 0 && normalized.length > 0,
  };
}

export const validateToolsRecords = validateCourseRecords;

export function coursesToJsonl(courses) {
  return `${courses.map((course) => JSON.stringify(course)).join('\n')}\n`;
}
