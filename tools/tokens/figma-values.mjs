/**
 * Shared CSS → Figma variable value conversion.
 * Used by the parked REST apply path and the Plectrum tokens plugin.
 */

export const MAIN_FILE_KEY = 'YNZ1DlSjDNUXrvkxlSp10D';
export const REM_IN_PX = 14;

/**
 * Parse a CSS color into Figma's 0–1 RGBA object.
 * Accepts hex3/6/8, rgb()/rgba(), and `transparent`.
 */
export function cssToFigmaColor(value) {
  const raw = String(value).trim();
  if (!raw || /#\{\$/.test(raw)) return null;
  if (/^transparent$/i.test(raw)) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  const hex3 = raw.match(/^#([0-9a-f]{3})$/i);
  if (hex3) {
    const [r, g, b] = hex3[1];
    return cssToFigmaColor(`#${r}${r}${g}${g}${b}${b}`);
  }

  const hex = raw.match(/^#?([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (hex) {
    const n = hex[1];
    return {
      r: parseInt(n.slice(0, 2), 16) / 255,
      g: parseInt(n.slice(2, 4), 16) / 255,
      b: parseInt(n.slice(4, 6), 16) / 255,
      a: hex[2] ? parseInt(hex[2], 16) / 255 : 1,
    };
  }

  const rgba = raw.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
  );
  if (rgba) {
    const first = Number(rgba[1]);
    const scale = first > 1 || Number(rgba[2]) > 1 || Number(rgba[3]) > 1 ? 255 : 1;
    return {
      r: Number(rgba[1]) / scale,
      g: Number(rgba[2]) / scale,
      b: Number(rgba[3]) / scale,
      a: rgba[4] != null ? Number(rgba[4]) : 1,
    };
  }

  return null;
}

export function colorsEqual(a, b, epsilon = 1 / 255) {
  if (!a || !b) return false;
  return (
    Math.abs(a.r - b.r) < epsilon &&
    Math.abs(a.g - b.g) < epsilon &&
    Math.abs(a.b - b.b) < epsilon &&
    Math.abs((a.a ?? 1) - (b.a ?? 1)) < epsilon
  );
}

export function roundPx(n) {
  return Number(Number(n).toFixed(4));
}
