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

const fakePool = {
  async query(sql) {
    if (sql.includes('current_database()')) {
      return { rows: [{ database: 'test', server_time: new Date().toISOString(), schema_ready: true }] };
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
    if (sql.includes('count(*)::integer AS total')) return { rows: [{ total: 1 }] };
    if (sql.includes('SELECT\n    ccv.*')) return { rows: [sampleRow] };
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

test('detail endpoint rejects malformed course IDs before querying PostgreSQL', async () => {
  const response = await fetch(`${baseUrl}/api/courses/not-valid`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid course ID.' });
});
