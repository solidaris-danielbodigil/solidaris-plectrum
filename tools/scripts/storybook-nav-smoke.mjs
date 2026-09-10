#!/usr/bin/env node
// =============================================================================
// tools/scripts/storybook-nav-smoke.mjs
// Cross-page navigation smoke test for a *built* Storybook served under a
// sub-path, the way GitHub Pages serves it (/solidaris-plectrum/storybook/).
//
// Guards against the R01 failure: a story that rewrites the preview iframe URL
// makes every later lazily loaded chunk resolve against the host root, so the
// next page fails with ChunkLoadError. The per-story test-runner cannot see
// this — it opens each story in a fresh document.
//
// Usage:
//   node tools/scripts/storybook-nav-smoke.mjs
//     Stages dist/storybook/ui under dist/pages-smoke/solidaris-plectrum/storybook,
//     serves dist/pages-smoke on :6007 (same layout as deploy-ishare-pages.yml)
//     and walks the route below.
//   node tools/scripts/storybook-nav-smoke.mjs --url https://host/solidaris-plectrum/storybook/
//     Walks an already deployed Storybook.
// =============================================================================

import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import httpServer from 'http-server';
import { chromium } from 'playwright';

const PORT = 6007;
const DEPLOY_PATH = '/solidaris-plectrum/storybook/';
const BUILD_DIR = resolve('dist/storybook/ui');
const STAGE_ROOT = resolve('dist/pages-smoke');

/** Manager routes visited in order — shells first, then docs pages. */
const ROUTE = [
  '/story/shell-navigation-navshell--collapsed',
  '/story/shell-navigation-subnavshell--processen',
  '/story/shell-navigation-topnav--default',
  '/docs/docs-component-status--docs',
  '/docs/get-started-contribute--docs',
  '/story/shell-navigation-navshell--expanded',
  '/docs/custom-components-form-field--docs',
];

const args = process.argv.slice(2);
const urlFlag = args.indexOf('--url');

let server = null;
let baseUrl;

if (urlFlag === -1) {
  if (!existsSync(resolve(BUILD_DIR, 'iframe.html'))) {
    process.stderr.write(`No Storybook build at ${BUILD_DIR} — run \`npm run build-storybook\` first.\n`);
    process.exit(2);
  }
  rmSync(STAGE_ROOT, { recursive: true, force: true });
  cpSync(BUILD_DIR, resolve(STAGE_ROOT, `.${DEPLOY_PATH}`), { recursive: true });
  server = httpServer.createServer({ root: STAGE_ROOT, cache: -1 });
  await new Promise((done) => server.listen(PORT, '127.0.0.1', done));
  baseUrl = new URL(`http://127.0.0.1:${PORT}${DEPLOY_PATH}`);
} else {
  baseUrl = new URL(args[urlFlag + 1]);
  if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';
}

const problems = [];

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const text = message.text();
  if (/ChunkLoadError|Loading chunk|Failed to fetch dynamically imported/i.test(text)) {
    problems.push(`console: ${text}`);
  }
});
page.on('requestfailed', (request) => {
  const reason = request.failure()?.errorText ?? '';
  // ERR_ABORTED is the browser cancelling an in-flight prefetch on
  // navigation/close — not a missing asset. Missing assets surface as 404s
  // in the response listener below.
  if (reason === 'net::ERR_ABORTED') return;
  if (/\.(js|css)(\?|$)/.test(request.url())) {
    problems.push(`requestfailed: ${request.url()} — ${reason}`);
  }
});
page.on('response', (response) => {
  const url = response.url();
  if (response.status() >= 400 && /\.(js|css)(\?|$)/.test(url)) {
    problems.push(`http ${response.status()}: ${url}`);
  }
});

async function previewFrame() {
  const handle = await page.$('#storybook-preview-iframe');
  return (await handle?.contentFrame()) ?? null;
}

async function waitForPreview(storyPath) {
  const kind = storyPath.startsWith('/docs/') ? 'docs' : 'story';
  await page.waitForFunction(
    () => {
      const frame = document.querySelector('#storybook-preview-iframe');
      return frame instanceof HTMLIFrameElement && frame.contentDocument?.readyState === 'complete';
    },
    null,
    { timeout: 30_000 },
  );
  const frame = await previewFrame();
  if (!frame) throw new Error('#storybook-preview-iframe not found');
  await frame.waitForSelector(
    kind === 'docs' ? '.sbdocs-content, #storybook-docs' : '#storybook-root > *',
    { timeout: 30_000 },
  );
  return frame;
}

try {
  for (const [index, storyPath] of ROUTE.entries()) {
    const target = new URL(baseUrl);
    target.search = `?path=${storyPath}`;

    if (index === 0) {
      await page.goto(target.toString(), { waitUntil: 'load' });
    } else {
      // In-app navigation — the preview iframe is kept alive, which is the
      // condition under which a rewritten URL breaks later chunk loads.
      await page.evaluate((next) => {
        history.pushState(null, '', next);
        dispatchEvent(new PopStateEvent('popstate'));
      }, target.pathname + target.search);
    }

    const frame = await waitForPreview(storyPath);
    const frameUrl = new URL(frame.url());
    // The preview document must stay at <deploy path>/iframe.html. Anything
    // else means a story rewrote the URL and relative chunk URLs will drift.
    if (frameUrl.pathname !== `${baseUrl.pathname}iframe.html`) {
      problems.push(
        `preview URL rewritten after ${storyPath}: ${frameUrl.href} (expected ${baseUrl.pathname}iframe.html)`,
      );
    }
    process.stdout.write(`✓ ${storyPath}\n`);
  }
} catch (error) {
  problems.push(`navigation: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  await browser.close();
  server?.close();
}

if (problems.length) {
  process.stderr.write('\nStorybook navigation smoke FAILED:\n');
  for (const problem of [...new Set(problems)]) process.stderr.write(`  - ${problem}\n`);
  process.exit(1);
}

process.stdout.write(`\nStorybook navigation smoke passed (${ROUTE.length} pages under ${baseUrl.pathname}).\n`);
