import { cp, mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const projectRoot = process.cwd();
const eLearningRoot = path.resolve(projectRoot, 'apps/e-learning');
const distRoot = path.resolve(projectRoot, 'dist');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      env: process.env,
      stdio: 'inherit',
    });

    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) return resolve();
      reject(new Error(`E-Learning build failed (${signal ? `signal ${signal}` : `exit code ${code ?? 1}`}).`));
    });
  });
}

async function sameFile(left, right) {
  try {
    const [leftContents, rightContents] = await Promise.all([readFile(left), readFile(right)]);
    return leftContents.equals(rightContents);
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function copyCompatibilityAssets(source, destination) {
  await mkdir(destination, { recursive: true });
  await cp(source, destination, {
    recursive: true,
    force: false,
    errorOnExist: false,
    filter: async (sourcePath, destinationPath) => {
      if (path.extname(sourcePath) === '') return true;
      try {
        await readFile(destinationPath);
      } catch (error) {
        if (error?.code === 'ENOENT') return true;
        throw error;
      }
      if (await sameFile(sourcePath, destinationPath)) return false;
      throw new Error(`E-Learning asset conflicts with an existing site asset: ${destinationPath}`);
    },
  });
}

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('npm executable path is unavailable. Run this task through npm.');

await run(process.execPath, [
  npmCli,
  'run',
  'build',
  '--workspace',
  'technoedge-learning-studio',
  '--',
  '--base=/e-learning/',
  '--outDir=../../dist/e-learning',
  '--emptyOutDir',
]);

await copyCompatibilityAssets(path.join(eLearningRoot, 'public/media'), path.join(distRoot, 'media'));
await copyCompatibilityAssets(path.join(eLearningRoot, 'public/images'), path.join(distRoot, 'images'));
await copyCompatibilityAssets(
  path.join(eLearningRoot, 'src/assets/images'),
  path.join(distRoot, 'src/assets/images'),
);

console.log('E-Learning is available at /e-learning/.');
