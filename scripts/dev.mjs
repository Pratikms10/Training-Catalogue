import { spawn } from 'node:child_process';
import path from 'node:path';

const inheritedArgs = process.argv.slice(2);
const children = [];
let shuttingDown = false;
const projectRoot = process.cwd();
const eLearningRoot = path.resolve(projectRoot, 'apps/e-learning');
const websiteRoot = path.resolve(projectRoot, 'apps/corporate-site');
const viteCli = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

function start(name, command, args, cwd = projectRoot) {
  const child = spawn(command, args, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });

  children.push(child);
  child.once('exit', (code, signal) => {
    if (shuttingDown) return;
    const reason = signal ? `signal ${signal}` : `exit code ${code ?? 1}`;
    console.error(`${name} stopped unexpectedly (${reason}). Stopping the development environment.`);
    shutdown(code ?? 1);
  });
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(exitCode), 250).unref();
}

process.once('SIGINT', () => shutdown());
process.once('SIGTERM', () => shutdown());

console.log('Starting the catalogue API and Vite development server…');
start('Catalogue API', process.execPath, ['server/index.mjs']);
start('E-Learning development server', process.execPath, [
  viteCli,
  '--base=/e-learning/',
  '--port=3002',
  '--host=0.0.0.0',
  '--strictPort',
], eLearningRoot);
start('Corporate website development server', process.execPath, [
  viteCli,
  '--base=/website/',
  '--port=3003',
  '--host=0.0.0.0',
  '--strictPort',
], websiteRoot);
start('Vite development server', process.execPath, [
  viteCli,
  '--port=3000',
  '--host=0.0.0.0',
  '--strictPort',
  ...inheritedArgs,
]);
