import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import ExcelJS from 'exceljs';
import { validateContactAction } from './contactActions.mjs';
import { saveContactActionToWorkbook, saveEnquiryToWorkbook, validateEnquiry } from './enquiries.mjs';

const action = {
  eventId: 'bd2baaeb-00a1-44a0-a5f4-78b13986ab93',
  channel: 'whatsapp',
  destination: '919356433629',
  sourcePage: '/catalogue',
  ctaLabel: 'Chat with TechnoEdge on WhatsApp',
};

test('contact actions accept only bounded link metadata', () => {
  assert.deepEqual(validateContactAction(action), action);
  assert.throws(() => validateContactAction({ ...action, sourcePage: '//bad.example' }), /Invalid source page/);
  assert.throws(() => validateContactAction({ ...action, channel: 'form' }), /Invalid contact channel/);
  assert.throws(() => validateContactAction({ ...action, destination: 'javascript:alert(1)' }), /Invalid contact destination/);
});

test('a contact click gets its own Excel sheet and retries do not duplicate it', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'technoedge-contact-actions-'));
  const filePath = path.join(directory, 'enquiries.xlsx');
  try {
    assert.equal((await saveContactActionToWorkbook(action, { filePath })).duplicate, false);
    assert.equal((await saveContactActionToWorkbook(action, { filePath })).duplicate, true);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('Contact actions');
    assert.equal(sheet.rowCount, 2);
    assert.equal(sheet.getCell('C2').value, 'whatsapp');
    assert.equal(sheet.getCell('E2').value, '/catalogue');
    assert.equal(workbook.getWorksheet('Enquiries').rowCount, 1);
    assert.equal(workbook.getWorksheet('Trainer applications').rowCount, 1);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('adding contact actions preserves existing enquiry rows', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'technoedge-existing-enquiries-'));
  const filePath = path.join(directory, 'enquiries.xlsx');
  try {
    await saveEnquiryToWorkbook(validateEnquiry({
      submissionId: 'ebd1222f-08ce-4687-9c41-e74f353551ce',
      kind: 'organisation',
      name: 'Existing Enquiry',
      email: 'existing@example.com',
      company: 'Example',
      service: 'E-Learning Solution',
      notes: 'Existing request',
      sourcePage: '/e-learning/',
    }), { filePath });
    await saveContactActionToWorkbook(action, { filePath });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    assert.equal(workbook.getWorksheet('Enquiries').getCell('D2').value, 'Existing Enquiry');
    assert.equal(workbook.getWorksheet('Contact actions').getCell('A2').value, action.eventId);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
