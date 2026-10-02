import { createApp } from '../server/app.mjs';
import { getPool } from '../server/database.mjs';

// Vercel serves the built frontends from its CDN; this function handles API routes only.
export default createApp(getPool(), { serveStatic: false });
