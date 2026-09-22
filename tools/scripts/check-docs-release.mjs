#!/usr/bin/env node
// Fails when consumer docs disagree with package.json, or when the Form Field
// quick-start snippet drifts from the consumer smoke app.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const version = JSON.parse(read('libs/ui/package.json')).version;
const plectrum = JSON.parse(read('libs/plectrum/package.json')).version;
const styles = JSON.parse(read('libs/styles/package.json')).version;

const problems = [];
const fail = (message) => problems.push(message);

if (version !== plectrum || version !== styles) {
  fail(`package versions differ: ui ${version}, plectrum ${plectrum}, styles ${styles}`);
}

const consume = read('libs/ui/src/docs/get-started-consume.mdx');
const releaseState = read('libs/ui/src/storybook/release-state.ts');
const introduction = read('libs/ui/src/docs/introduction.mdx');
const introductionStories = read('libs/ui/src/docs/introduction.stories.ts');
const contribute = read('libs/ui/src/docs/get-started-contribute.mdx');
const formField = read('libs/ui/src/lib/form-field/form-field.mdx');
const example = read('libs/ui/src/lib/form-field/form-field.example.ts');
const consumer = read('tools/packaging/consumer-app/src/app/app.ts');
const releases = read('libs/ui/src/docs/releases.mdx');

if (consume.includes('0.1.0') || introduction.includes('0.1.0')) {
  fail('consumer docs still say 0.1.0');
}
if (!consume.includes(version)) {
  fail(`get-started-consume.mdx does not mention package version ${version}`);
}
if (!introductionStories.includes('RELEASE_SUMMARY')) {
  fail('introduction.stories.ts does not render RELEASE_SUMMARY');
}

if (!consume.includes('Agenda')) {
  fail('get-started-consume.mdx does not mention Agenda');
}
if (!consume.includes('bootstrap-icons')) {
  fail('get-started-consume.mdx does not mention bootstrap-icons');
}

const releaseDateMatch = /RELEASE_DATE\s*=\s*'([^']+)'/.exec(releaseState);
if (!releaseDateMatch) {
  fail('release-state.ts does not define RELEASE_DATE');
} else {
  const releaseDate = releaseDateMatch[1];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    fail(`release-state.ts RELEASE_DATE is not a YYYY-MM-DD string: ${releaseDate}`);
  }
  if (!consume.includes(releaseDate)) {
    fail(`get-started-consume.mdx does not mention the release date ${releaseDate}`);
  }
}

if (contribute.includes('solidaris-nx')) {
  fail('get-started-contribute.mdx still clones into solidaris-nx');
}
if (!contribute.includes('solidaris-plectrum')) {
  fail('get-started-contribute.mdx does not name the solidaris-plectrum directory');
}

if (releases.includes('Merging the version PR publishes with')) {
  fail('releases.mdx still says merging the version PR publishes to npm');
}

for (const needle of ['@solidaris/ui', 'pInputText', 'inputId="member"', 'requiredLabel="obligatoire"']) {
  if (!example.includes(needle)) fail(`form-field.example.ts is missing ${needle}`);
  if (!formField.includes(needle)) fail(`form-field.mdx is missing ${needle}`);
  if (!consumer.includes(needle)) fail(`consumer-app app.ts is missing ${needle}`);
}

if (problems.length) {
  console.error('docs release check failed:\n' + problems.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`docs release check ok (${version}, registry unpublished)`);
