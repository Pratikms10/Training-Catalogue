import express from 'express';
import ExcelJS from 'exceljs';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { coursesToJsonl, parseImportSource, validateCourseRecords } from './toolsImportParser.mjs';
import { writeAudit } from './adminAuth.mjs';

const execFileAsync = promisify(execFile);
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(serverDirectory, '..');
const stagingDirectory = path.join(rootDirectory, 'data', 'import-staging');
const templatePath = path.join(rootDirectory, 'outputs', '01a08fbc-815d-7791-966f-9405b4eb1a1f', 'tools-course-import-template.xlsx');
const previews = new Map();
const previewLifetimeMs = 2 * 60 * 60 * 1000;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isLocalRequest(request) {
  const address = request.socket.remoteAddress || '';
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function localOnly(request, response, next) {
  const explicitlyEnabled = process.env.ENABLE_IMPORT_CENTRE === 'true';
  if (!isLocalRequest(request) || (process.env.NODE_ENV === 'production' && !explicitlyEnabled)) {
    return response.status(404).json({ error: 'Import Centre is not available.' });
  }
  return next();
}

function cleanExpiredPreviews() {
  const cutoff = Date.now() - previewLifetimeMs;
  for (const [id, preview] of previews) {
    if (preview.createdAt < cutoff) previews.delete(id);
  }
}

function safeFileName(value) {
  const name = path.basename(value || 'course-import.txt');
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180);
}

async function findDatabaseConflicts(pool, courses) {
  if (courses.length === 0) return [];
  const result = await pool.query(
    `SELECT c.course_id, c.category_code, c.title, tt.tool_name, rb.department
     FROM catalogue.courses c
     LEFT JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id
     LEFT JOIN catalogue.role_based_details rb ON rb.course_id = c.course_id
     WHERE c.course_id = ANY($1::text[])`,
    [courses.map((course) => course.courseId)],
  );
  const incoming = new Map(courses.map((course) => [course.courseId, course]));
  return result.rows.flatMap((row) => {
    const course = incoming.get(row.course_id);
    const sameCategory = course?.category === row.category_code;
    const sameCategoryIdentity = row.category_code === 'role-based'
      ? course?.department === row.department
      : course?.toolName === row.tool_name;
    const sameIdentity = sameCategory && course?.title === row.title && sameCategoryIdentity;
    const existingDescriptor = row.category_code === 'role-based'
      ? row.department || 'unknown department'
      : row.tool_name || 'unknown tool';
    return [{
      severity: sameIdentity ? 'warning' : 'error',
      code: sameIdentity ? 'EXISTING_COURSE_UPDATE' : 'EXISTING_COURSE_CONFLICT',
      sourceRow: null,
      courseId: row.course_id,
      field: 'courseId',
      message: sameIdentity
        ? 'This Course ID already exists and will be updated.'
        : `This Course ID belongs to “${row.title}” (${existingDescriptor}). The incoming record has a different identity and was rejected.`,
    }];
  });
}

export function createImportCentreRouter(pool, { authenticated = false } = {}) {
  const router = express.Router();
  if (!authenticated) router.use(localOnly);

  router.get('/template', async (_request, response, next) => {
    try {
      await fs.access(templatePath);
      return response.download(templatePath, 'tools-course-import-template.xlsx');
    } catch {
      try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'TechnoEdge adminzz';
        const courses = workbook.addWorksheet('Courses');
        courses.addRow(['Course ID', 'Category', 'Title', 'Tool Name', 'Vendor', 'Industry', 'Department', 'Function Name', 'Role Title', 'Image URL', 'Related Skills', 'Level', 'Duration Hours', 'Duration Minutes', 'Format', 'Delivery', 'Summary', 'Tools Covered', 'Technology Categories', 'Skill Area', 'Tool Logo URL']);
        const childSheets = [['Objectives', ['Course ID', 'Objective']], ['Audiences', ['Course ID', 'Audience']], ['Prerequisites', ['Course ID', 'Prerequisite']], ['Modules', ['Course ID', 'Module Code', 'Module Title', 'Concepts', 'Practical Activities']], ['Scenarios', ['Course ID', 'Title', 'Workflow', 'Description']]];
        childSheets.forEach(([name, columns]) => workbook.addWorksheet(name).addRow(columns));
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename="tools-course-import-template.xlsx"');
        return response.send(await workbook.xlsx.writeBuffer());
      } catch (error) { return next(error); }
    }
  });

  router.post('/preview', express.raw({ type: () => true, limit: '30mb' }), async (request, response, next) => {
    try {
      cleanExpiredPreviews();
      const fileName = safeFileName(request.query.fileName?.toString());
      if (!Buffer.isBuffer(request.body) || request.body.length === 0) {
        return response.status(400).json({ error: 'Choose a file or paste course data first.' });
      }

      const parsed = await parseImportSource(request.body, fileName);
      const validation = validateCourseRecords(parsed.records, parsed.sourceIssues);
      const conflictIssues = await findDatabaseConflicts(pool, validation.courses);
      const issues = [...validation.issues, ...conflictIssues];
      const rejectedIds = new Set(
        issues.filter((item) => item.severity === 'error' && item.courseId).map((item) => item.courseId),
      );
      const validCourses = validation.courses.filter((course) => course.courseId && !rejectedIds.has(course.courseId));
      const errorCount = issues.filter((item) => item.severity === 'error').length;
      const warningCount = issues.filter((item) => item.severity === 'warning').length;
      const previewId = randomUUID();
      const jsonl = coursesToJsonl(validCourses);
      const preview = {
        createdAt: Date.now(),
        fileName,
        courses: validCourses,
        jsonl,
        status: 'previewed',
      };
      if (authenticated) {
        await pool.query(`
          INSERT INTO admin.import_previews (
            preview_id, actor_user_id, file_name, normalized_courses, validation_result
          ) VALUES ($1::uuid, $2::uuid, $3, $4::jsonb, $5::jsonb)
        `, [
          previewId,
          request.admin.authUserId,
          fileName,
          JSON.stringify(validCourses),
          JSON.stringify({ counts: { records: validation.counts.records, valid: validCourses.length, rejected: validation.counts.records - validCourses.length, errors: errorCount, warnings: warningCount }, issues }),
        ]);
        await writeAudit(pool, request, {
          action: 'catalogue.import_validated', entityType: 'catalogue_import', entityId: previewId,
          metadata: { fileName, valid: validCourses.length, errors: errorCount, warnings: warningCount },
        });
      } else {
        previews.set(previewId, preview);
      }

      return response.json({
        previewId,
        fileName,
        counts: {
          records: validation.counts.records,
          valid: validCourses.length,
          rejected: validation.counts.records - validCourses.length,
          errors: errorCount,
          warnings: warningCount,
        },
        canImport: validCourses.length > 0,
        issues,
        sample: validCourses.slice(0, 5).map((course) => ({
          courseId: course.courseId,
          category: course.category,
          title: course.title,
          toolName: course.toolName,
          department: course.department,
          level: course.level,
          durationMinutes: course.durationMinutes,
          modules: course.modules.length,
          scenarios: course.scenarios.length,
        })),
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/jsonl/:previewId', async (request, response, next) => {
    let preview;
    try {
      if (authenticated && !uuidPattern.test(request.params.previewId)) return response.status(400).json({ error: 'Invalid preview identifier.' });
      if (authenticated) {
        const result = await pool.query(`
          SELECT file_name, normalized_courses, status FROM admin.import_previews
          WHERE preview_id = $1::uuid AND actor_user_id = $2::uuid AND expires_at > now()
        `, [request.params.previewId, request.admin.authUserId]);
        preview = result.rows[0] ? {
          fileName: result.rows[0].file_name,
          courses: result.rows[0].normalized_courses,
          jsonl: coursesToJsonl(result.rows[0].normalized_courses),
          status: result.rows[0].status,
        } : null;
      } else {
        preview = previews.get(request.params.previewId);
      }
    } catch (error) {
      return next(error);
    }
    if (!preview) return response.status(404).json({ error: 'Preview expired. Validate the file again.' });
    const outputName = `${path.parse(preview.fileName).name || 'courses'}.jsonl`;
    response.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    response.setHeader('Content-Disposition', `attachment; filename="${safeFileName(outputName)}"`);
    return response.send(preview.jsonl);
  });

  router.post('/commit', async (request, response, next) => {
    let preview;
    if (authenticated && !uuidPattern.test(String(request.body?.previewId || ''))) {
      return response.status(400).json({ error: 'Invalid preview identifier.' });
    }
    if (authenticated) {
      const result = await pool.query(`
        SELECT preview_id, file_name, normalized_courses, status
        FROM admin.import_previews
        WHERE preview_id = $1::uuid AND actor_user_id = $2::uuid AND expires_at > now()
      `, [request.body?.previewId, request.admin.authUserId]);
      preview = result.rows[0] ? {
        fileName: result.rows[0].file_name,
        courses: result.rows[0].normalized_courses,
        status: result.rows[0].status,
      } : null;
    } else {
      preview = previews.get(request.body?.previewId);
    }
    if (!preview) return response.status(404).json({ error: 'Preview expired. Validate the file again.' });
    if (preview.status === 'importing') return response.status(409).json({ error: 'This batch is already importing.' });
    if (preview.status === 'completed') return response.status(409).json({ error: 'This batch has already been imported.' });

    const activeStagingDirectory = authenticated ? path.join(os.tmpdir(), 'technoedge-import-staging') : stagingDirectory;
    const stagingPath = path.join(activeStagingDirectory, `${request.body.previewId}.json`);
    preview.status = 'importing';
    try {
      if (authenticated) {
        await pool.query(`
          UPDATE admin.import_previews SET status = 'importing'
          WHERE preview_id = $1::uuid AND actor_user_id = $2::uuid
        `, [request.body.previewId, request.admin.authUserId]);
      }
      await fs.mkdir(activeStagingDirectory, { recursive: true });
      await fs.writeFile(stagingPath, `${JSON.stringify({ courses: preview.courses }, null, 2)}\n`, 'utf8');
      const result = await execFileAsync(process.execPath, [
        path.join(rootDirectory, 'scripts', 'import-tools-db.mjs'),
        stagingPath,
      ], {
        cwd: rootDirectory,
        env: { ...process.env, IMPORT_ACTOR: process.env.IMPORT_ACTOR || 'local-import-centre' },
        maxBuffer: 2 * 1024 * 1024,
        timeout: 60 * 60 * 1000,
      });
      preview.status = 'completed';
      if (authenticated) {
        await pool.query(`
          UPDATE admin.import_previews SET status = 'completed', completed_at = now()
          WHERE preview_id = $1::uuid AND actor_user_id = $2::uuid
        `, [request.body.previewId, request.admin.authUserId]);
        await writeAudit(pool, request, {
          action: 'catalogue.import_completed', entityType: 'catalogue_import', entityId: request.body.previewId,
          metadata: { fileName: preview.fileName, imported: preview.courses.length },
        });
      }
      return response.json({
        status: 'completed',
        imported: preview.courses.length,
        message: result.stdout.trim() || `Imported ${preview.courses.length} courses.`,
      });
    } catch (error) {
      preview.status = 'previewed';
      if (authenticated) {
        await pool.query(`
          UPDATE admin.import_previews SET status = 'failed'
          WHERE preview_id = $1::uuid AND actor_user_id = $2::uuid
        `, [request.body.previewId, request.admin.authUserId]).catch(() => {});
      }
      return next(error);
    } finally {
      await fs.rm(stagingPath, { force: true }).catch(() => {});
    }
  });

  if (authenticated) {
    router.get('/history', async (request, response, next) => {
      try {
        const result = await pool.query(`
          SELECT preview_id, file_name, status, created_at, completed_at,
            validation_result->'counts' AS counts
          FROM admin.import_previews
          WHERE actor_user_id = $1::uuid
          ORDER BY created_at DESC LIMIT 50
        `, [request.admin.authUserId]);
        return response.json({ data: result.rows });
      } catch (error) { return next(error); }
    });
  }

  return router;
}
