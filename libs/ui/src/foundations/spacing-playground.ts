// =============================================================================
// libs/ui/src/foundations/spacing-playground.ts
// Helpers behind Foundations/Spacing → Playground. Kept out of the CSF file so
// Storybook does not index them as stories; the spec imports them from here.
// Everything is read from the compiled stylesheet (rule 10-css-ssot).
// =============================================================================

import {
  readClassSuffixes,
  readTokenDeclarations,
  resolveToken,
} from '../storybook/cssom';

/** Box properties the playground exposes — each is an `o-layout--{property}-{stop}` family. */
export const SPACING_PROPERTIES = ['gap', 'padding', 'margin'] as const;
export type SpacingProperty = (typeof SPACING_PROPERTIES)[number];

/** `--pds-spacing-{stop}` — the token an `o-layout--*-{stop}` class references. */
export const spacingTokenVar = (stop: string): string => `--pds-spacing-${stop}`;

/**
 * Numeric order for scale stops: `0`, `0-25`, `0-5`, `0-75`, `1`, `1-5`, `2`…
 * A stop like `0-75` is the decimal `0.75`; keyword stops (`auto`) sort last.
 */
export function compareStops(a: string, b: string): number {
  const numeric = (stop: string): number => {
    const value = Number(stop.replace(/^(\d+)-(\d+)$/, '$1.$2'));
    return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
  };
  const diff = numeric(a) - numeric(b);
  return diff !== 0 && !Number.isNaN(diff) ? diff : a.localeCompare(b);
}

/**
 * Whether `property` accepts the value `--pds-spacing-{stop}` resolves to.
 *
 * The stylesheet generates `o-layout--gap-auto` because the scale map is
 * applied to every spacing key, but `gap: auto` is invalid at computed-value
 * time and collapses to `normal`. `CSS.supports` asks the engine directly, so
 * `margin-auto` stays while `gap-auto` / `padding-auto` never appear.
 */
export function acceptsStop(property: string, stop: string): boolean {
  const token = readTokenDeclarations().get(spacingTokenVar(stop));
  if (!token) return false;
  const value =
    (typeof document !== 'undefined' &&
      resolveToken(document.documentElement, token.cssVar)) ||
    token.fallback;
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return true;
  }
  return CSS.supports(property, value);
}

/**
 * Non-responsive stops the stylesheet generates for `o-layout--{property}-*`
 * — each one backed by a `--pds-spacing-{stop}` token the property actually
 * accepts, in numeric order.
 */
export function spacingStops(property: string): string[] {
  const pattern = new RegExp(`^o-layout--${property}-([a-z0-9-]+)$`);
  const tokens = readTokenDeclarations();
  return readClassSuffixes(pattern)
    .filter((stop) => !stop.includes('@'))
    .filter((stop) => tokens.has(spacingTokenVar(stop)))
    .filter((stop) => acceptsStop(property, stop))
    .sort(compareStops);
}

/** `{property}Stop` — the per-property Controls arg (each property has its own valid set). */
export const stopArgName = (property: string): string => `${property}Stop`;

/** Class suffix `0-25` → display `0.25`. Public class names stay dashed. */
export function stopDisplayLabel(stop: string): string {
  return stop.replace(/^(\d+)-(\d+)$/, '$1.$2');
}

export const SPACING_PROPERTY_HINTS: Record<SpacingProperty, string> = {
  gap: 'Space between children. Pair with o-flex on the same element.',
  padding: 'Inset inside the box.',
  margin: 'Offset outside the box. auto centres the box on the inline axis.',
};

export function spacingClass(property: SpacingProperty, stop: string): string {
  return `o-layout--${property}-${stop}`;
}

/** Complete template snippet — gap always includes the required o-flex companion. */
export function spacingSnippet(property: SpacingProperty, stop: string): string {
  const cls = spacingClass(property, stop);
  return property === 'gap'
    ? `<div class="o-flex ${cls}">…</div>`
    : `<div class="${cls}">…</div>`;
}

/**
 * Live stop label from the CSSOM (`2 — 14px` in the 14px-root context).
 * No hardcoded px table — `resolveToken` plus a probe for the used length.
 */
export function resolveSpacingStop(stop: string): string {
  const label = stopDisplayLabel(stop);
  if (stop === 'auto') return label;

  const cssVar = spacingTokenVar(stop);
  if (typeof document === 'undefined') return label;

  const authored = resolveToken(document.documentElement, cssVar);
  const used = measureTokenLength(cssVar);
  if (used) return `${label} — ${used}`;
  return authored ? `${label} — ${authored}` : label;
}

function measureTokenLength(cssVar: string): string {
  const probe = document.createElement('div');
  probe.style.width = `var(${cssVar})`;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.documentElement.appendChild(probe);
  const width = getComputedStyle(probe).width;
  probe.remove();
  return width;
}
