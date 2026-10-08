import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(path.join(projectRoot, 'src', 'data', 'importedInsights.ts'), 'utf8');
const urls = [...new Set(
  [...source.matchAll(/"image":\s*"(https:\/\/www\.technoedgels\.com\/wp-content\/uploads\/[^"?#]+)"/g)]
    .map((match) => match[1]),
)];

const exists = async (filename) => {
  try {
    const details = await stat(filename);
    return details.isFile() && details.size > 0;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
};

let cursor = 0;
let downloaded = 0;
let preserved = 0;
const failures = [];

await Promise.all(Array.from({ length: 8 }, async () => {
  while (cursor < urls.length) {
    const url = new URL(urls[cursor]);
    cursor += 1;
    const destination = path.join(projectRoot, 'public', ...url.pathname.split('/').filter(Boolean));
    if (await exists(destination)) {
      preserved += 1;
      continue;
    }

    try {
      const response = await fetch(url, { headers: { 'user-agent': 'TechnoEdge site migration asset mirror' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = Buffer.from(await response.arrayBuffer());
      if (!data.length) throw new Error('empty response');
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, data);
      downloaded += 1;
    } catch (error) {
      failures.push({ url: url.href, error: error instanceof Error ? error.message : String(error) });
    }
  }
}));

console.log(`Insight media mirror: ${downloaded} downloaded, ${preserved} already present, ${failures.length} failed.`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
