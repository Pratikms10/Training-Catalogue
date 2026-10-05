import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import ExcelJS from 'exceljs';
import { saveEnquiryToWorkbook, validateEnquiry } from './enquiries.mjs';

const rawCourse = {
  submissionId: 'ebd1222f-08ce-4687-9c41-e74f353551ce',
  kind: 'course',
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+919876543210',
  company: 'Example Company',
  courseId: 'TT0003',
  courseTitle: 'ChatGPT Professional',
  courseCategory: 'tools-technology',
  learners: '10–25 Participants',
  delivery: 'Instructor-Led Virtual',
  notes: 'Please send a proposal.',
  sourcePage: '/catalogue/TT0003',
  ctaId: 'catalogue_course_hero_proposal',
};

let directory;
let workbookPath;

before(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'technoedge-enquiries-test-'));
  workbookPath = path.join(directory, 'enquiries.xlsx');
});

after(async () => {
  if (directory) await fs.rm(directory, { recursive: true, force: true });
});

test('validates required details before creating a workbook', () => {
  assert.throws(() => validateEnquiry({ ...rawCourse, email: 'not-an-email' }), /Invalid email/);
  assert.throws(() => validateEnquiry({ ...rawCourse, sourcePage: '//elsewhere.test' }), /Invalid source page/);
  assert.throws(() => validateEnquiry({ ...rawCourse, ctaId: 'x'.repeat(81) }), /ctaId is too long/);
});

test('saves a course enquiry to a readable private Excel workbook', async () => {
  const enquiry = validateEnquiry(rawCourse);
  const saved = await saveEnquiryToWorkbook(enquiry, { filePath: workbookPath });
  assert.match(saved.reference, /^TE-\d{8}-EBD1222F$/);
  assert.equal(saved.duplicate, false);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  const sheet = workbook.getWorksheet('Enquiries');
  assert.equal(sheet.rowCount, 2);
  assert.equal(sheet.getCell('D2').value, 'Test Customer');
  assert.equal(sheet.getCell('I2').value, 'TT0003');
  assert.equal(sheet.getCell('T2').value, rawCourse.submissionId);
  assert.equal(sheet.getCell('U1').value, 'CTA ID');
  assert.equal(sheet.getCell('U2').value, 'catalogue_course_hero_proposal');
  assert.equal(workbook.getWorksheet('Trainer applications').rowCount, 1);
});

test('upgrades a 20-column workbook without changing existing enquiries', async () => {
  const legacyPath = path.join(directory, 'legacy-enquiries.xlsx');
  const legacyWorkbook = new ExcelJS.Workbook();
  await legacyWorkbook.xlsx.readFile(workbookPath);
  for (const sheet of legacyWorkbook.worksheets) {
    sheet.getCell('U1').value = null;
    sheet.getCell('U2').value = null;
    sheet.autoFilter = { from: 'A1', to: 'T1' };
  }
  await legacyWorkbook.xlsx.writeFile(legacyPath);

  const nextEnquiry = validateEnquiry({
    ...rawCourse,
    submissionId: 'e8ad1234-5555-4abc-8765-998877665544',
    ctaId: 'catalogue_course_bottom_outline',
  });
  await saveEnquiryToWorkbook(nextEnquiry, { filePath: legacyPath });
  const upgraded = new ExcelJS.Workbook();
  await upgraded.xlsx.readFile(legacyPath);
  const sheet = upgraded.getWorksheet('Enquiries');
  assert.equal(sheet.getCell('D2').value, 'Test Customer');
  assert.equal(sheet.getCell('T2').value, rawCourse.submissionId);
  assert.equal(sheet.getCell('U1').value, 'CTA ID');
  assert.equal(sheet.getCell('U2').value, null);
  assert.equal(sheet.getCell('U3').value, 'catalogue_course_bottom_outline');
  assert.equal(upgraded.getWorksheet('Trainer applications').getCell('U1').value, 'CTA ID');
});

test('retrying the same submission ID does not duplicate the Excel row', async () => {
  const result = await saveEnquiryToWorkbook(validateEnquiry(rawCourse), { filePath: workbookPath });
  assert.equal(result.duplicate, true);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  assert.equal(workbook.getWorksheet('Enquiries').rowCount, 2);
});

test('trainer applications go to their own sheet', async () => {
  const trainer = validateEnquiry({
    submissionId: '3cf5c111-4b3d-48d4-84b6-480c77e5c63a',
    kind: 'trainer',
    name: 'Test Trainer',
    email: 'trainer@example.com',
    trainerExpertise: 'Cloud & DevOps',
    notes: 'I teach cloud engineering.',
    sourcePage: '/website/',
  });
  await saveEnquiryToWorkbook(trainer, { filePath: workbookPath });
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  assert.equal(workbook.getWorksheet('Trainer applications').getCell('D2').value, 'Test Trainer');
  assert.equal(workbook.getWorksheet('Enquiries').rowCount, 2);
});

test('E-Learning enquiries use the existing Enquiries sheet and preserve earlier rows', async () => {
  const elearning = validateEnquiry({
    submissionId: '72052c1a-d71e-477f-8062-86ea6b7f7ee1',
    kind: 'organisation',
    name: 'Test Learning Contact',
    email: 'learning@example.com',
    company: 'Example Company',
    service: 'E-Learning Solution',
    learners: '50–250 learners',
    delivery: 'Interactive e-learning',
    notes: 'Learning goal: Improve onboarding\nPreferred e-learning level: Level 2',
    sourcePage: '/e-learning/',
    ctaId: 'elearning_contact_enquiry',
  });
  await saveEnquiryToWorkbook(elearning, { filePath: workbookPath });
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  const sheet = workbook.getWorksheet('Enquiries');
  assert.equal(sheet.rowCount, 3);
  assert.equal(sheet.getCell('I2').value, 'TT0003');
  assert.equal(sheet.getCell('C3').value, 'organisation');
  assert.equal(sheet.getCell('H3').value, 'E-Learning Solution');
  assert.equal(sheet.getCell('L3').value, '50–250 learners');
  assert.equal(sheet.getCell('M3').value, 'Interactive e-learning');
  assert.equal(sheet.getCell('N3').value, 'Learning goal: Improve onboarding\nPreferred e-learning level: Level 2');
  assert.equal(sheet.getCell('S3').value, '/e-learning/');
  assert.equal(sheet.getCell('U3').value, 'elearning_contact_enquiry');
});
