// One-time mechanical conversion of the approved static design to JSX and CSS.
// Run with the existing static site's dist directory as the first argument.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('Pass the static dist directory.');

const appRoot = path.resolve(import.meta.dirname, '..');
const html = await readFile(path.join(source, 'index.html'), 'utf8');
const css = await readFile(path.join(source, 'styles.css'), 'utf8');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) throw new Error('Could not find the original page body.');

let jsx = bodyMatch[1]
  .replace(/<script\b[^>]*><\/script>/gi, '')
  .replace(/\bclass=/g, 'className=')
  .replace(/\bfor=/g, 'htmlFor=')
  .replace(/\bautocomplete=/g, 'autoComplete=')
  .replace(/\brows="(\d+)"/g, 'rows={$1}')
  .replace(/src="assets\//g, 'src="/website/assets/')
  .replace(/style="([^"]+)"/g, (_match, declarations) => {
    const entries = declarations.split(';').filter(Boolean).map((entry) => {
      const divider = entry.indexOf(':');
      return `'${entry.slice(0, divider).trim()}': '${entry.slice(divider + 1).trim()}'`;
    });
    return `style={{ ${entries.join(', ')} } as React.CSSProperties}`;
  })
  .replace(/<(img|input|br)(\b[^>]*?)(?<!\/)\s*>/gi, '<$1$2 />');

const component = `import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { mountCorporateInteractions } from './interactions';

function CorporateHome() {
  useEffect(() => mountCorporateInteractions(), []);

  return (
    <div id="corporate-site">
${jsx}
    </div>
  );
}

export default function App() {
  return <Routes><Route path="/" element={<CorporateHome />} /></Routes>;
}
`;

await writeFile(path.join(appRoot, 'src/App.tsx'), component);
await writeFile(path.join(appRoot, 'src/legacy.css'), css.replace(/url\(['"]?assets\//g, "url('/website/assets/"));
console.log('Converted static markup and styles into the corporate React app.');
