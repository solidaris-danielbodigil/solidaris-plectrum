import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';

const pluginPath = fileURLToPath(
  new URL('./no-layout-in-components.mjs', import.meta.url),
);

const config = {
  customSyntax: 'postcss-scss',
  plugins: [pluginPath],
  rules: {
    'pds/no-layout-in-components': [true, { severity: 'warning' }],
  },
};

async function lint(code, file = 'libs/styles/src/06-components/_components.x.scss') {
  return stylelint.lint({ code, config, codeFilename: file });
}

function warnings(result) {
  return result.results[0]?.warnings ?? [];
}

describe('pds/no-layout-in-components', () => {
  it('warns display:flex on a BEM block', async () => {
    const result = await lint('.c-foo { display: flex; }');
    assert.equal(warnings(result).length, 1);
    assert.equal(warnings(result)[0].severity, 'warning');
    assert.match(warnings(result)[0].text, /o-flex/);
  });

  it('allows PrimeNG :where(.p-*) internals', async () => {
    const result = await lint(`
      .c-list {
        :where(.p-tree) {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--pds-spacing-2);
          overflow: hidden;
        }
      }
    `);
    assert.equal(warnings(result).length, 0);
  });

  it('allows :has(p-*) PrimeNG hosts', async () => {
    const result = await lint(`
      .c-form-field__control {
        &:has(p-toggleswitch) {
          display: flex;
          align-items: center;
        }
      }
    `);
    assert.equal(warnings(result).length, 0);
  });

  it('allows align-items on a bespoke display:grid rule', async () => {
    const result = await lint(`
      .c-docs-sync-checks__item {
        display: grid;
        align-items: start;
      }
    `);
    assert.equal(warnings(result).length, 0);
  });

  it('warns scale-based gap and allows component-token gap', async () => {
    const result = await lint(`
      .c-foo { gap: var(--#{$pds-prefix}-spacing-2); }
      .c-bar { gap: var(--pds-space-docs-hero-gap); }
      .c-baz { margin: 0; }
    `);
    const props = warnings(result).map((warning) => warning.text);
    assert.equal(warnings(result).length, 1);
    assert.match(props[0], /gap/);
  });

  it('warns raw rem padding', async () => {
    const result = await lint('.c-foo { padding: 1rem; }');
    assert.equal(warnings(result).length, 1);
  });

  it('skips object / utility layers', async () => {
    const skipped = await lint(
      '.o-flex { display: flex; align-items: center; }',
      'libs/styles/src/05-objects/_objects.flex-grid.scss',
    );
    assert.equal(warnings(skipped).length, 0);
  });
});
