import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCatalogueFilters, getCourseById, listCourses } from './catalogueRepository.mjs';
import { createImportCentreRouter } from './importCentre.mjs';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(serverDirectory, '../dist');

function positiveInteger(value, fallback) {
  if (value == null || value === '') return fallback;
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error('Pagination and duration values must be positive integers.');
  return parsed;
}

function stringValues(value) {
  if (value == null) return [];
  return (Array.isArray(value) ? value : [value])
    .flatMap((item) => String(item).split(','))
    .map((item) => item.trim())
    .filter(Boolean);
}

function positiveIntegerValues(value) {
  return stringValues(value).map((item) => positiveInteger(item, undefined));
}

export function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/admin/import', createImportCentreRouter(pool));

  app.get('/api/health', async (_request, response, next) => {
    try {
      const result = await pool.query(`
        SELECT current_database() AS database, now() AS server_time,
               to_regclass('catalogue.courses') IS NOT NULL AS schema_ready
      `);
      response.json({ status: 'ok', ...result.rows[0] });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/courses', async (request, response, next) => {
    try {
      const result = await listCourses(pool, {
        category: request.query.category?.toString(),
        query: request.query.q?.toString().trim(),
        level: request.query.level?.toString(),
        tools: stringValues(request.query.tool),
        technologyCategories: stringValues(request.query.technologyCategory),
        durationMinutes: positiveIntegerValues(request.query.durationMinutes),
        sort: request.query.sort?.toString(),
        page: positiveInteger(request.query.page, 1),
        pageSize: positiveInteger(request.query.pageSize, 24),
      });
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/catalogue/filters', async (request, response, next) => {
    try {
      const category = request.query.category?.toString() || 'tools-technology';
      response.json(await getCatalogueFilters(pool, category));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/courses/:courseId', async (request, response, next) => {
    try {
      const courseId = request.params.courseId.trim().toUpperCase();
      if (!/^(RB|PP|TT)\d{4,}$/.test(courseId)) {
        return response.status(400).json({ error: 'Invalid course ID.' });
      }
      const course = await getCourseById(pool, courseId);
      if (!course) return response.status(404).json({ error: 'Course not found.' });
      return response.json({ data: course });
    } catch (error) {
      return next(error);
    }
  });

  if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
    if (!fs.existsSync(distDirectory)) {
      throw new Error(`Static build directory not found: ${distDirectory}. Run npm run build first.`);
    }
    app.use(express.static(distDirectory));
    app.use((request, response, next) => {
      if (request.method !== 'GET' || request.path.startsWith('/api/') || !request.accepts('html')) {
        return next();
      }
      return response.sendFile(path.join(distDirectory, 'index.html'));
    });
  }

  app.use((error, _request, response, _next) => {
    const isInputError = error.message?.startsWith('Invalid') || error.message?.includes('positive integers');
    if (!isInputError) console.error(error);
    response.status(isInputError ? 400 : 500).json({
      error: isInputError ? error.message : 'The catalogue service could not complete the request.',
    });
  });

  return app;
}
