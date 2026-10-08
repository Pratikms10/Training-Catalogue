import 'dotenv/config';

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(projectRoot, 'artifacts', 'seo', 'programme-quality-report.json');
const convertedDirectory = path.join(projectRoot, 'data', 'converted');

async function jsonlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return jsonlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.jsonl') ? [entryPath] : [];
  }));
  return nested.flat();
}

const report = JSON.parse(await readFile(reportPath, 'utf8'));
const roleBasedIds = report.readyForEditorialReview
  .filter((programme) => programme.category_code === 'role-based')
  .map((programme) => programme.course_id);

if (!roleBasedIds.length) {
  throw new Error('The SEO quality report contains no role-based programmes ready for editorial review.');
}

const pool = getPool();
try {
  const titleResult = await pool.query(
    `SELECT course_id, title
     FROM catalogue.courses
     WHERE course_id = ANY($1::text[])
       AND category_code = 'role-based'
       AND status = 'published'`,
    [roleBasedIds],
  );
  const titleById = new Map(titleResult.rows.map((row) => [row.course_id, row.title]));
  const foundIds = new Set();
  const updatedIds = new Set();
  const changedFiles = [];

  for (const filePath of await jsonlFiles(convertedDirectory)) {
    const source = await readFile(filePath, 'utf8');
    const lines = source.split(/\r?\n/);
    let changed = false;
    const updatedLines = lines.map((line) => {
      if (!line.trim()) return line;
      const record = JSON.parse(line);
      const title = titleById.get(record.courseId);
      if (!title) return line;
      foundIds.add(record.courseId);
      if (record.title === title) return line;
      record.title = title;
      updatedIds.add(record.courseId);
      changed = true;
      return JSON.stringify(record);
    });

    if (changed) {
      await writeFile(filePath, updatedLines.join('\n'), 'utf8');
      changedFiles.push(path.relative(projectRoot, filePath));
    }
  }

  const missingIds = roleBasedIds.filter((courseId) => !foundIds.has(courseId));
  console.log(JSON.stringify({
    matchedProgrammes: foundIds.size,
    updatedProgrammes: updatedIds.size,
    unchangedOrDatabaseOnlyProgrammes: missingIds,
    changedFiles,
  }, null, 2));
} finally {
  await closePool();
}
