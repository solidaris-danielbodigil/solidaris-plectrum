#!/usr/bin/env node
// Fails when the runtime manifests disagree, when docs restate a source version that
// they should render, or when the Form Field quick-start snippet drifts from the
// consumer smoke app. Release state itself is checked by check-docs-process.mjs.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const version = JSON.parse(read('libs/ui/package.json')).version;
const plectrum = JSON.parse(read('libs/plectrum/package.json')).version;
const styles = JSON.parse(read('libs/styles/package.json')).version;
const toolkit = JSON.parse(read('tools/devkit/package.json')).version;

const problems = [];
const fail = (message) => problems.push(message);

if (version !== plectrum || version !== styles) {
  fail(`package versions differ: ui ${version}, plectrum ${plectrum}, styles ${styles}`);
}

const pages = ['get-started-consume', 'get-started-contribute', 'introduction', 'releases', 'whats-new', 'ai-strategy'];
for (const page of pages) {
  const text = read(`libs/ui/src/docs/${page}.mdx`);
  for (const [label, value] of [['runtime', version], ['toolkit', toolkit]]) {
    if (new RegExp(`(?<![\\d.])${value.replaceAll('.', '\\.')}(?![\\d.])`).test(text)) fail(`${page}.mdx restates the ${label} version ${value}; render it from the manifests`);
  }
}

const consume = read('libs/ui/src/docs/get-started-consume.mdx');
for (const needle of ['Agenda', 'bootstrap-icons']) {
  if (!consume.includes(needle)) fail(`get-started-consume.mdx does not mention ${needle}`);
}

const formField = read('libs/ui/src/lib/form-field/form-field.mdx');
const example = read('libs/ui/src/lib/form-field/form-field.example.ts');
const consumer = read('tools/packaging/consumer-app/src/app/app.ts');
for (const needle of [JSON.parse(read('libs/ui/package.json')).name, 'pInputText', 'inputId="member"', 'requiredLabel="obligatoire"']) {
  if (!example.includes(needle)) fail(`form-field.example.ts is missing ${needle}`);
  if (!formField.includes(needle)) fail(`form-field.mdx is missing ${needle}`);
  if (!consumer.includes(needle)) fail(`consumer-app app.ts is missing ${needle}`);
  if (!consume.includes(needle)) fail(`get-started-consume.mdx First component is missing ${needle}`);
}

if (problems.length) {
  console.error('docs release check failed:\n' + problems.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`docs release check ok (runtime ${version}, toolkit ${toolkit} rendered from manifests; publication read from release.json)`);
