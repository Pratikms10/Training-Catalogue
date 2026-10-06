import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const sourceRoots = ['src', 'apps/corporate-site/src'];
const ignoredFiles = new Set([
  'apps/corporate-site/src/teai360.css', // Retired stylesheet; not imported by the corporate entrypoint.
]);

const forbiddenColors = new Map([
  ['#0000ff', 'legacy electric blue'],
  ['#161cff', 'legacy electric blue'],
  ['#111a9b', 'legacy indigo'],
  ['#2196f3', 'legacy support blue'],
  ['#0a66c2', 'legacy social blue'],
  ['#1576f2', 'legacy bright blue'],
  ['#07143d', 'legacy navy'],
  ['#3656b5', 'legacy periwinkle'],
  ['#121ed1', 'legacy indigo'],
  ['#3b0872', 'legacy violet'],
  ['#9515f2', 'legacy violet'],
  ['#0ab1c1', 'legacy cyan'],
]);

const extensions = new Set(['.css', '.ts', '.tsx']);
const failures = [];

async function scanDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await scanDirectory(absolutePath);
      continue;
    }

    if (!extensions.has(path.extname(entry.name))) continue;

    const relativePath = path.relative(projectRoot, absolutePath).replaceAll('\\', '/');
    if (ignoredFiles.has(relativePath)) continue;

    const source = (await readFile(absolutePath, 'utf8')).toLowerCase();
    for (const [color, label] of forbiddenColors) {
      if (source.includes(color)) failures.push(`${relativePath}: ${color} (${label})`);
    }
  }
}

for (const sourceRoot of sourceRoots) {
  await scanDirectory(path.join(projectRoot, sourceRoot));
}

const entrypointChecks = [
  ['src/index.css', '@import "./styles/brand-tokens.css"'],
  ['apps/corporate-site/src/index.css', '@import "../../../src/styles/brand-tokens.css"'],
];

for (const [relativePath, requiredImport] of entrypointChecks) {
  const source = await readFile(path.join(projectRoot, relativePath), 'utf8');
  if (!source.includes(requiredImport)) failures.push(`${relativePath}: missing shared brand token import`);
}

if (failures.length > 0) {
  console.error('Brand colour verification failed:\n');
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Brand colour verification passed for Home, Catalogue, Insights, and Careers sources.');
  console.log('E-Learning is intentionally outside this audit.');
}
