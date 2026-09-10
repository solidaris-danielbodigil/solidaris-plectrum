// =============================================================================
// tools/stylelint/no-layout-in-components.mjs
// Warn when 06-components / 03-generic / 04-elements / 08-trumps restate layout
// that belongs on o-flex / o-layout / u-* in the template.
//
// Allowed: PrimeNG internals (.p-* / :where(.p-*) / :has(p-*)), component-token
// spacing (var(--pds-space-*) and other non-scale --pds-*), documented
// exceptions (margin/padding 0, align-items on a display:grid rule).
// Settings, tools, objects, and utilities define the classes — skipped.
//
// See: .ai/rules/08-object-classes.md, .ai/rules/09-styling-policy.md
// =============================================================================

import stylelint from 'stylelint';

const { createPlugin, utils } = stylelint;

export const ruleName = 'pds/no-layout-in-components';

export const messages = utils.ruleMessages(ruleName, {
  rejected: (prop, hint) =>
    `Use ${hint} in the template instead of \`${prop}\` (.ai/rules/08-object-classes.md)`,
});

export const meta = {
  url: 'https://github.com/search?q=repo%3A+08-object-classes.md',
};

const SKIP_LAYERS = /[/\\](?:01-settings|02-tools|05-objects|07-utilities)[/\\]/;

const FLEX_DISPLAY = new Set(['flex', 'inline-flex']);

const SPACING_PROPS = new Set([
  'gap',
  'row-gap',
  'column-gap',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block',
  'padding-block-start',
  'padding-block-end',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-inline',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block',
  'margin-block-start',
  'margin-block-end',
]);

const RESET_VALUES = /^(0|auto|unset|inherit|initial|revert|none)$/i;

/** Global spacing scale — maps to o-layout--{prop}-{n}. */
const SCALE_VAR =
  /--(?:#\{\$pds-prefix\}-|pds-)?spacing-(?:0(?:-\d+)?|[1-7](?:-\d+)?|auto)\b/;

const PRIME_SELECTOR =
  /(?:\.p-[a-zA-Z]|:where\(\s*\.p-|:is\(\s*\.p-|:has\(\s*p-[a-zA-Z]|\bp-[a-z][\w-]*)/;

function selectorContext(decl) {
  const parts = [];
  let node = decl.parent;
  while (node) {
    if (node.type === 'rule' && node.selector) {
      parts.unshift(node.selector);
    }
    node = node.parent;
  }
  return parts.join(' ');
}

function isPrimeNgContext(decl) {
  return PRIME_SELECTOR.test(selectorContext(decl));
}

function ruleSetsDisplayGrid(decl) {
  const parent = decl.parent;
  if (!parent?.walkDecls) return false;
  let grid = false;
  parent.walkDecls('display', (sibling) => {
    const value = sibling.value.trim();
    if (value === 'grid' || value === 'inline-grid') {
      grid = true;
    }
  });
  return grid;
}

function isScaleSpacing(value) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized || RESET_VALUES.test(normalized)) return false;
  if (SCALE_VAR.test(normalized)) return true;
  if (/var\(/i.test(normalized)) return false;
  return /(?:\d+(?:\.\d+)?|\.\d+)(px|rem|em|%|ch|vh|vw|dvh|svh|lvh)\b/.test(
    normalized,
  );
}

function hintFor(prop, value) {
  if (prop === 'display' && FLEX_DISPLAY.has(value.trim())) {
    return value.trim() === 'inline-flex' ? '`o-layout--inline-flex`' : '`o-flex`';
  }
  if (prop === 'flex-direction') {
    return '`o-flex--col` / `o-flex--row`';
  }
  if (prop === 'align-items') {
    return '`o-flex--align-items-*`';
  }
  if (prop === 'overflow' || prop === 'overflow-x' || prop === 'overflow-y') {
    return '`o-layout--overflow-*`';
  }
  if (prop === 'gap' || prop === 'row-gap' || prop === 'column-gap') {
    return '`o-layout--gap-*`';
  }
  if (prop.startsWith('padding')) {
    return '`o-layout--padding-*`';
  }
  if (prop.startsWith('margin')) {
    return '`o-layout--margin-*`';
  }
  return 'an `o-flex` / `o-layout` class';
}

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const valid = utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });
    if (!valid) return;

    const file = result.root?.source?.input?.file ?? '';
    if (SKIP_LAYERS.test(file.replaceAll('\\', '/'))) return;

    root.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value;
      if (isPrimeNgContext(decl)) return;

      let flagged = false;
      if (prop === 'display' && FLEX_DISPLAY.has(value.trim())) {
        flagged = true;
      } else if (prop === 'flex-direction') {
        flagged = true;
      } else if (prop === 'align-items' && !ruleSetsDisplayGrid(decl)) {
        flagged = true;
      } else if (
        (prop === 'overflow' || prop === 'overflow-x' || prop === 'overflow-y') &&
        value.trim() !== 'unset'
      ) {
        flagged = true;
      } else if (SPACING_PROPS.has(prop) && isScaleSpacing(value)) {
        flagged = true;
      }

      if (!flagged) return;

      utils.report({
        ruleName,
        result,
        node: decl,
        message: messages.rejected(prop, hintFor(prop, value)),
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
