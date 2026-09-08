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

function inferControl(prop: ArgTypeProp): StoryArgType['control'] {
  if (prop.control === false || isOutputProp(prop)) {
    return false;
  }
  if (prop.control) {
    return { type: prop.control };
  }
  if (prop.options?.length) {
    return { type: 'select' };
  }
  const type = prop.type.toLowerCase();
  if (type === 'boolean' || type.startsWith('boolean ')) {
    return { type: 'boolean' };
  }
  if (type === 'number' || type.startsWith('number ')) {
    return { type: 'number' };
  }
  if (
    type.includes('[') ||
    type.includes('{') ||
    (type.includes('|') && !type.startsWith('string'))
  ) {
    return { type: 'object' };
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

  return {
    description: prop.description,
    control: inferControl(prop),
    options: prop.options ? [...prop.options] : undefined,
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
