import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';

const app = express();
const port = Number.parseInt(process.env.LHCI_PORT || '4173', 10);
const dist = path.resolve('dist');

app.use(compression());
app.get('/api/catalogue/filters', (_request, response) => response.json({ groups: [] }));
app.get('/api/courses', (request, response) => response.json({
  data: [],
  pagination: {
    page: Number.parseInt(String(request.query.page || '1'), 10),
    pageSize: Number.parseInt(String(request.query.pageSize || '9'), 10),
    total: 0,
    totalPages: 0,
  },
}));
app.get('/', (_request, response) => response.sendFile(path.join(dist, 'website', 'index.html')));
app.get(/^\/website\/?$/, (_request, response) => response.redirect(308, '/'));
app.get(/^\/website\/index\.html$/, (_request, response) => response.redirect(308, '/'));
app.get(/.*/, (request, response, next) => {
  const relativePath = request.path.replace(/^\/+|\/+$/g, '');
  if (!relativePath || path.extname(relativePath)) return next();
  const cleanHtml = path.resolve(dist, `${relativePath}.html`);
  if (!cleanHtml.startsWith(`${dist}${path.sep}`) || !fs.existsSync(cleanHtml)) return next();
  return response.sendFile(cleanHtml);
});
app.use(express.static(dist, { extensions: ['html'] }));
app.use((_request, response) => response.status(404).sendFile(path.join(dist, '404.html')));
app.listen(port, () => console.log(`Lighthouse fixture server listening on http://127.0.0.1:${port}`));
