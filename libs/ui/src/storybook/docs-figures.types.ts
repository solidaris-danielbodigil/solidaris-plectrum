// =============================================================================
// libs/ui/src/storybook/docs-figures.types.ts
// Shared data shapes for the Docs/Token pipeline figures.
//
// Tones name the three places a token travels through. They map onto PrimeNG
// severities so Tag, Badge and Message paint them with Plectrum's own colours:
//   design  → Figma            → warn    (orange)
//   system  → this repository  → info    (blue)
//   app     → iSHARE / iCRM    → success (green)
//   neutral → CI / process     → secondary
// =============================================================================

export type FigureTone = 'design' | 'system' | 'app' | 'neutral';

export type ToneSeverity = 'warn' | 'info' | 'success' | 'secondary';

const TONE_SEVERITY: Readonly<Record<FigureTone, ToneSeverity>> = {
  design: 'warn',
  system: 'info',
  app: 'success',
  neutral: 'secondary',
};

export function toneSeverity(tone: FigureTone = 'neutral'): ToneSeverity {
  return TONE_SEVERITY[tone];
}

/** A Storybook page a figure points at. `path` is the manager route, e.g. `/docs/foundations-spacing--docs`. */
export interface DocsLink {
  label: string;
  path: string;
}

export type DocsLinkTarget = '_top' | '_blank' | '_self';

export interface DocsLinkAttrs {
  href: string;
  target: DocsLinkTarget;
  rel?: string;
}

/** Figures render inline in the docs iframe; `./?path=…` + `target="_top"` routes the manager. */
export function docsHref(link: Pick<DocsLink, 'path'>): string {
  return `./?path=${link.path}`;
}

/**
 * Resolve href + target for a docs page link.
 * Markdown `?path=` is relative to iframe.html — rewrite to `./?path=` so
 * `target="_top"` opens the manager, matching Angular figure links.
 */
export function docsLinkAttrs(href: string): DocsLinkAttrs {
  if (href.startsWith('#')) {
    return { href, target: '_self' };
  }

  if (/^https?:\/\//i.test(href)) {
    return { href, target: '_blank', rel: 'noopener noreferrer' };
  }

  const normalized = href.startsWith('?path=') ? `./${href}` : href;
  return { href: normalized, target: '_top' };
}

export interface DocsStep {
  title: string;
  detail?: string;
  /** Who acts — rendered as a p-tag coloured by `tone`. */
  who?: string;
  tone?: FigureTone;
  /** Pages the step refers to — rendered as a row of links under the detail. */
  links?: readonly DocsLink[];
}

export interface DocsCard {
  /** Short label above the title — rendered as a p-tag coloured by `tone`. */
  eyebrow?: string;
  title: string;
  lead?: string;
  items?: readonly string[];
  tone?: FigureTone;
}

export type DocsCalloutTone = 'info' | 'warning' | 'success';

export type CalloutSeverity = 'info' | 'warn' | 'success';

const CALLOUT_SEVERITY: Readonly<Record<DocsCalloutTone, CalloutSeverity>> = {
  info: 'info',
  warning: 'warn',
  success: 'success',
};

const CALLOUT_ICON: Readonly<Record<DocsCalloutTone, string>> = {
  info: 'bi bi-info-circle-fill',
  warning: 'bi bi-exclamation-triangle-fill',
  success: 'bi bi-check-circle-fill',
};

export function calloutSeverity(tone: DocsCalloutTone = 'info'): CalloutSeverity {
  return CALLOUT_SEVERITY[tone];
}

export function calloutIcon(tone: DocsCalloutTone = 'info'): string {
  return CALLOUT_ICON[tone];
}
