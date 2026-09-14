#!/usr/bin/env node
/**
 * Prepends the GitHub Pages /iged deep-link dispatcher to the root 404.html
 * (a copy of the iSHARE index). iSHARE paths no-op; /iged paths stash the
 * remainder and replace to /solidaris-plectrum/iged/.
 */
import fs from 'node:fs';

const target = process.argv[2];
if (!target) {
  console.error('Usage: node tools/pages/inject-iged-404-dispatcher.mjs <404.html>');
  process.exit(1);
}

const SCRIPT = `<script>
(function () {
  var parts = location.pathname.split('/').filter(Boolean);
  var igedIndex = parts.indexOf('iged');
  if (igedIndex === -1) return;
  if (igedIndex > 0 && parts[igedIndex - 1] !== 'solidaris-plectrum') return;
  var rest = parts.slice(igedIndex + 1);
  var remainder = rest.length ? '/' + rest.join('/') : '/';
  try {
    sessionStorage.setItem('pds-iged-spa-path', remainder);
  } catch (e) {}
  location.replace('/solidaris-plectrum/iged/');
})();
</script>
`;

const html = fs.readFileSync(target, 'utf8');
if (html.includes('pds-iged-spa-path')) {
  process.exit(0);
}

const injected = html.replace(/<head([^>]*)>/i, `<head$1>\n${SCRIPT}`);
if (injected === html) {
  fs.writeFileSync(target, SCRIPT + html);
} else {
  fs.writeFileSync(target, injected);
}
