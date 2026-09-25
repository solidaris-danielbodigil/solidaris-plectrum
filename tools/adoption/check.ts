import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkAdoption } from './records';

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const base = process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : undefined;
  checkAdoption(process.cwd(), base).catch((error) => { console.error(error); process.exitCode = 1; });
}
