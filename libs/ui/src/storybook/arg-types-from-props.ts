/**
 * Storybook `argTypes` from `{name}.metadata.ts` `props`.
 *
 * Angular signal inputs do not always document themselves, so the API table
 * (`<ArgTypes>`) stays empty unless every row has description, type, and default.
 * Metadata is the SSOT; this helper is the module-load mapping Storybook needs
 * (see `.ai/rules/10-css-ssot.md` §5).
 */
import type { PropDefinition } from '@solidaris/contracts';
import type { ArgTypes } from 'storybook/internal/csf';

export type ArgTypeCategory =
  | 'Inputs'
  | 'Outputs'
  | 'Models'
  | 'Classes'
  | 'Story knobs'
  | 'PrimeNG';

export type ArgTypeControlType =
  | 'text'
  | 'boolean'
  | 'number'
  | 'object'
  | 'select'
  | 'radio';

export interface ArgTypeProp extends PropDefinition {
  category?: ArgTypeCategory;
  /** `false` hides the row from Controls but keeps it on the API table. */
  control?: false | ArgTypeControlType;
  options?: readonly (string | number | boolean | null)[];
}

export interface StoryArgType {
  name?: string;
  description: string;
  control: false | { type: ArgTypeControlType };
  options?: (string | number | boolean | null)[];
  table: {
    category: ArgTypeCategory;
    type: { summary: string };
    defaultValue?: { summary: string };
  };
}

const OUTPUT_NAME =
  /(Change|Click|Copy|Select|Submit|Launch|OpenChange)$|^(copied|clear|itemClicked)$/;

export function isOutputProp(prop: ArgTypeProp): boolean {
  if (prop.category === 'Outputs') {
    return true;
  }
  return /^output</i.test(prop.type) || OUTPUT_NAME.test(prop.name);
}

/** Signal wrappers whose inner type decides the control (`model<boolean>` → `boolean`). */
const SIGNAL_WRAPPER = /^(?:model|input|inputsignal|modelsignal|signal)<(.*)>$/i;

/** Generic / structural shapes that only an object editor can express. */
const STRUCTURAL_TYPE =
  /(\[\]|\{|^(?:array|readonlyarray|record|partial|readonly|required|pick|omit|map|set|readonlymap|readonlyset)<)/i;

/**
 * Named types that are conventionally structured (`ProfileDrawerLabels`,
 * `MenuItem`, `ProfileCardStatusAction`). Scalar aliases (`IconSize`,
 * `DrawerPosition`) fall through to `text`, or `select` via story extras.
 */
const STRUCTURAL_NAME =
  /(?:Data|Labels|LabelSet|Options|Config|Props|Model|Metadata|Definition|Action|Actions|Item|Items|Row|Rows|Node|Nodes|Entry|Entries|Tag|Tags|Identifier|Identifiers|Member|Members|Section|Sections|Group|Groups)$/;

const STRING_LITERAL = /^'([^']*)'$|^"([^"]*)"$/;

/**
 * Strips a signal wrapper and `| undefined` / `| null` members so the
 * remaining type string can be matched against the control table.
 */
export function normalizeType(type: string): string {
  let normalized = type.trim();
  const wrapped = SIGNAL_WRAPPER.exec(normalized);
  if (wrapped) {
    normalized = wrapped[1].trim();
  }
  const members = splitUnion(normalized).filter(
    (member) => !/^(undefined|null)$/i.test(member),
  );
  return members.join(' | ');
}

/** Splits a union on top-level `|` only — generics such as `Record<'a' | 'b', X>` stay intact. */
function splitUnion(type: string): string[] {
  const members: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of type) {
    if (char === '<' || char === '(' || char === '[' || char === '{') {
      depth++;
    } else if (char === '>' || char === ')' || char === ']' || char === '}') {
      depth--;
    }
    if (char === '|' && depth === 0) {
      members.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    members.push(current.trim());
  }
  return members;
}

/** `'a' | 'b'` → `['a', 'b']`; anything that is not a pure literal union → `undefined`. */
export function literalUnionOptions(type: string): string[] | undefined {
  const members = splitUnion(normalizeType(type));
  if (members.length < 2) {
    return undefined;
  }
  const values: string[] = [];
  for (const member of members) {
    const match = STRING_LITERAL.exec(member);
    if (!match) {
      return undefined;
    }
    values.push(match[1] ?? match[2] ?? '');
  }
  return values;
}

function looksLikeStructuralDefault(value: string | undefined): boolean {
  return value !== undefined && /^\s*[[{]/.test(value);
}

function inferControl(prop: ArgTypeProp): StoryArgType['control'] {
  if (prop.control === false || isOutputProp(prop)) {
    return false;
  }
  if (prop.control) {
    return { type: prop.control };
  }
  if (prop.options?.length || literalUnionOptions(prop.type)) {
    return { type: 'select' };
  }

  const type = normalizeType(prop.type);
  const lower = type.toLowerCase();

  if (lower === 'boolean') {
    return { type: 'boolean' };
  }
  if (lower === 'number') {
    return { type: 'number' };
  }
  if (lower === 'string') {
    return { type: 'text' };
  }
  if (
    STRUCTURAL_TYPE.test(type) ||
    looksLikeStructuralDefault(prop.default) ||
    (splitUnion(type).length > 1 && !lower.startsWith('string'))
  ) {
    return { type: 'object' };
  }
  // A bare PascalCase identifier is an interface / type alias. Without a scalar
  // default (`'right'`, `0`) or a structural name we still favour the object
  // editor for required inputs, since scalar aliases nearly always ship a default.
  if (/^[A-Z][A-Za-z0-9]*$/.test(type)) {
    if (STRUCTURAL_NAME.test(type)) {
      return { type: 'object' };
    }
    return prop.default === undefined && prop.required
      ? { type: 'object' }
      : { type: 'text' };
  }
  return { type: 'text' };
}

function inferCategory(prop: ArgTypeProp): ArgTypeCategory {
  if (prop.category) {
    return prop.category;
  }
  if (isOutputProp(prop)) {
    return 'Outputs';
  }
  if (/^model</i.test(prop.type)) {
    return 'Models';
  }
  return 'Inputs';
}

export function toArgType(prop: ArgTypeProp): StoryArgType {
  const defaultSummary =
    prop.default !== undefined
      ? prop.default
      : prop.required
        ? 'required'
        : undefined;

  const control = inferControl(prop);
  const options = prop.options
    ? [...prop.options]
    : control && control.type === 'select'
      ? literalUnionOptions(prop.type)
      : undefined;

  return {
    description: prop.description,
    control,
    options,
    table: {
      category: inferCategory(prop),
      type: { summary: prop.type },
      ...(defaultSummary !== undefined
        ? { defaultValue: { summary: defaultSummary } }
        : {}),
    },
  };
}

export function argTypesFromProps(
  props: readonly ArgTypeProp[],
  extras: Record<string, Partial<ArgTypeProp>> = {},
): ArgTypes {
  const result: Record<string, StoryArgType> = {};
  for (const prop of props) {
    result[prop.name] = toArgType({ ...prop, ...extras[prop.name] });
  }
  return result as ArgTypes;
}

export function classArgTypes(
  classes: readonly {
    name: string;
    description: string;
    category?: ArgTypeCategory;
  }[],
): ArgTypes {
  return Object.fromEntries(
    classes.map((entry) => [
      entry.name,
      {
        name: entry.name,
        ...toArgType({
          name: entry.name,
          type: 'class',
          required: false,
          description: entry.description,
          category: entry.category ?? 'Classes',
          control: false,
        }),
      },
    ]),
  ) as ArgTypes;
}
