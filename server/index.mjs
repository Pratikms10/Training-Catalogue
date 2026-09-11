import 'dotenv/config';
import { createApp } from './app.mjs';
import { closePool, getPool } from './database.mjs';

const port = Number.parseInt(process.env.PORT || '3001', 10);
const pool = getPool();
const app = createApp(pool);
const server = app.listen(port, () => {
  console.log(`Catalogue API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; closing the catalogue API.`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
