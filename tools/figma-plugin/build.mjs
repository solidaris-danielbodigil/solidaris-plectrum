#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const root = dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes('--watch');
const dist = join(root, 'dist');

mkdirSync(dist, { recursive: true });

const mainOptions = {
  entryPoints: [join(root, 'src/main.ts')],
  bundle: true,
  outfile: join(dist, 'code.js'),
  target: 'es2020',
  format: 'iife',
  logLevel: 'info',
};

async function writeUi(js) {
  const html = readFileSync(join(root, 'src/ui.html'), 'utf8');
  writeFileSync(join(dist, 'ui.html'), html.replace('<!-- UI_JS -->', `<script>${js}</script>`));
}

async function buildUi() {
  const result = await esbuild.build({
    entryPoints: [join(root, 'src/ui.ts')],
    bundle: true,
    write: false,
    target: 'es2020',
    format: 'iife',
    logLevel: 'info',
  });
  await writeUi(result.outputFiles[0].text);
}

if (watch) {
  const ctx = await esbuild.context(mainOptions);
  await ctx.watch();
  const uiCtx = await esbuild.context({
    entryPoints: [join(root, 'src/ui.ts')],
    bundle: true,
    write: false,
    target: 'es2020',
    format: 'iife',
    plugins: [
      {
        name: 'write-ui-html',
        setup(build) {
          build.onEnd((result) => {
            const file = result.outputFiles?.[0];
            if (file) writeUi(file.text);
          });
        },
      },
    ],
  });
  await uiCtx.watch();
  console.log('figma-plugin: watching');
} else {
  await esbuild.build(mainOptions);
  await buildUi();
}
