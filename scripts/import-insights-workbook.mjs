import ExcelJS from 'exceljs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Usage: node scripts/import-insights-workbook.mjs <workbook.xlsx>');
}

const categoryFor = (title) => {
  const value = title.toLowerCase();

  if (/(security|cyber|privacy|dpdp|threat|sc-\d|defender|sentinel|identity|zero trust|cloud)/.test(value)) return 'Cloud & Security';
  if (/(power bi|fabric|databricks|data |business intelligence|analytics|sql|reporting)/.test(value)) return 'Data & Analytics';
  if (/(leadership|manager|people leader|managers)/.test(value)) return 'Leadership';
  if (/(learning|upskilling|skilling|l&d|training roi|corporate training|workforce)/.test(value)) return 'Workforce Learning';
  if (/(ai|ml|genai|copilot|chatgpt|rag|agent|llm)/.test(value)) return 'AI & Automation';
  return 'Technology';
};

const slugFromUrl = (url) => {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  if (!pathname) throw new Error(`Cannot derive an insight slug from ${url}`);
  return pathname;
};

const text = (row, column) => String(row.getCell(column).text ?? '').trim();

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(sourcePath);

const sheet = workbook.getWorksheet('Blogs');
if (!sheet) throw new Error('Expected a worksheet named "Blogs".');

const headerRow = sheet.getRow(1);
const columns = new Map();
headerRow.eachCell((cell, column) => columns.set(cell.text.trim(), column));

const requiredColumns = ['Card_Title', 'Card_Date', 'Excerpt', 'Thumbnail_URL', 'Blog_URL', 'Author', 'Status', 'Article_Part_1', 'Tables'];
for (const column of requiredColumns) {
  if (!columns.has(column)) throw new Error(`Missing required column: ${column}`);
}

const records = [];
const skipped = [];
const seenSlugs = new Set();

for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
  const row = sheet.getRow(rowNumber);
  const status = text(row, columns.get('Status'));
  if (!status) continue;

  const title = text(row, columns.get('Card_Title'));
  const body = text(row, columns.get('Article_Part_1')).replace(/\r\n/g, '\n');

  if (status !== 'OK' || !title || !body) {
    skipped.push({ rowNumber, title, status, reason: text(row, columns.get('Error')) || 'Missing article body' });
    continue;
  }

  const id = slugFromUrl(text(row, columns.get('Blog_URL')));
  if (seenSlugs.has(id)) throw new Error(`Duplicate insight slug: ${id}`);
  seenSlugs.add(id);

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  records.push({
    id,
    title,
    category: categoryFor(title),
    excerpt: text(row, columns.get('Excerpt')).replace(/\.\.\.$/, '').trim(),
    date: text(row, columns.get('Card_Date')),
    readTime: `${Math.max(3, Math.round(wordCount / 225))} min read`,
    image: text(row, columns.get('Thumbnail_URL')),
    author: text(row, columns.get('Author')) || 'TechnoEdge Editorial',
    content: body,
    tables: text(row, columns.get('Tables')).replace(/\r\n/g, '\n'),
  });
}

records.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

const metadata = records.map(({ content, tables, ...article }) => article);
const contentById = Object.fromEntries(records.map(({ id, content, tables }) => [id, { content, tables }]));
const outputDataPath = path.join(projectRoot, 'src', 'data', 'importedInsights.ts');
const outputContentDirectory = path.join(projectRoot, 'public', 'insights-content');

await mkdir(path.dirname(outputDataPath), { recursive: true });
await writeFile(
  outputDataPath,
  `// Generated from the approved Insights workbook. Run import-insights-workbook.mjs to refresh.\nexport const importedInsights = ${JSON.stringify(metadata, null, 2)} as const;\n`,
  'utf8',
);
await mkdir(outputContentDirectory, { recursive: true });
await Promise.all(Object.entries(contentById).map(([id, content]) => (
  writeFile(path.join(outputContentDirectory, `${id}.json`), `${JSON.stringify(content)}\n`, 'utf8')
)));

console.log(JSON.stringify({ imported: records.length, skipped }, null, 2));
