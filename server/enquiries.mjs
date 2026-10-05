import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultWorkbookPath = path.join(projectRoot, 'data', 'private', 'website-enquiries.xlsx');
const submissionKinds = new Set(['course', 'organisation', 'trainer']);
const columns = [
  ['reference', 'Reference', 26],
  ['receivedAt', 'Received at (UTC)', 23],
  ['kind', 'Enquiry type', 19],
  ['name', 'Name', 28],
  ['email', 'Email', 35],
  ['phone', 'Phone', 22],
  ['company', 'Organisation', 30],
  ['service', 'Service / interest', 34],
  ['courseId', 'Course ID', 18],
  ['courseTitle', 'Course title', 48],
  ['courseCategory', 'Course category', 25],
  ['learners', 'Expected learners', 22],
  ['delivery', 'Preferred delivery', 33],
  ['notes', 'Message / requirements', 64],
  ['preferredChannel', 'Preferred channel', 20],
  ['trainerExpertise', 'Trainer expertise', 28],
  ['trainerExperience', 'Trainer experience', 22],
  ['profileUrl', 'Profile URL', 46],
  ['sourcePage', 'Source page', 36],
  ['submissionId', 'Submission ID', 38],
  ['ctaId', 'CTA ID', 38],
];
const actionColumns = [
  ['eventId', 'Event ID', 38],
  ['occurredAt', 'Occurred at (UTC)', 23],
  ['channel', 'Contact channel', 20],
  ['destination', 'Contact destination', 36],
  ['sourcePage', 'Source page', 36],
  ['ctaLabel', 'CTA label', 52],
];

let writeQueue = Promise.resolve();

export class EnquiryInputError extends Error {}
export class EnquiryStorageUnavailableError extends Error {}

function readText(body, key, maxLength, required = false) {
  const value = body[key];
  if (value == null || value === '') {
    if (required) throw new EnquiryInputError(`${key} is required.`);
    return '';
  }
  if (typeof value !== 'string') throw new EnquiryInputError(`${key} must be text.`);
  const trimmed = value.trim();
  if (required && !trimmed) throw new EnquiryInputError(`${key} is required.`);
  if (trimmed.length > maxLength) throw new EnquiryInputError(`${key} is too long.`);
  return trimmed;
}

export function validateEnquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new EnquiryInputError('Invalid enquiry.');
  }
  const kind = readText(body, 'kind', 20, true);
  if (!submissionKinds.has(kind)) throw new EnquiryInputError('Invalid enquiry type.');
  const submissionId = readText(body, 'submissionId', 36, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
    throw new EnquiryInputError('Invalid submission ID.');
  }
  const email = readText(body, 'email', 254, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new EnquiryInputError('Invalid email address.');
  const sourcePage = readText(body, 'sourcePage', 300, true);
  if (!sourcePage.startsWith('/') || sourcePage.startsWith('//')) {
    throw new EnquiryInputError('Invalid source page.');
  }
  const profileUrl = readText(body, 'profileUrl', 500);
  if (profileUrl) {
    try {
      const parsed = new URL(profileUrl);
      if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
    } catch {
      throw new EnquiryInputError('Invalid profile URL.');
    }
  }
  return {
    kind,
    submissionId: submissionId.toLowerCase(),
    name: readText(body, 'name', 160, true),
    email,
    phone: readText(body, 'phone', 40, kind === 'course'),
    company: readText(body, 'company', 200, kind !== 'trainer'),
    service: readText(body, 'service', 160, kind === 'organisation'),
    courseId: readText(body, 'courseId', 64),
    courseTitle: readText(body, 'courseTitle', 300),
    courseCategory: readText(body, 'courseCategory', 100),
    learners: readText(body, 'learners', 80),
    delivery: readText(body, 'delivery', 160),
    notes: readText(body, 'notes', 4000, true),
    preferredChannel: readText(body, 'preferredChannel', 30),
    trainerExpertise: readText(body, 'trainerExpertise', 160, kind === 'trainer'),
    trainerExperience: readText(body, 'trainerExperience', 80),
    profileUrl,
    sourcePage,
    ctaId: readText(body, 'ctaId', 80),
  };
}

function addSheet(workbook, name, sheetColumns = columns) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  sheet.columns = sheetColumns.map(([key, header, width]) => ({ key, header, width }));
  sheet.autoFilter = { from: 'A1', to: sheetColumns === columns ? 'U1' : 'F1' };
  sheet.getRow(1).height = 28;
  sheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17255D' } };
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle' };
  });
  return sheet;
}

function assertActionSheetShape(sheet) {
  if (!sheet) return;
  if (actionColumns.some(([, header], index) => sheet.getCell(1, index + 1).value !== header)) {
    throw new Error('The contact actions worksheet has an unexpected layout. No data was changed.');
  }
}

function assertWorkbookShape(workbook) {
  for (const name of ['Enquiries', 'Trainer applications']) {
    const sheet = workbook.getWorksheet(name);
    if (!sheet || columns.slice(0, 20).some(([, header], index) => sheet.getCell(1, index + 1).value !== header)) {
      throw new Error(`The enquiry workbook has an unexpected layout in ${name}. No data was changed.`);
    }
    const ctaHeader = sheet.getCell('U1');
    if (ctaHeader.value != null && ctaHeader.value !== '' && ctaHeader.value !== 'CTA ID') {
      throw new Error(`The enquiry workbook has an unexpected layout in ${name}. No data was changed.`);
    }
    if (!ctaHeader.value) {
      for (let row = 2; row <= sheet.rowCount; row += 1) {
        if (sheet.getCell(row, 21).value != null) {
          throw new Error(`The enquiry workbook has unexpected data in column U of ${name}. No data was changed.`);
        }
      }
      ctaHeader.value = 'CTA ID';
      ctaHeader.style = { ...sheet.getCell('T1').style };
      sheet.getColumn(21).width = 38;
      sheet.autoFilter = { from: 'A1', to: 'U1' };
    }
  }
}

function queueWrite(job) {
  const result = writeQueue.then(job);
  writeQueue = result.catch(() => {});
  return result;
}

export function saveEnquiryToWorkbook(enquiry, { filePath = process.env.LEADS_WORKBOOK_PATH || defaultWorkbookPath, reference: referenceOverride } = {}) {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    throw new EnquiryStorageUnavailableError('Excel storage is not configured for this deployment. Please contact us by phone or email.');
  }
  return queueWrite(async () => {
    const resolvedPath = path.resolve(filePath);
    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
    const workbook = new ExcelJS.Workbook();
    let workbookExists = true;
    try {
      await fs.access(resolvedPath);
    } catch (error) {
      if (error.code === 'ENOENT') workbookExists = false;
      else throw error;
    }
    if (workbookExists) {
      await workbook.xlsx.readFile(resolvedPath);
      assertWorkbookShape(workbook);
      assertActionSheetShape(workbook.getWorksheet('Contact actions'));
    } else {
      addSheet(workbook, 'Enquiries');
      addSheet(workbook, 'Trainer applications');
    }

    for (const sheet of workbook.worksheets) {
      for (let row = 2; row <= sheet.rowCount; row += 1) {
        if (sheet.getCell(row, 20).value === enquiry.submissionId) {
          return { reference: String(sheet.getCell(row, 1).value), duplicate: true };
        }
      }
    }

    const receivedAt = new Date();
    const reference = referenceOverride || `TE-${receivedAt.toISOString().slice(0, 10).replaceAll('-', '')}-${enquiry.submissionId.slice(0, 8).toUpperCase()}`;
    const sheet = workbook.getWorksheet(enquiry.kind === 'trainer' ? 'Trainer applications' : 'Enquiries');
    const values = { ...enquiry, reference, receivedAt };
    const row = sheet.addRow(columns.map(([key]) => values[key] ?? ''));
    row.getCell(2).numFmt = 'yyyy-mm-dd hh:mm:ss';
    row.alignment = { vertical: 'top', wrapText: false };
    row.getCell(14).alignment = { vertical: 'top', wrapText: true };
    row.height = 22;

    const temporaryPath = `${resolvedPath}.${process.pid}.${enquiry.submissionId}.tmp`;
    try {
      await workbook.xlsx.writeFile(temporaryPath);
      await fs.rename(temporaryPath, resolvedPath);
    } catch (error) {
      await fs.unlink(temporaryPath).catch(() => {});
      throw error;
    }
    return { reference, duplicate: false };
  });
}

export function saveContactActionToWorkbook(action, { filePath = process.env.LEADS_WORKBOOK_PATH || defaultWorkbookPath } = {}) {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    throw new EnquiryStorageUnavailableError('Excel storage is not configured for this deployment.');
  }
  return queueWrite(async () => {
    const resolvedPath = path.resolve(filePath);
    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
    const workbook = new ExcelJS.Workbook();
    let workbookExists = true;
    try { await fs.access(resolvedPath); } catch (error) {
      if (error.code === 'ENOENT') workbookExists = false;
      else throw error;
    }
    if (workbookExists) {
      await workbook.xlsx.readFile(resolvedPath);
      assertWorkbookShape(workbook);
    } else {
      addSheet(workbook, 'Enquiries');
      addSheet(workbook, 'Trainer applications');
    }
    let sheet = workbook.getWorksheet('Contact actions');
    assertActionSheetShape(sheet);
    if (!sheet) sheet = addSheet(workbook, 'Contact actions', actionColumns);
    for (let row = 2; row <= sheet.rowCount; row += 1) {
      if (sheet.getCell(row, 1).value === action.eventId) return { duplicate: true };
    }
    const row = sheet.addRow(actionColumns.map(([key]) => key === 'occurredAt' ? new Date() : action[key] ?? ''));
    row.getCell(2).numFmt = 'yyyy-mm-dd hh:mm:ss';
    row.height = 22;
    const temporaryPath = `${resolvedPath}.${process.pid}.${action.eventId}.tmp`;
    try {
      await workbook.xlsx.writeFile(temporaryPath);
      await fs.rename(temporaryPath, resolvedPath);
    } catch (error) {
      await fs.unlink(temporaryPath).catch(() => {});
      throw error;
    }
    return { duplicate: false };
  });
}
