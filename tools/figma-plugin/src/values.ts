import { colorsEqual, cssToFigmaColor } from '../../tokens/figma-values.mjs';

export type FigmaResolvedType = 'COLOR' | 'FLOAT' | 'STRING';
export type FigmaValue =
  | { r: number; g: number; b: number; a: number }
  | number
  | string;

export interface MappedValue {
  resolvedType: FigmaResolvedType;
  value: FigmaValue;
  preview: string;
}

export interface ProposalToken {
  $type?: string;
  $value?: unknown;
  $extensions?: {
    'com.solidaris.pds'?: {
      cssVar?: string;
      source?: string;
      reason?: string;
    };
  };
}

export function previewValue(token: ProposalToken): string {
  const value = token.$value;
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  if (Array.isArray(value)) return value.join(', ');
  if (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value
  ) {
    const dim = value as { value: number; unit: string };
    return `${dim.value}${dim.unit}`;
  }
  return JSON.stringify(value);
}

export function toFigmaValue(
  token: ProposalToken,
): MappedValue | { skip: true; reason: string } {
  const type = token.$type;
  const value = token.$value;
  const reason = token.$extensions?.['com.solidaris.pds']?.reason;

  if (type === 'other' || type == null) {
    return { skip: true, reason: reason ?? 'unsupported:value' };
  }

  if (type === 'color') {
    const color = typeof value === 'string' ? cssToFigmaColor(value) : null;
    if (!color) return { skip: true, reason: 'unsupported:color' };
    return { resolvedType: 'COLOR', value: color, preview: String(value) };
  }

  if (type === 'dimension') {
    const dim = value as { value?: number; unit?: string } | null;
    if (!dim || dim.unit !== 'px' || typeof dim.value !== 'number') {
      return { skip: true, reason: 'unsupported:dimension' };
    }
    return {
      resolvedType: 'FLOAT',
      value: dim.value,
      preview: `${dim.value}px`,
    };
  }

  if (type === 'number' || type === 'fontWeight') {
    if (typeof value !== 'number')
      return { skip: true, reason: `unsupported:${type}` };
    return { resolvedType: 'FLOAT', value, preview: String(value) };
  }

  if (type === 'fontFamily') {
    const families = Array.isArray(value) ? value.map(String) : null;
    if (!families?.length)
      return { skip: true, reason: 'unsupported:fontFamily' };
    const joined = families.join(', ');
    return { resolvedType: 'STRING', value: joined, preview: joined };
  }

  return { skip: true, reason: reason ?? `unsupported:${type}` };
}

export function valuesMatch(
  resolvedType: FigmaResolvedType,
  planned: FigmaValue,
  existing: unknown,
): boolean {
  if (existing == null) return false;
  if (resolvedType === 'COLOR') {
    const plannedColor = planned as {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    const existingColor = existing as {
      r: number;
      g: number;
      b: number;
      a?: number;
    };
    return colorsEqual(plannedColor, {
      r: existingColor.r,
      g: existingColor.g,
      b: existingColor.b,
      a: existingColor.a ?? 1,
    });
  }
  if (resolvedType === 'FLOAT') {
    return (
      typeof existing === 'number' &&
      Math.abs(existing - Number(planned)) < 0.0001
    );
  }
  return String(existing) === String(planned);
}
