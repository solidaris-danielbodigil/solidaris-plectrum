// Keyboard gate: every interactive Plectrum Angular component proves its
// keyboard contract in a story tagged 'keyboard'. "Interactive" is read from the
// source, not declared: a template or host binding with a button, a link, a
// tabindex or a keydown handler. Deprecated components take no new work.
import fs from 'node:fs';
import path from 'node:path';
import type { InventoryItem } from './inventory';

const focusable = /<button\b|<a\b|\btabindex\b|\(keydown/;
const keyboardTag = /tags:\s*\[[^\]]*['"]keyboard['"]/;

export function interactiveSource(componentFile: string): boolean {
  if (!componentFile.endsWith('.ts') || !fs.existsSync(componentFile)) return false;
  const body = fs.readFileSync(componentFile, 'utf8');
  const templateUrl = /templateUrl:\s*['"]([^'"]+)['"]/.exec(body)?.[1];
  const template = templateUrl ? fs.readFileSync(path.join(path.dirname(componentFile), templateUrl), 'utf8') : '';
  return focusable.test(template) || focusable.test(body);
}

/** Component IDs whose keyboard story is missing; empty when the gate passes. */
export function missingKeyboardStories(root: string, items: InventoryItem[]): string[] {
  return items
    .filter((item) => item.metadata.distribution.kind === 'angular' && item.metadata.governance.status !== 'deprecated')
    .filter((item) => interactiveSource(path.join(root, item.metadata.component.path)))
    .filter((item) => {
      const stories = path.join(root, item.metadataPath.replace(/\.metadata\.ts$/, '.stories.ts'));
      return !fs.existsSync(stories) || !keyboardTag.test(fs.readFileSync(stories, 'utf8'));
    })
    .map((item) => item.metadata.component.id);
}
