import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import ExcelJS from 'exceljs';
import { claimCrmBatch, markCrmDelivered, markCrmFailed } from './crmOutbox.mjs';
import { createApp } from './app.mjs';
import { saveEnquiryToDatabase } from './enquiryDatabase.mjs';

const enquiry = {
  submissionId: 'ebd1222f-08ce-4687-9c41-e74f353551ce',
  kind: 'organisation',
  name: 'Example Contact',
  email: 'contact@example.test',
  company: 'Example Company',
  service: 'Corporate Training Solution',
  notes: 'Discuss a team programme.',
  sourcePage: '/website/',
  ctaId: 'home_contact_organisation_submit',
};

function createPool({ duplicate = false, failOutbox = false } = {}) {
  const calls = [];
  let released = false;
  const client = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      if (sql.includes('INSERT INTO leads.enquiries')) {
        return duplicate
          ? { rows: [], rowCount: 0 }
          : { rows: [{ reference: 'TE-20261005-EBD1222F' }], rowCount: 1 };
      }
      if (sql.includes('SELECT reference FROM leads.enquiries')) {
        return { rows: [{ reference: 'TE-20261005-EBD1222F' }], rowCount: 1 };
      }
      if (sql.includes('INSERT INTO leads.crm_outbox') && failOutbox) throw new Error('Outbox unavailable');
      return { rows: [], rowCount: 1 };
    },
    release() { released = true; },
  };
  return { calls, get released() { return released; }, async connect() { return client; } };
}

test('stores the enquiry and its CRM outbox row in one transaction', async () => {
  const pool = createPool();
  const result = await saveEnquiryToDatabase(pool, enquiry);
  assert.deepEqual(result, { reference: 'TE-20261005-EBD1222F', duplicate: false });
  assert.deepEqual(pool.calls.map(({ sql }) => sql.trim().split(/\s+/).slice(0, 3).join(' ')), [
    'BEGIN', 'INSERT INTO leads.enquiries', 'INSERT INTO leads.crm_outbox', 'COMMIT',
  ]);
  assert.equal(pool.calls[1].values[0], enquiry.submissionId);
  assert.equal(pool.calls[1].values[19], enquiry.ctaId);
  assert.equal(pool.released, true);
});

test('a retry returns the original reference without duplicating the lead', async () => {
  const pool = createPool({ duplicate: true });
  const result = await saveEnquiryToDatabase(pool, enquiry);
  assert.equal(result.duplicate, true);
  assert.equal(result.reference, 'TE-20261005-EBD1222F');
  assert.equal(pool.calls.filter(({ sql }) => sql.includes('INSERT INTO leads.crm_outbox')).length, 1);
});

test('an outbox failure rolls back the enquiry and never reports success', async () => {
  const pool = createPool({ failOutbox: true });
  await assert.rejects(saveEnquiryToDatabase(pool, enquiry), /Outbox unavailable/);
  assert.equal(pool.calls.at(-1).sql, 'ROLLBACK');
  assert.equal(pool.released, true);
});

test('CRM delivery helpers use leased records and never send data themselves', async () => {
  const calls = [];
  const pool = {
    async query(sql, values) {
      calls.push({ sql, values });
      if (sql.includes('WITH ready AS')) return { rows: [], rowCount: 0 };
      return { rows: [{ id: 1 }], rowCount: 1 };
    },
  };
  assert.deepEqual(await claimCrmBatch(pool, { limit: 2 }), []);
  assert.equal(calls[0].values[0], 2);
  assert.equal(calls[0].values[1].length, 36);
  assert.equal(await markCrmDelivered(pool, { id: 1, leaseToken: calls[0].values[1], crmRecordId: 'lead-123' }), true);
  assert.equal(await markCrmFailed(pool, { id: 2, leaseToken: calls[0].values[1], reason: 'Temporary error' }), true);
  assert.equal(calls.length, 3);
});

test('the API uses durable storage when PostgreSQL lead mode is enabled', async () => {
  const previousMode = process.env.LEADS_STORAGE_MODE;
  process.env.LEADS_STORAGE_MODE = 'postgres';
  const pool = createPool();
  const server = createApp(pool, { serveStatic: false }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    assert.equal(response.status, 201);
    assert.equal((await response.json()).reference, 'TE-20261005-EBD1222F');
    assert.equal(pool.calls.some(({ sql }) => sql.includes('INSERT INTO leads.crm_outbox')), true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (previousMode === undefined) delete process.env.LEADS_STORAGE_MODE;
    else process.env.LEADS_STORAGE_MODE = previousMode;
  }
});

test('the default local path stores the same lead in PostgreSQL and Excel', async () => {
  const previousMode = process.env.LEADS_STORAGE_MODE;
  const previousPath = process.env.LEADS_WORKBOOK_PATH;
  delete process.env.LEADS_STORAGE_MODE;
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'technoedge-hybrid-test-'));
  process.env.LEADS_WORKBOOK_PATH = path.join(directory, 'leads.xlsx');
  const pool = createPool();
  const server = createApp(pool, { serveStatic: false }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    assert.equal(response.status, 201);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(process.env.LEADS_WORKBOOK_PATH);
    const sheet = workbook.getWorksheet('Enquiries');
    assert.equal(sheet.getCell('A2').value, 'TE-20261005-EBD1222F');
    assert.equal(sheet.getCell('U2').value, enquiry.ctaId);
    assert.equal(pool.calls.some(({ sql }) => sql.includes('INSERT INTO leads.crm_outbox')), true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(directory, { recursive: true, force: true });
    if (previousMode === undefined) delete process.env.LEADS_STORAGE_MODE;
    else process.env.LEADS_STORAGE_MODE = previousMode;
    if (previousPath === undefined) delete process.env.LEADS_WORKBOOK_PATH;
    else process.env.LEADS_WORKBOOK_PATH = previousPath;
  }
});

test('Vercel defaults to PostgreSQL without attempting a local Excel write', async () => {
  const previousMode = process.env.LEADS_STORAGE_MODE;
  const previousVercel = process.env.VERCEL;
  delete process.env.LEADS_STORAGE_MODE;
  process.env.VERCEL = '1';
  const pool = createPool();
  const server = createApp(pool, { serveStatic: false }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    assert.equal(response.status, 201);
    assert.equal(pool.calls.some(({ sql }) => sql.includes('INSERT INTO leads.crm_outbox')), true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (previousMode === undefined) delete process.env.LEADS_STORAGE_MODE;
    else process.env.LEADS_STORAGE_MODE = previousMode;
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
  }
});
