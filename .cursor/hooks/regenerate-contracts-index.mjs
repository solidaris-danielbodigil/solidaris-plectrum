#!/usr/bin/env node
/**
 * afterFileEdit hook — keeps .ai/contracts/index.json in sync while libs/ui evolves.
 *
 * Reads the hook event JSON from stdin and regenerates the contracts index when
 * the edited file can affect it: component sources, templates and metadata under
 * libs/ui/src/lib, or BEM stylesheets under libs/styles/src/06-components.
 *
 * generate-index skips its write when the content is unchanged, so this hook is
 * quiet on unrelated edits. Failures fail open — CI still gates a stale index.
 */
import { execSync } from 'node:child_process';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let filePath = '';
try {
  const event = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  filePath = String(event.file_path ?? event.filePath ?? '');
} catch {
  process.exit(0); // unparseable event — do nothing
}

const normalized = filePath.replace(/\\/g, '/');
const affectsIndex = /(^|\/)libs\/(ui\/src\/lib|styles\/src\/06-components)\//.test(normalized);

if (!affectsIndex) {
  process.exit(0);
}

try {
  // Hook runs from the project root; generate-index is content-stable.
  execSync('npm run generate-index', { stdio: 'ignore' });
} catch {
  // fail open
}
process.exit(0);
