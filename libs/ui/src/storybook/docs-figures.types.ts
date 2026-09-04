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

export interface DocsStep {
  title: string;
  detail?: string;
  /** Who acts — rendered as a p-tag coloured by `tone`. */
  who?: string;
  tone?: FigureTone;
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
