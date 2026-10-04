// Chart colours for chart.js, read at runtime from the PrimeNG Aura `--p-*`
// custom properties so charts follow the active theme (dark, `html.dark`).
//
// Categorical order (dataviz method, validated with validate_palette.js against
// the Aura dark card surface #18181b and page surface #09090b — lightness band,
// chroma floor, adjacent CVD ΔE ≥ 8 (worst 8.8), normal-vision ΔE ≥ 15 (worst
// 20.1), contrast ≥ 3:1): blue-500, orange-600, teal-600, amber-600, pink-500,
// green-600, violet-500, red-500. Assign in this order, never cycled; a series
// keeps its slot when a filter hides another series.
//
// Ordinal ramp (funnel stages, reuse potential): blue 700 → 100, validated with
// --ordinal (monotone L, adjacent ΔL ≥ 0.06, end step ≥ 2:1 on the surface).

export interface ChartTheme {
  text: string;
  muted: string;
  primary: string;
  primaryFill: string;
  accent: string;
  accentFill: string;
  grid: string;
  tooltipBg: string;
  /** Card surface — used for the 2px gap between touching marks and point rings. */
  surface: string;
  fontFamily: string;
  /** Categorical slots 1–8, fixed order. */
  categorical: string[];
  /** Ordinal ramp, first step to last step (5 steps). */
  ordinal: string[];
  /** De-emphasis / "unknown" gray. */
  neutral: string;
}

const CATEGORICAL_TOKENS: [token: string, fallback: string][] = [
  ['--p-blue-500', '#3b82f6'],
  ['--p-orange-600', '#ea580c'],
  ['--p-teal-600', '#0d9488'],
  ['--p-amber-600', '#d97706'],
  ['--p-pink-500', '#ec4899'],
  ['--p-green-600', '#16a34a'],
  ['--p-violet-500', '#8b5cf6'],
  ['--p-red-500', '#ef4444'],
];

const ORDINAL_TOKENS: [token: string, fallback: string][] = [
  ['--p-blue-700', '#1d4ed8'],
  ['--p-blue-500', '#3b82f6'],
  ['--p-blue-400', '#60a5fa'],
  ['--p-blue-300', '#93c5fd'],
  ['--p-blue-100', '#dbeafe'],
];

export function readChartTheme(): ChartTheme {
  if (typeof document === 'undefined') {
    return {
      text: '#f1f5f9',
      muted: '#94a3b8',
      primary: '#60a5fa',
      primaryFill: 'rgba(96, 165, 250, 0.72)',
      accent: '#34d399',
      accentFill: 'rgba(52, 211, 153, 0.15)',
      grid: 'rgba(148, 163, 184, 0.2)',
      tooltipBg: '#0f172a',
      surface: '#18181b',
      fontFamily: 'system-ui, sans-serif',
      categorical: CATEGORICAL_TOKENS.map(([, fallback]) => fallback),
      ordinal: ORDINAL_TOKENS.map(([, fallback]) => fallback),
      neutral: '#71717a',
    };
  }

  const root = getComputedStyle(document.documentElement);
  const get = (token: string, fallback: string) =>
    root.getPropertyValue(token).trim() || fallback;
  const primary = get('--p-primary-color', '#60a5fa');

  return {
    text: get('--p-text-color', '#f1f5f9'),
    muted: get('--p-text-muted-color', '#94a3b8'),
    primary,
    primaryFill: withAlpha(primary, 0.72),
    accent: get('--p-green-400', '#34d399'),
    accentFill: 'rgba(52, 211, 153, 0.15)',
    grid: get('--p-content-border-color', 'rgba(148, 163, 184, 0.2)'),
    tooltipBg: get('--p-surface-900', '#0f172a'),
    surface: get('--p-content-background', '#18181b'),
    fontFamily: getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif',
    categorical: CATEGORICAL_TOKENS.map(([token, fallback]) => get(token, fallback)),
    ordinal: ORDINAL_TOKENS.map(([token, fallback]) => get(token, fallback)),
    neutral: get('--p-surface-500', '#71717a'),
  };
}

export function withAlpha(color: string, alpha: number): string {
  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }

  const hexMatch = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hexMatch) {
    return `rgba(${parseInt(hexMatch[1], 16)}, ${parseInt(hexMatch[2], 16)}, ${parseInt(hexMatch[3], 16)}, ${alpha})`;
  }

  return `rgba(96, 165, 250, ${alpha})`;
}
