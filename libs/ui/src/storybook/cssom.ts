// =============================================================================
// libs/ui/src/storybook/cssom.ts
// Reads the compiled stylesheet — the single source of truth for which tokens
// and classes exist. See .ai/rules/10-css-ssot.md.
//
// Nothing here restates a value. Everything is read from document.styleSheets
// at runtime, so a token added to 01-settings appears in Storybook with no
// other edit, and a deleted one disappears.
// =============================================================================

/** A `--pds-*` custom property exactly as authored in `:root`. */
export interface TokenDeclaration {
  /** `--pds-color-primary-600` */
  cssVar: string;
  /** `color-primary-600` — the name without the prefix. */
  name: string;
  /** Specified value, e.g. `var(--p-primary-600, #487395)` or `6px`. */
  authored: string;
  /** PrimeNG variable this token aliases, when it emits the hybrid shape. */
  primeNgVar: string | null;
  /** Literal behind the alias, or the plain value when there is no alias. */
  fallback: string;
}

const ROOT_SELECTOR = /(^|,)\s*(:root|html)\b/;
/** `var(--p-x, <literal>)` — the hybrid emit. Captures alias and fallback. */
const HYBRID = /^var\(\s*(--[a-z0-9-]+)\s*,\s*([\s\S]+)\)$/i;

/**
 * Every CSSStyleRule in the document, descending into @media / @layer /
 * @supports. Cross-origin sheets throw on `cssRules` and are skipped.
 */
function* styleRules(): Generator<CSSStyleRule> {
  if (typeof document === 'undefined') return;

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    yield* walk(rules);
  }
}

function* walk(rules: CSSRuleList): Generator<CSSStyleRule> {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      yield rule;
    } else if ('cssRules' in rule) {
      yield* walk((rule as CSSGroupingRule).cssRules);
    }
  }
}

function parseAuthored(authored: string): Pick<TokenDeclaration, 'primeNgVar' | 'fallback'> {
  const hybrid = HYBRID.exec(authored);
  if (!hybrid) return { primeNgVar: null, fallback: authored };
  return { primeNgVar: hybrid[1], fallback: hybrid[2].trim() };
}

/**
 * All global tokens with the given prefix, keyed by CSS variable.
 *
 * Collected in document order so a later declaration overwrites an earlier one
 * — the same way the cascade resolves it. Generated files are forwarded before
 * their hand-authored counterparts, so the effective value wins.
 */
export function readTokenDeclarations(prefix = '--pds-'): Map<string, TokenDeclaration> {
  const declarations = new Map<string, TokenDeclaration>();

  for (const rule of styleRules()) {
    if (!ROOT_SELECTOR.test(rule.selectorText)) continue;

    for (let i = 0; i < rule.style.length; i += 1) {
      const cssVar = rule.style.item(i);
      if (!cssVar.startsWith(prefix)) continue;

      const authored = rule.style.getPropertyValue(cssVar).trim();
      declarations.set(cssVar, {
        cssVar,
        name: cssVar.slice(prefix.length),
        authored,
        ...parseAuthored(authored),
      });
    }
  }

  return declarations;
}

/**
 * Class names matching a pattern, taken from the selectors the stylesheet
 * actually generated. Responsive variants (`.u-x\@md`) are escaped in the
 * selector text; pass a pattern that accounts for that if you want them.
 */
export function readClassNames(pattern: RegExp): string[] {
  const found = new Set<string>();

  for (const rule of styleRules()) {
    // Selector text keeps the backslash escape for `@` in `.o-x--y\@md`.
    for (const match of rule.selectorText.matchAll(/\.((?:[\w-]|\\.)+)/g)) {
      const className = match[1].replaceAll('\\', '');
      if (pattern.test(className)) found.add(className);
    }
  }

  return [...found].sort();
}

/**
 * Trailing segment of every class matching `pattern`, in stylesheet order of
 * first appearance. Use for "which stops exist" style questions where the demo
 * only needs the variant name.
 *
 * `readClassSuffixes(/^u-radius-(.+)$/)` → `['none', 'xs', … 'top-start-xl']`
 */
export function readClassSuffixes(pattern: RegExp): string[] {
  const suffixes = new Set<string>();

  for (const className of readClassNames(pattern)) {
    const match = pattern.exec(className);
    if (match?.[1]) suffixes.add(match[1]);
  }

  return [...suffixes];
}

/** A generated class and the properties its rule actually sets. */
export interface ClassRule {
  className: string;
  /** Captured group 1 of the pattern, when present — usually the variant name. */
  suffix: string;
  /** Property names declared by the rule, e.g. `['border-top']`. */
  properties: string[];
}

/**
 * Classes matching `pattern` together with the properties they declare.
 *
 * Lets a docs page group classes by what they *do* rather than by a hand-written
 * list: `.u-border-top` sets `border-top`, `.u-border-thick` sets
 * `--pds-border-width`, `.u-border-danger` sets `--pds-border-color`.
 */
export function readClassRules(pattern: RegExp): ClassRule[] {
  const found = new Map<string, ClassRule>();

  for (const rule of styleRules()) {
    for (const match of rule.selectorText.matchAll(/\.((?:[\w-]|\\.)+)/g)) {
      const className = match[1].replaceAll('\\', '');
      const parsed = pattern.exec(className);
      if (!parsed) continue;

      const existing = found.get(className);
      const properties = existing?.properties ?? [];
      for (let i = 0; i < rule.style.length; i += 1) {
        const prop = rule.style.item(i);
        if (!properties.includes(prop)) properties.push(prop);
      }

      found.set(className, {
        className,
        suffix: parsed[1] ?? '',
        properties,
      });
    }
  }

  return [...found.values()].sort((a, b) => a.className.localeCompare(b.className));
}

/** Resolved value of a token on `element`, honouring scoped overrides. */
export function resolveToken(element: Element, cssVar: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(element).getPropertyValue(cssVar).trim();
}
