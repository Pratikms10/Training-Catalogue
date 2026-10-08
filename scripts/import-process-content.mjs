import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { closePool, getPool } from '../server/database.mjs';

const inputPath = process.argv[2];
const commit = process.argv.includes('--commit');

if (!inputPath) {
  throw new Error('Provide a Process or Behavioural catalogue TSV/text file path. Add --commit to write to the database.');
}

const TRACKS = {
  PI: {
    label: 'Process',
    categoryCode: 'people-process',
    subType: 'Process',
    importActor: 'process-catalogue-import',
  },
  BS: {
    label: 'Behavioural',
    categoryCode: 'people-behavioural',
    subType: 'People',
    importActor: 'behavioural-catalogue-import',
  },
};

function getTrack(courseId) {
  const prefix = String(courseId).match(/^([A-Z]{2})\d{4,}$/i)?.[1]?.toUpperCase();
  const track = prefix ? TRACKS[prefix] : undefined;
  if (!track) throw new Error(`Unsupported course ID: ${courseId}. Use a PI or BS catalogue ID.`);
  return track;
}

function cleanText(value = '') {
  return String(value)
    .replace(/\r/g, '')
    // Source bullets use coloured-circle emoji. Strip surrogate code units so
    // malformed pasted emoji can never make the JSON database payload invalid.
    .replace(/[\uD800-\uDFFF]/g, '')
    .replace(/^[-*]\s+/, '')
    .replace(/^[🟢🔴]\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRows(raw) {
  const normalised = raw.replace(/^\uFEFF/, '');
  const [headerLine, ...bodyLines] = normalised.split(/\r?\n/);
  const headers = headerLine.split('\t').map((value) => cleanText(value));
  const expectedHeaders = ['Course ID', 'Category', 'Programme Name', 'Covers / Combines', 'Duration', 'TOC'];
  if (expectedHeaders.some((header, index) => headers[index] !== header)) {
    throw new Error('The source must contain the expected six-column Process catalogue header.');
  }

  const body = bodyLines.join('\n');
  const sourceRows = body.split(/\r?\n(?=(?:PI|BS)\d{4}\t)/i).filter(Boolean);
  if (sourceRows.length === 0) throw new Error('No PI or BS course records were found.');

  return sourceRows.map((source, index) => {
    const columns = [];
    let start = 0;
    for (let column = 0; column < 5; column += 1) {
      const end = source.indexOf('\t', start);
      if (end < 0) throw new Error(`Source row ${index + 2} does not contain six columns.`);
      columns.push(source.slice(start, end).trim());
      start = end + 1;
    }
    columns.push(source.slice(start).trim());
    const [courseId, category, programmeName, covers, duration, toc] = columns;
    const track = getTrack(courseId);
    if (!category || !programmeName || !covers || !duration || !toc) {
      throw new Error(`Course ${courseId} is missing one or more required values.`);
    }
    const durationMatch = duration.match(/^(8|16)\s+Hours$/i);
    if (!durationMatch) throw new Error(`Course ${courseId} has unsupported duration: ${duration}.`);
    return {
      rowNumber: index + 2,
      courseId: courseId.toUpperCase(),
      category: cleanText(category),
      programmeName: cleanText(programmeName),
      covers: cleanText(covers),
      duration: `${durationMatch[1]} Hours`,
      durationMinutes: Number(durationMatch[1]) * 60,
      toc,
      track,
    };
  });
}

function getSection(markdown, title) {
  const expression = new RegExp(`^#{1,3}\\s+${title}\\s*$([\\s\\S]*?)(?=^#{1,3}\\s+|(?![\\s\\S]))`, 'im');
  return markdown.match(expression)?.[1] || '';
}

function getMetadata(markdown, label) {
  const expression = new RegExp(`^\\*\\*${label}:\\*\\*[^\\S\\r\\n]*([^\\r\\n]*)`, 'im');
  return cleanText(markdown.match(expression)?.[1] || '');
}

function getBullets(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => /^\s*-\s+/.test(line))
    .map(cleanText)
    .filter(Boolean);
}

function parseModules(markdown, courseId) {
  const matches = [...markdown.matchAll(/^#{2,3}\s+Module\s+(\d+)\s*:\s*(.+)$/gim)];
  if (matches.length === 0) throw new Error(`Course ${courseId} has no modules.`);

  return matches.map((match, index) => {
    const contentStart = (match.index || 0) + match[0].length;
    const contentEnd = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    const content = markdown.slice(contentStart, contentEnd);
    const concepts = [];
    const practicalActivities = [];

    for (const rawLine of content.split(/\r?\n/)) {
      if (!/^\s*-\s+/.test(rawLine)) continue;
      const item = cleanText(rawLine);
      if (!item) continue;
      if (/^\s*-\s*🟢/.test(rawLine)) practicalActivities.push(item);
      else concepts.push(item);
    }

    return {
      code: String(Number(match[1])).padStart(2, '0'),
      title: cleanText(match[2]),
      concepts,
      practicalActivities,
    };
  });
}

function normaliseCourse(source) {
  const objectives = getBullets(getSection(source.toc, 'Programme Objectives'));
  const audience = getBullets(getSection(source.toc, 'Who Should Attend'));
  const prerequisites = getBullets(getSection(source.toc, 'Prerequisites'));
  const modules = parseModules(source.toc, source.courseId);
  const level = getMetadata(source.toc, 'Level') || (source.durationMinutes === 480 ? 'Basic' : 'Intermediate');
  const delivery = getMetadata(source.toc, 'Delivery') || 'Instructor-Led';
  const longTitle = getMetadata(source.toc, 'Title') || getMetadata(source.toc, 'Programme Name');

  if (objectives.length === 0 || audience.length === 0 || prerequisites.length === 0) {
    throw new Error(`Course ${source.courseId} is missing objectives, audience, or prerequisites.`);
  }

  return {
    ...source,
    level,
    delivery,
    longTitle,
    format: source.durationMinutes === 480 ? 'Workshop' : 'Capability Training',
    summary: objectives[0],
    objectives,
    audience,
    prerequisites,
    modules,
    relatedSkills: source.covers.split(';').map(cleanText).filter(Boolean),
    seoDescription: (() => {
      const candidate = cleanText([longTitle, objectives[0]].filter(Boolean).join(' — '));
      if (candidate.length < 50) return null;
      return candidate.length > 170 ? `${candidate.slice(0, 167).trimEnd()}...` : candidate;
    })(),
  };
}

async function insertOrderedCourseValues(client, table, column, rows) {
  if (rows.length === 0) return;
  await client.query(
    `INSERT INTO ${table} (course_id, ${column}, display_order)
     SELECT course_id, value, display_order
     FROM jsonb_to_recordset($1::jsonb) AS source(course_id text, value text, display_order integer)`,
    [JSON.stringify(rows)],
  );
}

async function importCourses(courses, raw, track) {
  const pool = getPool();
  const client = await pool.connect();
  const checksum = crypto.createHash('sha256').update(raw).digest('hex');
  const fileName = path.basename(inputPath);

  try {
    await client.query('BEGIN');
    const batchResult = await client.query(
      `INSERT INTO catalogue.import_batches
        (original_file_name, source_checksum_sha256, uploaded_by, mode, status, total_rows, valid_rows, metadata)
       VALUES ($1, $2, $3, 'upsert', 'importing', $4, $4, $5::jsonb)
       RETURNING id`,
      [fileName, checksum, track.importActor, courses.length, JSON.stringify({ track: track.categoryCode, format: 'text-tsv' })],
    );
    const batchId = batchResult.rows[0].id;

    // Replacement is isolated to the imported track; the other track remains untouched.
    await client.query(`
      DELETE FROM catalogue.courses course
      USING catalogue.people_process_details details
      WHERE course.course_id = details.course_id
        AND course.category_code = $1
        AND details.sub_type = $2
    `, [track.categoryCode, track.subType]);

    const courseRows = courses.map((course) => ({
      course_id: course.courseId,
      title: course.programmeName,
      level_code: course.level,
      duration_minutes: course.durationMinutes,
      format: course.format,
      delivery: course.delivery,
      summary: course.summary,
      objective: course.objectives.join('\n'),
      seo_description: course.seoDescription,
    }));
    await client.query(
      `INSERT INTO catalogue.courses
        (course_id, category_code, title, level_code, duration_minutes, format, delivery, approach,
         summary, objective, status, source_reference, published_at, seo_description)
       SELECT course_id, $2, title, level_code, duration_minutes, format, delivery,
              'Practical & Activity-Based', summary, objective, 'published', $3, now(), seo_description
       FROM jsonb_to_recordset($1::jsonb) AS source(
         course_id text, title text, level_code text, duration_minutes integer, format text,
         delivery text, summary text, objective text, seo_description text
       )`,
      [JSON.stringify(courseRows), track.categoryCode, fileName],
    );

    await client.query(
      `INSERT INTO catalogue.people_process_details (course_id, topic_category, sub_type, portfolio)
       SELECT course_id, category, $2, category
       FROM jsonb_to_recordset($1::jsonb) AS source(course_id text, category text)`,
      [JSON.stringify(courses.map((course) => ({ course_id: course.courseId, category: course.category })) ), track.subType],
    );

    const flatten = (property) => courses.flatMap((course) => course[property].map((value, index) => ({
      course_id: course.courseId,
      value,
      display_order: index + 1,
    })));
    await insertOrderedCourseValues(client, 'catalogue.course_objectives', 'objective', flatten('objectives'));
    await insertOrderedCourseValues(client, 'catalogue.course_audiences', 'audience', flatten('audience'));
    await insertOrderedCourseValues(client, 'catalogue.course_prerequisites', 'prerequisite', flatten('prerequisites'));
    await insertOrderedCourseValues(client, 'catalogue.course_related_skills', 'skill', flatten('relatedSkills'));

    const moduleRows = courses.flatMap((course) => course.modules.map((module, index) => ({
      course_id: course.courseId,
      module_code: module.code,
      title: module.title,
      display_order: index + 1,
    })));
    const modulesResult = await client.query(
      `INSERT INTO catalogue.course_modules (course_id, module_code, title, display_order)
       SELECT course_id, module_code, title, display_order
       FROM jsonb_to_recordset($1::jsonb) AS source(course_id text, module_code text, title text, display_order integer)
       RETURNING id, course_id, module_code`,
      [JSON.stringify(moduleRows)],
    );
    const moduleIds = new Map(modulesResult.rows.map((module) => [`${module.course_id}:${module.module_code}`, module.id]));
    const outcomeRows = courses.flatMap((course) => course.modules.flatMap((module) => [
      ...module.concepts.map((outcome, index) => ({
        module_id: moduleIds.get(`${course.courseId}:${module.code}`), outcome_type: 'concept', outcome, display_order: index + 1,
      })),
      ...module.practicalActivities.map((outcome, index) => ({
        module_id: moduleIds.get(`${course.courseId}:${module.code}`), outcome_type: 'practical_activity', outcome, display_order: index + 1,
      })),
    ]));
    await client.query(
      `INSERT INTO catalogue.module_learning_outcomes (module_id, outcome_type, outcome, display_order)
       SELECT module_id, outcome_type::catalogue.learning_item_type, outcome, display_order
       FROM jsonb_to_recordset($1::jsonb) AS source(module_id bigint, outcome_type text, outcome text, display_order integer)`,
      [JSON.stringify(outcomeRows)],
    );

    await client.query(
      `INSERT INTO catalogue.import_rows (batch_id, sheet_name, row_number, course_id, status, payload)
       SELECT $1, $3, row_number, course_id, 'imported', payload
       FROM jsonb_to_recordset($2::jsonb) AS source(row_number integer, course_id text, payload jsonb)`,
      [batchId, JSON.stringify(courses.map((course) => ({
        row_number: course.rowNumber,
        course_id: course.courseId,
        payload: { category: course.category, programmeName: course.programmeName, duration: course.duration },
      }))), `${track.label} Catalogue`],
    );

    await client.query(
      `UPDATE catalogue.import_batches
       SET status = 'completed', imported_rows = $2, completed_at = now()
       WHERE id = $1`,
      [batchId, courses.length],
    );
    await client.query('COMMIT');
    return { batchId, imported: courses.length };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await closePool();
  }
}

const raw = await fs.readFile(inputPath, 'utf8');
const courses = parseRows(raw).map(normaliseCourse);
const uniqueIds = new Set(courses.map((course) => course.courseId));
if (uniqueIds.size !== courses.length) throw new Error('Duplicate course IDs were found.');
const track = courses[0]?.track;
if (!track || courses.some((course) => course.track.categoryCode !== track.categoryCode)) {
  throw new Error('A source file must contain exactly one catalogue track (all PI or all BS IDs).');
}

const summary = {
  courses: courses.length,
  track: track.label,
  categories: [...new Set(courses.map((course) => course.category))].sort(),
  durations: Object.fromEntries([...new Map(courses.map((course) => [course.duration, 0])).keys()].sort().map((duration) => [duration, courses.filter((course) => course.duration === duration).length])),
  mode: commit ? 'commit' : 'validation-only',
};

if (!commit) {
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Validation passed. Re-run with --commit to import these ${track.label} courses.`);
} else {
  console.log(JSON.stringify({ ...summary, ...(await importCourses(courses, raw, track)) }, null, 2));
}
