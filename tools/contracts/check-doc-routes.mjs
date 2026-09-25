import fs from 'node:fs';

const catalogue = JSON.parse(fs.readFileSync('tools/devkit/assets/catalogue.json', 'utf8'));
const index = JSON.parse(fs.readFileSync('dist/storybook/ui/index.json', 'utf8'));
for (const item of catalogue.components) {
  if (!item.docs.previewUrl) throw new Error(`${item.id}: no preview URL`);
  const route = new URL(item.docs.previewUrl).searchParams.get('path');
  const id = route?.replace(/^\/docs\//, '');
  const entry = id ? index.entries[id] : null;
  if (entry?.type !== 'docs' || entry.importPath?.replace(/^\.\//, '') !== item.docs.sourcePath) {
    throw new Error(`${item.id}: ${route} does not resolve to ${item.docs.sourcePath}`);
  }
}
console.log(`Toolkit catalogue routes resolve to ${catalogue.components.length} built Storybook docs pages.`);
