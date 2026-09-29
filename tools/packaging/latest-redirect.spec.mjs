import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { latestRedirectHtml } from '../pages/latest-redirect.mjs';

test('latest release preserves the installation page and section', () => {
  const html = latestRedirectHtml('2.0.2-devkit-0.2.1');
  let destination;
  const location = {
    search: '?path=/docs/get-started-use-plectrum-in-an-app--docs',
    hash: '#install-the-packages',
    replace: (value) => { destination = value; },
  };
  vm.runInNewContext(html.match(/<script>(.*?)<\/script>/s)[1], { location });
  assert.equal(destination, `../releases/2.0.2-devkit-0.2.1/${location.search}${location.hash}`);
  assert.match(html, /<noscript>/);
  assert.throws(() => latestRedirectHtml('../other'), /Invalid release ID/);
});
