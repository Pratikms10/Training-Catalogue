import { spawn } from 'node:child_process';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this build through npm.');

await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [
    npmCli,
    'run', 'build',
    '--workspace', 'technoedge-corporate-site',
    '--', '--base=/website/', '--outDir=../../dist/website', '--emptyOutDir',
  ], { cwd: process.cwd(), env: process.env, stdio: 'inherit' });

  child.once('error', reject);
  child.once('exit', (code, signal) => {
    if (code === 0) resolve(undefined);
    else reject(new Error(`Corporate website build failed (${signal || `exit code ${code ?? 1}`}).`));
  });
});

console.log('Corporate website is available at /website/.');
