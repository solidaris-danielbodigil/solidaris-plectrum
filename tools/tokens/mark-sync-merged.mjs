#!/usr/bin/env node
// Pages builds main. A proposed sync record on main has been merged and is not a package release.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const file = 'libs/ui/src/storybook/sync-report.generated.ts';
if (!existsSync(file)) process.exit(0);
const source = readFileSync(file, 'utf8');
if (!source.includes('"stage": "proposed"')) process.exit(0);
writeFileSync(file, source.replace('"stage": "proposed"', '"stage": "merged"'));
console.log('Sync report on main marked merged, not released.');
