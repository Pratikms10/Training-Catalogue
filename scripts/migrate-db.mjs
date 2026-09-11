import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../server/database.mjs';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationDirectory = path.join(rootDirectory, 'database', 'migrations');
const migrationFiles = (await fs.readdir(migrationDirectory))
  .filter((fileName) => /^\d+_.+\.sql$/.test(fileName))
  .sort();

const pool = getPool();
const client = await pool.connect();

try {
  for (const fileName of migrationFiles) {
    const version = path.basename(fileName, '.sql');
    const migrationTableResult = await client.query("SELECT to_regclass('catalogue.schema_migrations') AS table_name");
    if (migrationTableResult.rows[0].table_name) {
      const appliedResult = await client.query(
        'SELECT 1 FROM catalogue.schema_migrations WHERE version = $1',
        [version],
      );
      if (appliedResult.rowCount > 0) {
        console.log(`Skipping ${version}; already applied.`);
        continue;
      }
    }

    console.log(`Applying ${version}...`);
    const sql = await fs.readFile(path.join(migrationDirectory, fileName), 'utf8');
    await client.query(sql);
    console.log(`Applied ${version}.`);
  }
} catch (error) {
  try {
    await client.query('ROLLBACK');
  } catch {
    // The migration may already have completed or rolled back itself.
  }
  throw error;
} finally {
  client.release();
  await closePool();
}
