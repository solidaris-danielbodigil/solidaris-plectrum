/**
 * Shared literal formatting for the token pipeline.
 */

export function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  let hex = value.trim().toLowerCase();
  if (
    (hex.startsWith('"') && hex.endsWith('"')) ||
    (hex.startsWith("'") && hex.endsWith("'"))
  ) {
    hex = hex.slice(1, -1);
  }
  const hex8 = hex.match(/^#([0-9a-f]{8})$/);
  if (hex8) {
    const rgb = hex8[1].slice(0, 6);
    const alpha = hex8[1].slice(6);
    if (alpha === 'ff') return `#${rgb}`;
    const a = parseInt(alpha, 16) / 255;
    const r = parseInt(rgb.slice(0, 2), 16);
    const g = parseInt(rgb.slice(2, 4), 16);
    const b = parseInt(rgb.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
  }
  const hex6 = hex.match(/^#([0-9a-f]{6})$/);
  if (hex6) return `#${hex6[1]}`;
  const hex3 = hex.match(/^#([0-9a-f]{3})$/);
  if (hex3) {
    const [r, g, b] = hex3[1];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return null;
}

export function formatCssLiteral(value) {
  if (value == null) return null;
  if (typeof value === 'object') return formatShadowValue(value);
  if (typeof value === 'number') {
    return value === 0 ? '0' : `${value}px`;
  }
  const raw = String(value).trim();
  const hex = normalizeHex(raw);
  if (hex) return hex;
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    return Number(raw) === 0 ? '0' : `${raw}px`;
  }
  return raw;
}

function isShadowLayer(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ['x', 'y', 'blur', 'spread', 'color'].some((key) => key in value)
  );
}

/**
 * Layers of a DTCG composite shadow as exported by the PrimeUI plugin
 * (`aura/effects`): one `{ x, y, blur, spread, color }` object or an array.
 * Figma lists effects bottom-most first; CSS paints the first box-shadow on
 * top, so arrays are reversed. This matches the PrimeUI Aura preset, Tailwind,
 * and the order the earlier Tokens Studio dumps used.
 * Returns null for anything that is not shadow-shaped.
 */
export function shadowLayersFromValue(value) {
  const layers = Array.isArray(value) ? [...value].reverse() : [value];
  if (layers.length === 0 || !layers.every(isShadowLayer)) return null;
  return layers.map((layer) =>
    formatShadowLayer(layer.x, layer.y, layer.blur, layer.spread, layer.color),
  );
}

/**
 * Layers of a shadow stored as expanded leaves (`prefix.x` or `prefix.0.x`, …),
 * the shape older Tokens Studio dumps used. Null when no such leaves exist.
 */
export function shadowLayersFromPaths(resolved, prefix) {
  const layers = [];
  for (let i = 0; i < 8; i += 1) {
    const x = resolved[`${prefix}.${i}.x`];
    const y = resolved[`${prefix}.${i}.y`];
    const blur = resolved[`${prefix}.${i}.blur`];
    const spread = resolved[`${prefix}.${i}.spread`];
    const color = resolved[`${prefix}.${i}.color`];
    if (x == null && y == null && color == null) {
      if (i === 0) {
        const sx = resolved[`${prefix}.x`];
        const sy = resolved[`${prefix}.y`];
        const sb = resolved[`${prefix}.blur`];
        const ss = resolved[`${prefix}.spread`];
        const sc = resolved[`${prefix}.color`];
        if (sx == null && sy == null && sc == null) return null;
        return [formatShadowLayer(sx, sy, sb, ss, sc)];
      }
      break;
    }
    layers.push(formatShadowLayer(x, y, blur, spread, color));
  }
  return layers.length ? layers : null;
}

export function formatShadowValue(value) {
  const layers = shadowLayersFromValue(value);
  return layers ? layers.join(', ') : null;
}

export function composeDropShadow(resolved, prefix) {
  const direct = resolved[prefix];
  const layers =
    direct !== null && typeof direct === 'object'
      ? shadowLayersFromValue(direct)
      : shadowLayersFromPaths(resolved, prefix);
  return layers ? layers.join(', ') : null;
}

function formatShadowLayer(x, y, blur, spread, color) {
  const cx = formatCssLiteral(x ?? 0);
  const cy = formatCssLiteral(y ?? 0);
  const cb = formatCssLiteral(blur ?? 0);
  const cs = formatCssLiteral(spread ?? 0);
  const cc = formatCssLiteral(color ?? '#00000000') ?? 'transparent';
  return `${cx} ${cy} ${cb} ${cs} ${cc}`;
}

/**
 * Extract the fallback literal from `var(--p-foo, <literal>)`.
 */
export function unwrapHybridValue(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  const match = trimmed.match(
    /^var\(\s*--p-[a-z0-9-]+\s*,\s*([\s\S]+)\)$/i,
  );
  return match ? match[1].trim() : trimmed;
}
