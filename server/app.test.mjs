import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from './app.mjs';

const sampleRow = {
  course_id: 'TT0003',
  category_code: 'tools-technology',
  title: 'ChatGPT Professional',
  level_code: 'Intermediate',
  duration_minutes: 960,
  format: null,
  delivery: 'Instructor-Led',
  approach: null,
  summary: 'Professional ChatGPT workflows.',
  objective: 'Use ChatGPT professionally.',
  image_url: null,
  tool_name: 'ChatGPT',
  vendor: 'OpenAI',
  tool_logo_url: null,
  skill_area: 'Generative AI',
  related_skills: [],
  tools_covered: ['ChatGPT'],
  technology_categories: ['AI'],
};

const sampleCertificationRow = {
  course_id: 'CER0005',
  category_code: 'certifications',
  title: 'Introduction to finance in Dynamics 365',
  level_code: 'Beginner',
  duration_minutes: 1440,
  format: null,
  delivery: null,
  summary: 'Learn Dynamics 365 Finance.',
  objective: null,
  image_url: null,
  certification_provider: 'Microsoft',
  certification_code: 'AB-6002',
  certification_exam_code: null,
  certification_url: 'https://learn.microsoft.com/training/courses/ab-6002',
  product_technologies: ['dynamics-365', 'dynamics-finance'],
  certification_roles: ['business-user'],
  related_skills: [],
  tools_covered: ['dynamics-365'],
  technology_categories: [],
};

const sampleTechnicalRow = {
  course_id: 'TC0001',
  category_code: 'technical-training',
  title: 'Cloud Engineering Foundations',
  level_code: 'Intermediate',
  duration_minutes: 960,
  format: 'Instructor-Led',
  delivery: null,
  summary: 'Build foundational cloud engineering skills.',
  objective: null,
  image_url: null,
  primary_technology: 'Amazon Web Services',
  technical_vendor: 'Amazon Web Services',
  technical_domain: 'Cloud Computing',
  source_course_id: 'C001',
  source_duration: '2 Days',
  related_skills: ['Cloud Computing'],
  tools_covered: ['Amazon Web Services'],
  technology_categories: ['Cloud Computing'],
};

const fakePool = {
  async query(sql, values = []) {
    if (sql.includes('current_database()')) {
      return { rows: [{ database: 'test', server_time: new Date().toISOString(), schema_ready: true }] };
    }
    if (sql.includes("SELECT 'technology' AS group_id, tech.primary_technology")) {
      return {
        rows: [
          { group_id: 'technology', value: 'Amazon Web Services', count: 1 },
          { group_id: 'toolCategory', value: 'Cloud Computing', count: 1 },
          { group_id: 'duration', value: '960', count: 1 },
        ],
      };
    }
    if (sql.includes("SELECT 'technology' AS group_id")) {
      return {
        rows: [
          { group_id: 'technology', value: 'ChatGPT', count: 1 },
          { group_id: 'toolCategory', value: 'AI', count: 1 },
          { group_id: 'duration', value: '960', count: 1 },
        ],
      };
    }
    if (sql.includes("SELECT 'industry' AS group_id")) {
      return {
        rows: [
          { group_id: 'department', value: 'Human Resources', count: 4 },
          { group_id: 'duration', value: '240', count: 1 },
        ],
      };
    }
    if (sql.includes("SELECT 'provider' AS group_id")) {
      return {
        rows: [
          { group_id: 'provider', value: 'Microsoft', count: 1 },
          { group_id: 'productTechnology', value: 'dynamics-365', count: 1 },
          { group_id: 'duration', value: '1440', count: 1 },
        ],
      };
    }
    if (sql.includes('count(*)::integer AS total')) return { rows: [{ total: 1 }] };
    if (sql.includes('SELECT\n    ccv.*')) {
      return { rows: [values.includes('certifications')
        ? sampleCertificationRow
        : values.includes('technical-training')
          ? sampleTechnicalRow
          : sampleRow] };
    }
    throw new Error(`Unexpected test query: ${sql}`);
  },
};

let server;
let baseUrl;

before(async () => {
  server = createApp(fakePool).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test('health endpoint reports database readiness', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.schema_ready, true);
});

test('catalogue endpoint returns frontend-shaped pagination data', async () => {
  const response = await fetch(`${baseUrl}/api/courses?category=tools-technology&page=1&pageSize=24`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.pagination.total, 1);
  assert.equal(body.data[0].id, 'TT0003');
  assert.equal(body.data[0].duration, '16 Hours');
  assert.equal(body.data[0].vendor, 'OpenAI');
});

test('catalogue API caps requested page size to the public grid size', async () => {
  const response = await fetch(`${baseUrl}/api/courses?category=tools-technology&page=1&pageSize=100`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.pagination.pageSize, 9);
});

test('technical training is exposed as the Tools & Technology catalogue', async () => {
  const response = await fetch(`${baseUrl}/api/courses?category=technical-training&page=1&pageSize=24`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.data[0].id, 'TC0001');
  assert.equal(body.data[0].category, 'tools-technology');
  assert.equal(body.data[0].toolName, 'Amazon Web Services');
});

test('catalogue endpoint rejects unsupported categories', async () => {
  const response = await fetch(`${baseUrl}/api/courses?category=not-a-category`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid category filter.' });
});

test('catalogue filters endpoint returns database-derived Tools filters', async () => {
  const response = await fetch(`${baseUrl}/api/catalogue/filters?category=tools-technology`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.groups.length, 3);
  assert.equal(body.groups[0].options[0].label, 'ChatGPT');
  assert.equal(body.groups[2].options[0].label, '16 Hours');
});

test('catalogue filters endpoint returns technical training domains', async () => {
  const response = await fetch(`${baseUrl}/api/catalogue/filters?category=technical-training`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.groups[0].options[0].label, 'Amazon Web Services');
  assert.equal(body.groups[1].options[0].label, 'Cloud Computing');
});

test('catalogue filters endpoint returns database-derived Role-Based filters', async () => {
  const response = await fetch(`${baseUrl}/api/catalogue/filters?category=role-based`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.groups.length, 3);
  assert.equal(body.groups[1].options[0].label, 'Human Resources');
  assert.equal(body.groups[2].options[0].label, '4 Hours');
});

test('catalogue endpoint separates the TechnoEdge certification ID from the provider course code', async () => {
  const response = await fetch(`${baseUrl}/api/courses?category=certifications&page=1&pageSize=24`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.data[0].id, 'CER0005');
  assert.equal(body.data[0].providerCourseCode, 'AB-6002');
  assert.equal(body.data[0].provider, 'Microsoft');
  assert.deepEqual(body.data[0].productTechnologies, ['dynamics-365', 'dynamics-finance']);
});

test('catalogue filters endpoint returns certification provider filters', async () => {
  const response = await fetch(`${baseUrl}/api/catalogue/filters?category=certifications`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.groups[0].options[0].label, 'Microsoft');
  assert.equal(body.groups[2].options[0].label, '24 Hours');
});

test('detail endpoint rejects malformed course IDs before querying PostgreSQL', async () => {
  const response = await fetch(`${baseUrl}/api/courses/not-valid`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid course ID.' });
});

test('enquiry endpoint returns a real reference only after the writer succeeds', async () => {
  const saved = [];
  const app = createApp(fakePool, {
    saveEnquiry: async (enquiry) => {
      saved.push(enquiry);
      return { reference: 'TE-20261005-TEST1234', duplicate: false };
    },
  });
  const localServer = app.listen(0);
  await new Promise((resolve) => localServer.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${localServer.address().port}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId: 'ebd1222f-08ce-4687-9c41-e74f353551ce',
        kind: 'course',
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+919876543210',
        company: 'Example Company',
        notes: 'Please send a proposal.',
        sourcePage: '/catalogue',
      }),
    });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { reference: 'TE-20261005-TEST1234' });
    assert.equal(saved.length, 1);
  } finally {
    await new Promise((resolve) => localServer.close(resolve));
  }
});

test('contact action endpoint records a click separately from an enquiry', async () => {
  const saved = [];
  const app = createApp(fakePool, {
    saveContactAction: async (action) => {
      saved.push(action);
      return { duplicate: false };
    },
  });
  const localServer = app.listen(0);
  await new Promise((resolve) => localServer.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${localServer.address().port}/api/contact-actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 'bd2baaeb-00a1-44a0-a5f4-78b13986ab93',
        channel: 'call',
        destination: '+919356433629',
        sourcePage: '/careers',
        ctaLabel: 'Call TechnoEdge',
      }),
    });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { recorded: true });
    assert.equal(saved.length, 1);
  } finally {
    await new Promise((resolve) => localServer.close(resolve));
  }
});
