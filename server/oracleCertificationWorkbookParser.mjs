const VISIBLE_REQUIREMENT_TYPES = /^(?:recommended experience|recommended preparation|candidate expectation|knowledge requirement|exam readiness|eligibility|delta eligibility|assessment requirement|certification requirement|learning path requirement|prerequisite|prerequisite credential|formal prerequisite|required exam|required credential|credential status|certification access requirement)$/i;

function text(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  if (!normalized || /^(nan|null|undefined)$/i.test(normalized)) return null;
  return normalized;
}

function first(row, ...columns) {
  for (const column of columns) {
    const value = text(row?.[column]);
    if (value) return value;
  }
  return null;
}

function splitList(value) {
  const normalized = text(value);
  if (!normalized) return [];
  return [...new Set(normalized
    .split(/\s*(?:;|\r?\n)\s*/)
    .map((item) => item.trim())
    .filter(Boolean))];
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

function groupById(rows) {
  const grouped = new Map();
  const unmapped = [];
  for (const row of rows || []) {
    const id = first(row, 'Certification ID');
    if (!id) {
      unmapped.push(row);
      continue;
    }
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id).push(row);
  }
  return { grouped, unmapped };
}

function relatedRows(grouped, sourceIds) {
  return sourceIds.flatMap((sourceId) => grouped.get(sourceId) || []);
}

function parseDurationMinutes(value) {
  const normalized = text(value);
  if (!normalized) return null;
  if (/^\d+(?:\.\d+)?$/.test(normalized)) return Math.round(Number(normalized));
  const hours = normalized.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
  const minutes = normalized.match(/(\d+)\s*(?:minutes?|mins?)/i);
  if (!hours && !minutes) return null;
  return Math.round((hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0));
}

function normalizeLevel(value) {
  const normalized = text(value)?.toLowerCase();
  if (!normalized) return null;
  if (/foundational|foundation|beginner/.test(normalized)) return 'Basic';
  if (/associate|intermediate|specialist/.test(normalized)) return 'Intermediate';
  if (/professional|advanced/.test(normalized)) return 'Advanced';
  if (/expert|master/.test(normalized)) return 'Expert';
  return null;
}

function combinePrice(price, currency) {
  const normalizedPrice = text(price);
  const normalizedCurrency = text(currency);
  if (!normalizedPrice) return null;
  if (!normalizedCurrency || /^(?:free|[A-Z]{3}\s|[$€£₹])/i.test(normalizedPrice)) return normalizedPrice;
  return `${normalizedCurrency} ${normalizedPrice}`;
}

function mergeRows(rows) {
  const merged = {};
  const conflicts = [];
  for (const row of rows) {
    for (const [column, value] of Object.entries(row)) {
      if (column === '__rowNumber' || !value) continue;
      if (!merged[column]) merged[column] = value;
      else if (merged[column] !== value) conflicts.push({ column, kept: merged[column], alternate: value });
    }
  }
  return { merged, conflicts };
}

function buildExam(row, credentialType) {
  const durationMinutes = parseDurationMinutes(row['Duration (min)']);
  const notes = [
    first(row, 'Practice assessment available')
      ? `Practice assessment available: ${first(row, 'Practice assessment available')}`
      : null,
    first(row, 'Exam retirement date')
      ? `Exam retirement date: ${first(row, 'Exam retirement date')}`
      : null,
  ].filter(Boolean).join('\n') || null;

  return {
    examCode: first(row, 'Exam code'),
    examName: first(row, 'Certification name'),
    examStatus: first(row, 'Exam status'),
    requirementType: /assessment/i.test(credentialType || '')
      ? 'Delta assessment'
      : /^exam$/i.test(credentialType || '') ? 'Exam' : 'Required exam',
    durationMinutes,
    durationText: durationMinutes ? `${durationMinutes} min` : null,
    deliveryFormat: first(row, 'Proctored') ? 'Proctored exam' : null,
    deliveryProvider: first(row, 'Delivery provider'),
    proctored: first(row, 'Proctored'),
    languages: splitList(row.Languages),
    price: combinePrice(row.Price, row.Currency),
    currency: first(row, 'Currency'),
    passingScore: first(row, 'Passing score'),
    examUrl: first(row, 'Exam URL'),
    notes,
  };
}

function buildFallbackExam(master, credentialType) {
  const examCode = first(master, 'Exam code');
  const durationMinutes = parseDurationMinutes(master['Exam duration (min)']);
  if (!examCode && !durationMinutes) return null;
  return {
    examCode,
    examName: first(master, 'Certification name'),
    examStatus: first(master, 'Certification status'),
    requirementType: /assessment/i.test(credentialType || '')
      ? 'Delta assessment'
      : /^exam$/i.test(credentialType || '') ? 'Exam' : 'Required exam',
    durationMinutes,
    durationText: durationMinutes ? `${durationMinutes} min` : null,
    deliveryFormat: null,
    deliveryProvider: first(master, 'Maintainer'),
    proctored: null,
    languages: splitList(master.Languages),
    price: combinePrice(master.Price, master.Currency),
    currency: first(master, 'Currency'),
    passingScore: null,
    examUrl: first(master, 'Certification URL'),
    notes: null,
  };
}

function buildTrainingResources(rows) {
  return rows.flatMap((row) => {
    const resources = [];
    const courseTitle = first(row, 'Training course');
    const learningPathTitle = first(row, 'Learning path');
    if (courseTitle) {
      resources.push({
        resourceType: 'Training course',
        title: courseTitle,
        resourceUrl: first(row, 'Training course URL'),
        durationText: first(row, 'Duration'),
        itemCount: first(row, 'Modules'),
        relationship: 'Recommended preparation',
        notes: null,
      });
    }
    if (learningPathTitle) {
      resources.push({
        resourceType: 'Learning path',
        title: learningPathTitle,
        resourceUrl: first(row, 'Learning path URL'),
        durationText: first(row, 'Duration'),
        itemCount: first(row, 'Modules'),
        relationship: 'Recommended preparation',
        notes: null,
      });
    }
    return resources;
  });
}

function visibleRequirements(rows) {
  return rows
    .filter((row) => VISIBLE_REQUIREMENT_TYPES.test(first(row, 'Requirement type') || ''))
    .map((row) => ({
      requirementType: first(row, 'Requirement type'),
      requirementGroup: first(row, 'Requirement group'),
      requirement: first(row, 'Requirement'),
      requirementUrl: first(row, 'Requirement URL'),
      qualifier: null,
      notes: first(row, 'Notes'),
    }))
    .filter((item) => item.requirement);
}

function certificationIdentity(row) {
  return `${first(row, 'Company') || ''}\u0000${(first(row, 'Certification name') || '').toLocaleLowerCase()}`;
}

export function buildOracleCertificationRecords(sheets) {
  const masterRows = sheets.Catalog_Master || [];
  const examGroups = groupById(sheets.Exam_Details || []);
  const blueprintGroups = groupById(sheets.Exam_Blueprint || []);
  const trainingGroups = groupById(sheets.Training || []);
  const requirementGroups = groupById(sheets.Requirements || []);
  const flexibleGroups = groupById(sheets.Flexible_Details || []);
  const qcGroups = groupById(sheets.QC || []);

  const identityGroups = new Map();
  for (const row of masterRows) {
    const sourceId = first(row, 'Certification ID');
    const title = first(row, 'Certification name');
    const provider = first(row, 'Company');
    if (!sourceId || !title || !provider) {
      throw new Error(`Oracle Catalog_Master row ${row.__rowNumber || '?'} is missing Certification ID, Company, or Certification name.`);
    }
    const identity = certificationIdentity(row);
    if (!identityGroups.has(identity)) identityGroups.set(identity, []);
    identityGroups.get(identity).push(row);
  }

  const courses = [];
  const conflicts = [];
  for (const rows of identityGroups.values()) {
    const { merged: master, conflicts: masterConflicts } = mergeRows(rows);
    const sourceIds = rows.map((row) => first(row, 'Certification ID'));
    const sourceGlobalId = sourceIds[0];
    if (masterConflicts.length) conflicts.push({ sourceGlobalId, sourceIds, conflicts: masterConflicts });

    const provider = first(master, 'Company');
    const title = first(master, 'Certification name');
    const inferredType = sourceGlobalId.includes('-ASMT-') ? 'Assessment' : 'Exam';
    const credentialType = first(master, 'Credential type') || inferredType;
    const relatedExams = relatedRows(examGroups.grouped, sourceIds);
    let exams = deduplicate(
      relatedExams.map((row) => buildExam(row, credentialType)),
      (item) => `${item.examCode || ''}\u0000${item.examUrl || ''}`,
    );
    if (exams.length === 0) {
      const fallback = buildFallbackExam(master, credentialType);
      if (fallback) exams = [fallback];
    }

    const objectives = deduplicate(
      relatedRows(blueprintGroups.grouped, sourceIds).map((row) => ({
        groupTitle: null,
        objective: first(row, 'Assessed domain / skill'),
        weight: first(row, 'Weight'),
        objectiveLevel: null,
        objectiveCode: null,
      })).filter((item) => item.objective),
      (item) => `${item.objective.toLocaleLowerCase()}\u0000${item.weight || ''}`,
    );

    let requirements = deduplicate(
      visibleRequirements(relatedRows(requirementGroups.grouped, sourceIds)),
      (item) => `${item.requirementType || ''}\u0000${item.requirement.toLocaleLowerCase()}`,
    );
    if (requirements.length === 0 && first(master, 'Prerequisites summary')) {
      requirements = [{
        requirementType: 'Prerequisite',
        requirementGroup: null,
        requirement: first(master, 'Prerequisites summary'),
        requirementUrl: null,
        qualifier: null,
        notes: null,
      }];
    }

    const resources = deduplicate(
      buildTrainingResources(relatedRows(trainingGroups.grouped, sourceIds)),
      (item) => `${item.resourceType}\u0000${item.title.toLocaleLowerCase()}\u0000${item.resourceUrl || ''}`,
    );
    const renewalMonths = first(master, 'Renewal frequency (months)');
    const validityRenewal = renewalMonths ? `Every ${renewalMonths} months` : null;
    const lifecycle = [{
      recordType: 'Credential lifecycle',
      status: first(master, 'Certification status'),
      validityRenewal,
      retirementTransition: first(master, 'Certification retirement date'),
      details: first(master, 'Last updated') ? `Source last updated: ${first(master, 'Last updated')}` : null,
      scenario: null,
      option: null,
      action: null,
      outcome: null,
    }].filter((item) => item.status || item.validityRenewal || item.retirementTransition || item.details);

    const qcRows = relatedRows(qcGroups.grouped, sourceIds);
    const durationMinutes = exams.find((exam) => exam.durationMinutes)?.durationMinutes
      || parseDurationMinutes(master['Exam duration (min)']);
    const languages = deduplicate([
      ...splitList(master.Languages),
      ...exams.flatMap((exam) => exam.languages),
    ], (item) => item.toLocaleLowerCase());
    const productTechnologies = deduplicate([
      ...splitList(master.Product),
      ...splitList(master.Category),
    ], (item) => item.toLocaleLowerCase());

    courses.push({
      sourceSheet: 'Catalog_Master',
      sourceGlobalId,
      sourceSequence: Number.parseInt(sourceGlobalId.replace(/\D/g, ''), 10),
      provider,
      providerCertificationId: sourceGlobalId,
      title,
      primaryExamCode: first(master, 'Exam code') || exams.find((exam) => exam.examCode)?.examCode || null,
      credentialType,
      credentialClassification: null,
      credentialStatus: first(master, 'Certification status'),
      credentialLevel: first(master, 'Level'),
      level: normalizeLevel(master.Level),
      categoryTrack: first(master, 'Category'),
      productTechnologies,
      audiences: splitList(master.Roles),
      skills: splitList(master.Subjects),
      summary: first(master, 'Summary', 'Candidate profile / overview')
        || `${title} is an Oracle ${credentialType.toLowerCase()}${first(master, 'Exam code') ? ` identified by exam code ${first(master, 'Exam code')}` : ''}${first(master, 'Product') ? ` and focused on ${first(master, 'Product')}` : ''}.`,
      prerequisitesSummary: first(master, 'Prerequisites summary'),
      requiredExamPathway: first(master, 'Required exams'),
      examFormatDelivery: exams.some((exam) => /yes/i.test(exam.proctored || '')) ? 'Proctored exam' : null,
      durationMinutes,
      examDurationText: durationMinutes ? `${durationMinutes} min` : null,
      timeLimitText: null,
      languages,
      priceText: combinePrice(master.Price, master.Currency),
      retakeFeeText: null,
      validityRenewal,
      courseUrl: first(master, 'Certification URL'),
      sourceQcStatus: first(master, 'QC status') || first(qcRows[0], 'Status'),
      exams,
      objectives,
      requirements,
      resources,
      lifecycle,
      rawPayload: {
        sourceIds,
        masterRows: rows,
        exams: relatedExams,
        objectives: relatedRows(blueprintGroups.grouped, sourceIds),
        requirements: relatedRows(requirementGroups.grouped, sourceIds),
        trainingResources: relatedRows(trainingGroups.grouped, sourceIds),
        flexibleDetails: relatedRows(flexibleGroups.grouped, sourceIds),
        qc: qcRows,
      },
    });
  }

  const masterIds = new Set(masterRows.map((row) => first(row, 'Certification ID')).filter(Boolean));
  const unmappedCount = (rows) => rows.filter((row) => {
    const id = first(row, 'Certification ID');
    return !id || !masterIds.has(id);
  }).length;

  return {
    courses,
    conflicts,
    duplicatesRemoved: masterRows.length - courses.length,
    unmappedSupportingRows: {
      exams: unmappedCount(sheets.Exam_Details || []),
      objectives: unmappedCount(sheets.Exam_Blueprint || []),
      requirements: unmappedCount(sheets.Requirements || []),
      resources: unmappedCount(sheets.Training || []),
      flexibleDetails: unmappedCount(sheets.Flexible_Details || []),
      qc: unmappedCount(sheets.QC || []),
    },
  };
}
