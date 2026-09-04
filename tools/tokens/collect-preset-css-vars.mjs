/**
 * Approximate the --p-* names a PrimeNG preset will emit for primitives
 * and semantic tokens. camelCase segments become kebab-case.
 * colorScheme.light is flattened (no `semantic` / `color-scheme` prefix).
 */

function kebab(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replaceAll('.', '-')
    .toLowerCase();
}

function walk(node, parts, out) {
  if (node == null) return;
  if (typeof node !== 'object' || Array.isArray(node)) {
    if (parts.length) out.add(`--p-${parts.join('-')}`);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    walk(value, [...parts, kebab(key)], out);
  }
}

export function collectPresetCssVars(preset) {
  const out = new Set();
  if (preset?.primitive) walk(preset.primitive, [], out);
  if (preset?.semantic) {
    const { colorScheme, ...rest } = preset.semantic;
    walk(rest, [], out);
    if (colorScheme?.light) walk(colorScheme.light, [], out);
  }
  return out;
}
