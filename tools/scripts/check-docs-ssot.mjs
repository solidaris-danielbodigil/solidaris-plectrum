#!/usr/bin/env node
// =============================================================================
// tools/scripts/check-docs-ssot.mjs
// The component .metadata.ts is the single source of truth for a component's
// docs page. This gate fails when a libs/ui/src/lib/**/*.mdx page restates a
// metadata block as prose instead of embedding the figure that renders it:
//
//   ## When to use / ## When not to use   → contractStory(meta, 'usage')
//   ## Anatomy  + <DocsTable>            → contractStory(meta, 'anatomy')
//   ## Accessibility + bullet list       → contractStory(meta, 'accessibility')
//   ## Figma section / bare Figma URL     → statusStory(governance, component)
//
// It also requires every component page to embed the Status figure and, when
// a colocated .metadata.ts exists, the Usage figure.
//
// Run: npm run docs:check   (wired into CI next to generate-index)
// =============================================================================

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve('libs/ui/src/lib');
const problems = [];

/** Lines of the section that starts at `heading` until the next `## `. */
function sectionBody(mdx, heading) {
  const lines = mdx.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return null;
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    body.push(line);
  }
  return body;
}

const hasBullets = (body) => body.some((line) => /^\s*[-*]\s+\S/.test(line));
const hasDocsTable = (body) => body.some((line) => /<DocsTable\b/.test(line));
const embeds = (body, story) =>
  body.some((line) => new RegExp(`<Story\\s+of=\\{Stories\\.${story}\\}`).test(line));

for (const dir of readdirSync(ROOT, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const mdxPath = join(ROOT, dir.name, `${dir.name}.mdx`);
  if (!existsSync(mdxPath)) continue;

  const file = relative(process.cwd(), mdxPath).replaceAll('\\', '/');
  const mdx = readFileSync(mdxPath, 'utf8');
  const hasMetadata = existsSync(join(ROOT, dir.name, `${dir.name}.metadata.ts`));
  const fail = (message) => problems.push(`${file}: ${message}`);

  for (const legacy of ['## When to use', '## When not to use']) {
    if (sectionBody(mdx, legacy)) {
      fail(`"${legacy}" is hand-written — move the entries to usage.useCases / usage.antiPatterns and embed <Story of={Stories.Usage} /> under "## Usage"`);
    }
  }

  const anatomy = sectionBody(mdx, '## Anatomy');
  if (anatomy && (hasDocsTable(anatomy) || hasBullets(anatomy))) {
    fail('"## Anatomy" is hand-written — move the rows to metadata.anatomy and embed <Story of={Stories.Anatomy} />');
  }

  const a11y = sectionBody(mdx, '## Accessibility');
  if (a11y && (hasBullets(a11y) || hasDocsTable(a11y))) {
    fail('"## Accessibility" is hand-written — move the entries to accessibility.ariaAttributes / keyboardSupport and embed <Story of={Stories.Accessibility} />');
  }

  if (sectionBody(mdx, '## Figma')) {
    fail('"## Figma" section — the link comes from component.figmaUrl through the Status figure');
  }

  if (!/<Story\s+of=\{Stories\.Status\}/.test(mdx)) {
    fail('missing the Status figure (<Story of={Stories.Status} />) under the h1');
  }

  if (/<Controls\b/.test(mdx) && sectionBody(mdx, '## API')) {
    fail('"## API" duplicates Controls — keep Controls only, drop <ArgTypes>');
  }

  if (hasMetadata) {
    const usage = sectionBody(mdx, '## Usage');
    if (!usage || !embeds(usage, 'Usage')) {
      fail('component has a .metadata.ts but the page does not embed <Story of={Stories.Usage} /> under "## Usage"');
    }
  }

  const storiesPath = join(ROOT, dir.name, `${dir.name}.stories.ts`);
  if (existsSync(storiesPath)) {
    const stories = readFileSync(storiesPath, 'utf8');
    const storiesFile = relative(process.cwd(), storiesPath).replaceAll('\\', '/');
    const failStories = (message) => problems.push(`${storiesFile}: ${message}`);
    // Bare factory exports hide `tags: ['!dev']` from the CSF indexer, so the
    // figure stays in the sidebar. The tag must be a literal on the object.
    const bare = [
      ...stories.matchAll(/^export const (\w+) = (statusStory|contractStory)\(/gm),
    ];
    for (const match of bare) {
      failStories(
        `export const ${match[1]} = ${match[2]}(...) is invisible to the CSF indexer — write \`export const ${match[1]} = { tags: ['!dev'], ...${match[2]}(...) }\``,
      );
    }
  }
}

const PRIMENG = resolve('libs/ui/src/primeng');
for (const name of readdirSync(PRIMENG)) {
  if (!name.endsWith('.mdx')) continue;
  const mdxPath = join(PRIMENG, name);
  const mdx = readFileSync(mdxPath, 'utf8');
  const file = relative(process.cwd(), mdxPath).replaceAll('\\', '/');
  if (/<Controls\b/.test(mdx) && /^## API\s*$/m.test(mdx)) {
    problems.push(`${file}: "## API" duplicates Controls — keep Controls only, drop <ArgTypes>`);
  }
}

if (problems.length) {
  process.stderr.write('Docs SSOT check failed — metadata is the source, MDX embeds it:\n');
  for (const problem of problems) process.stderr.write(`  - ${problem}\n`);
  process.exit(1);
}

process.stdout.write('Docs SSOT check passed — no hand-written metadata blocks or duplicate API tables.\n');
