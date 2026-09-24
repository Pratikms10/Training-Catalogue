import ExcelJS from 'exceljs';
import { buildOracleCertificationRecords } from './oracleCertificationWorkbookParser.mjs';

const REQUIRED_SHEETS = [
  'Certification_Master',
  'Source_Master_All',
  'Exam_Details_All',
  'Objectives_All',
  'Requirements_All',
  'Training_Resources_All',
  'Skills_Audience_All',
  'Lifecycle_Renewal_All',
];

const ORACLE_REQUIRED_SHEETS = [
  'Catalog_Master',
  'Exam_Details',
  'Exam_Blueprint',
  'Training',
  'Requirements',
  'Flexible_Details',
  'QC',
];

function text(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  if (!normalized || /^(nan|null|undefined)$/i.test(normalized)) return null;
  return normalized;
}

function visibleText(value) {
  const normalized = text(value);
  if (!normalized) return null;
  if (/^(not supplied|not provided|not available)(\b|\s+in\b)/i.test(normalized)) return null;
  return normalized;
}

function splitList(value) {
  const normalized = visibleText(value);
  if (!normalized) return [];
  return [...new Set(normalized
    .split(/\s*(?:;|\r?\n)\s*/)
    .map((item) => item.trim())
    .filter(Boolean))];
}

function splitProductTechnologies(value) {
  return splitList(value).filter((item) => !/^(version|version\/basis|product\/version basis)\s*:/i.test(item));
}

function fallbackCredentialSummary({ provider, title, credentialType, examCode, product, status, track }) {
  const type = (credentialType || 'credential').toLowerCase();
  const focus = product || track;
  if (examCode) {
    return `${provider} lists ${title} as a ${type} assessed through exam ${examCode}${focus ? ` and focused on ${focus}` : ''}.`;
  }
  if (status) {
    const normalizedStatus = status.toLowerCase().replace(/coming soon/i, 'coming-soon');
    return `${provider} lists ${title} as a ${normalizedStatus} ${type}${track ? ` in its ${track} track` : ''}.`;
  }
  return `${provider} lists ${title} as a ${type}${focus ? ` focused on ${focus}` : ''}.`;
}

function parseDurationMinutes(...values) {
  for (const value of values) {
    const normalized = text(value);
    if (!normalized) continue;
    if (/^\d+(?:\.\d+)?$/.test(normalized)) return Math.round(Number(normalized));
    const hours = normalized.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
    const minutes = normalized.match(/(\d+)\s*(?:minutes?|mins?)/i);
    if (hours || minutes) {
      return Math.round((hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0));
    }
  }
  return null;
}

function normalizeLevel(value) {
  const normalized = text(value)?.toLowerCase();
  if (!normalized) return null;
  if (normalized === 'beginner') return 'Beginner';
  if (/foundational|fundamentals|nse\s*[1-3]/.test(normalized)) return 'Basic';
  if (/intermediate|associate|practitioner|technician|specialist|nse\s*[4-5]/.test(normalized)) return 'Intermediate';
  if (/advanced|professional|qualified|nse\s*[6-7]|industry/.test(normalized)) return 'Advanced';
  if (/expert|master|nse\s*8/.test(normalized)) return 'Expert';
  return null;
}

function effectiveGlobalId(row) {
  return text(row['Global ID']) || text(row['Mapped Global ID']);
}

function first(row, ...columns) {
  for (const column of columns) {
    const value = visibleText(row[column]);
    if (value) return value;
  }
  return null;
}

function readSheetRows(worksheet) {
  const headers = [];
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    headers[columnNumber] = text(cell.text);
  });

  const rows = [];
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const sourceRow = worksheet.getRow(rowNumber);
    const row = { __rowNumber: rowNumber };
    let hasValue = false;
    for (let columnNumber = 1; columnNumber < headers.length; columnNumber += 1) {
      const header = headers[columnNumber];
      if (!header) continue;
      const value = text(sourceRow.getCell(columnNumber).text);
      row[header] = value;
      if (value) hasValue = true;
    }
    if (hasValue) rows.push(row);
  }
  return rows;
}

function groupByGlobalId(rows) {
  const grouped = new Map();
  const unmapped = [];
  for (const row of rows || []) {
    const globalId = effectiveGlobalId(row);
    if (!globalId) {
      unmapped.push(row);
      continue;
    }
    if (!grouped.has(globalId)) grouped.set(globalId, []);
    grouped.get(globalId).push(row);
  }
  return { grouped, unmapped };
}

function deduplicate(items, keyBuilder) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyBuilder(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function combinePrice(row) {
  const price = first(row, 'Price', 'Global fee', 'Registration fee (USD)');
  const currency = first(row, 'Currency');
  if (!price) return null;
  if (/^[A-Z]{3}\s/i.test(price) || !currency) return price;
  return `${currency} ${price}`;
}

function buildExam(row) {
  const durationMinutes = parseDurationMinutes(
    row['Duration (min)'], row['Time limit (min)'], row['Exam duration'],
  );
  const durationText = first(row, 'Exam duration')
    || (durationMinutes ? `${durationMinutes} min` : null);
  const notes = [
    first(row, 'Availability note'),
    first(row, 'Exam content / question count'),
    first(row, 'Retake / scheduling note'),
  ].filter(Boolean).join('\n') || null;

  return {
    examCode: first(row, 'Exam code', 'Declared exam ID', 'Source variant code'),
    examName: first(row, 'Exam name'),
    examStatus: first(row, 'Exam status'),
    requirementType: first(row, 'Requirement type', 'Variant type'),
    durationMinutes,
    durationText,
    deliveryFormat: first(row, 'Exam delivery/format', 'Format', 'Delivery'),
    deliveryProvider: first(row, 'Delivery provider'),
    proctored: first(row, 'Proctored'),
    languages: splitList(row.Languages || row.Language),
    price: combinePrice(row),
    currency: first(row, 'Currency'),
    passingScore: first(row, 'Passing score'),
    examUrl: first(row, 'Exam URL'),
    notes,
  };
}

function buildFallbackExam(master) {
  const durationMinutes = parseDurationMinutes(master['Exam duration'], master['Time limit']);
  if (!first(master, 'Exam code', 'Exam format / delivery', 'Exam duration', 'Languages', 'Price')) return null;
  return {
    examCode: first(master, 'Exam code'),
    examName: null,
    examStatus: first(master, 'Status'),
    requirementType: null,
    durationMinutes,
    durationText: first(master, 'Exam duration', 'Time limit'),
    deliveryFormat: first(master, 'Exam format / delivery'),
    deliveryProvider: null,
    proctored: null,
    languages: splitList(master.Languages),
    price: first(master, 'Price'),
    currency: null,
    passingScore: null,
    examUrl: null,
    notes: null,
  };
}

function buildObjective(row) {
  const objective = first(row, 'Objective / skill', 'Objective', 'Assessed domain / skill');
  if (!objective) return null;
  return {
    groupTitle: first(row, 'Objective group', 'Objective section', 'Domain'),
    objective,
    weight: first(row, 'Weight', 'Weight (%)'),
    objectiveLevel: first(row, 'Objective level'),
    objectiveCode: first(row, 'Objective code'),
  };
}

function buildRequirement(row) {
  const requirement = first(row, 'Requirement', 'Prerequisite');
  if (!requirement) return null;
  return {
    requirementType: first(row, 'Requirement type'),
    requirementGroup: first(row, 'Requirement group'),
    requirement,
    requirementUrl: first(row, 'Requirement URL'),
    qualifier: first(row, 'Requirement strength', 'Strength / qualifier', 'Strength'),
    notes: first(row, 'Notes', 'Timing / window'),
  };
}

function buildResource(row) {
  const title = first(row, 'Training title', 'Training item', 'Training course', 'Resource title');
  if (!title) return null;
  return {
    resourceType: first(row, 'Resource type', 'Training item type', 'Training type'),
    title,
    resourceUrl: first(row, 'Training URL', 'Training item URL', 'Training course URL', 'Resource URL'),
    durationText: first(row, 'Duration'),
    itemCount: first(row, 'Modules', 'Units'),
    relationship: first(row, 'Relationship to certification', 'Requirement strength'),
    notes: first(row, 'Notes', 'Course prerequisites'),
  };
}

function buildLifecycleItem(row) {
  const item = {
    recordType: first(row, 'Record type'),
    status: first(row, 'Status'),
    validityRenewal: first(row, 'Validity / renewal'),
    retirementTransition: first(row, 'Retirement / transition'),
    details: first(row, 'Details'),
    scenario: first(row, 'Scenario'),
    option: first(row, 'Option'),
    action: first(row, 'Action'),
    outcome: first(row, 'Outcome'),
  };
  const hasCustomerFacingContent = [
    item.status,
    item.validityRenewal,
    item.retirementTransition,
    item.details,
    item.scenario,
    item.option,
    item.action,
    item.outcome,
  ].some(Boolean);
  return hasCustomerFacingContent ? item : null;
}

function mergeMasterRows(rows) {
  const merged = {};
  const conflicts = [];
  for (const row of rows) {
    for (const [column, value] of Object.entries(row)) {
      if (column === '__rowNumber' || !value) continue;
      if (!merged[column]) merged[column] = value;
      else if (merged[column] !== value) conflicts.push({ column, kept: merged[column], ignored: value });
    }
  }
  return { merged, conflicts };
}

export function buildCertificationRecords(sheets) {
  const masterGroups = groupByGlobalId(sheets.Certification_Master || []);
  const sourceGroups = groupByGlobalId(sheets.Source_Master_All || []);
  const examGroups = groupByGlobalId(sheets.Exam_Details_All || []);
  const objectiveGroups = groupByGlobalId(sheets.Objectives_All || []);
  const requirementGroups = groupByGlobalId(sheets.Requirements_All || []);
  const resourceGroups = groupByGlobalId(sheets.Training_Resources_All || []);
  const audienceGroups = groupByGlobalId(sheets.Skills_Audience_All || []);
  const lifecycleGroups = groupByGlobalId(sheets.Lifecycle_Renewal_All || []);

  const courses = [];
  const conflicts = [];
  for (const [globalId, rows] of masterGroups.grouped) {
    const mergedResult = mergeMasterRows(rows);
    const master = mergedResult.merged;
    if (mergedResult.conflicts.length) conflicts.push({ globalId, conflicts: mergedResult.conflicts });
    const source = sourceGroups.grouped.get(globalId)?.[0] || {};

    const provider = first(master, 'Vendor');
    const providerCertificationId = first(master, 'Vendor certification ID');
    const title = first(master, 'Certification name');
    if (!provider || !providerCertificationId || !title) {
      throw new Error(`${globalId} is missing provider, vendor certification ID, or certification name.`);
    }

    let exams = (examGroups.grouped.get(globalId) || []).map(buildExam);
    exams = deduplicate(exams, (item) => JSON.stringify(item));
    if (exams.length === 0) {
      const fallbackExam = buildFallbackExam(master);
      if (fallbackExam) exams = [fallbackExam];
    }

    const objectives = deduplicate(
      (objectiveGroups.grouped.get(globalId) || []).map(buildObjective).filter(Boolean),
      (item) => `${item.groupTitle || ''}\u0000${item.objective}`,
    );

    let requirements = deduplicate(
      (requirementGroups.grouped.get(globalId) || []).map(buildRequirement).filter(Boolean),
      (item) => `${item.requirementType || ''}\u0000${item.requirement}`,
    );
    if (requirements.length === 0) {
      requirements = [
        ...splitList(master.Prerequisites).map((requirement) => ({
          requirementType: 'Prerequisite', requirementGroup: null, requirement,
          requirementUrl: null, qualifier: null, notes: null,
        })),
        ...splitList(master['Required exam / pathway']).map((requirement) => ({
          requirementType: 'Required exam or pathway', requirementGroup: null, requirement,
          requirementUrl: null, qualifier: 'Required', notes: null,
        })),
      ];
    }

    const resources = deduplicate(
      (resourceGroups.grouped.get(globalId) || []).map(buildResource).filter(Boolean),
      (item) => `${item.resourceType || ''}\u0000${item.title}\u0000${item.resourceUrl || ''}`,
    );
    const lifecycle = deduplicate(
      (lifecycleGroups.grouped.get(globalId) || []).map(buildLifecycleItem).filter(Boolean),
      (item) => JSON.stringify(item),
    );

    const audienceRows = audienceGroups.grouped.get(globalId) || [];
    const audiences = deduplicate([
      ...splitList(master['Target role / audience']),
      ...audienceRows
        .filter((row) => /audience|job title|role/i.test(row['Detail type'] || ''))
        .flatMap((row) => splitList(row.Detail)),
    ], (item) => item.toLowerCase());
    const skills = deduplicate(
      audienceRows
        .filter((row) => /skill/i.test(row['Detail type'] || ''))
        .map((row) => visibleText(row.Detail))
        .filter(Boolean),
      (item) => item.toLowerCase(),
    );

    const productSource = first(master, 'Product / technology')
      || first(source, 'Product', 'Primary technology/product', 'Product / technology');
    const productTechnologies = splitProductTechnologies(productSource);
    const credentialType = first(master, 'Credential type') || 'Certification';
    const primaryExamCode = first(master, 'Exam code') || exams.find((exam) => exam.examCode)?.examCode || null;
    const summary = first(master, 'Summary / overview')
      || first(source, 'Summary', 'Summary / about', 'Overview', 'Candidate profile / overview');
    const courseUrl = first(master, 'Source URL')
      || first(source, 'Certification URL', 'Source URL');
    const credentialLevel = first(master, 'Level')
      || first(source, 'Certification level', 'Credential level', 'Level');
    const durationMinutes = parseDurationMinutes(master['Exam duration'], master['Time limit']);

    courses.push({
      sourceGlobalId: globalId,
      provider,
      providerCertificationId,
      title,
      primaryExamCode,
      credentialType,
      credentialClassification: first(master, 'Credential classification'),
      credentialStatus: first(master, 'Status'),
      credentialLevel,
      level: normalizeLevel(credentialLevel),
      categoryTrack: first(master, 'Category / track'),
      productTechnologies,
      audiences,
      skills,
      summary: summary || fallbackCredentialSummary({
        provider,
        title,
        credentialType,
        examCode: primaryExamCode,
        product: productTechnologies[0],
        status: first(master, 'Status'),
        track: first(master, 'Category / track'),
      }),
      prerequisitesSummary: first(master, 'Prerequisites'),
      requiredExamPathway: first(master, 'Required exam / pathway'),
      examFormatDelivery: first(master, 'Exam format / delivery'),
      durationMinutes,
      examDurationText: first(master, 'Exam duration'),
      timeLimitText: first(master, 'Time limit'),
      languages: splitList(master.Languages),
      priceText: first(master, 'Price'),
      retakeFeeText: first(master, 'Retake fee'),
      validityRenewal: first(master, 'Validity / renewal'),
      courseUrl,
      sourceQcStatus: first(master, 'Source QC status'),
      exams,
      objectives,
      requirements,
      resources,
      lifecycle,
      rawPayload: {
        master,
        source,
        exams: examGroups.grouped.get(globalId) || [],
        objectives: objectiveGroups.grouped.get(globalId) || [],
        requirements: requirementGroups.grouped.get(globalId) || [],
        trainingResources: resourceGroups.grouped.get(globalId) || [],
        skillsAudience: audienceRows,
        lifecycle: lifecycleGroups.grouped.get(globalId) || [],
      },
    });
  }

  return {
    courses,
    conflicts,
    duplicatesRemoved: (sheets.Certification_Master || []).length - courses.length,
    unmappedSupportingRows: {
      source: sourceGroups.unmapped.length,
      exams: examGroups.unmapped.length,
      objectives: objectiveGroups.unmapped.length,
      requirements: requirementGroups.unmapped.length,
      resources: resourceGroups.unmapped.length,
      audience: audienceGroups.unmapped.length,
      lifecycle: lifecycleGroups.unmapped.length,
    },
  };
}

export async function parseCertificationWorkbook(filePath) {
  const workbook = new ExcelJS.Workbook();
  // The source workbook contains table metadata that is irrelevant to the import
  // and is not consistently readable by ExcelJS. Cell values remain intact.
  await workbook.xlsx.readFile(filePath, { ignoreNodes: ['tableParts'] });
  const sheets = {};
  for (const worksheet of workbook.worksheets) {
    sheets[worksheet.name] = readSheetRows(worksheet);
  }

  const isOracleWorkbook = ORACLE_REQUIRED_SHEETS.every((sheetName) => workbook.getWorksheet(sheetName));
  if (isOracleWorkbook) return buildOracleCertificationRecords(sheets);

  const missingSheets = REQUIRED_SHEETS.filter((sheetName) => !workbook.getWorksheet(sheetName));
  if (missingSheets.length) {
    throw new Error(`Certification workbook is missing required sheet(s): ${missingSheets.join(', ')}`);
  }
  return buildCertificationRecords(sheets);
}
