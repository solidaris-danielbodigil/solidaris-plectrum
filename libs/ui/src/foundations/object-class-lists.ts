// =============================================================================
// libs/ui/src/foundations/object-class-lists.ts
// Variant lists for the Flex Grid ArgTypes table.
//
// Storybook reads `meta.argTypes` at module-evaluation time, before the CSSOM is
// guaranteed to be parsed, so these lists cannot be derived at render time the
// way the demo templates are.
//
// They are therefore static *and validated*: object-class-lists.spec.ts asserts
// every list against the classes the stylesheet actually generates, so a new or
// renamed modifier fails a test instead of drifting silently.
// See .ai/rules/10-css-ssot.md §5.
// =============================================================================

/** A documented variant list paired with the selector pattern that proves it. */
export interface ClassList {
  /** Class shape shown in the docs, e.g. `.o-flex--align-items-{value}`. */
  label: string;
  /** Matches generated class names; capture group 1 is the variant. */
  pattern: RegExp;
  /**
   * Restrict to rules declaring one of these properties, when the class shape
   * alone is ambiguous. Use longhands — the CSSOM expands shorthands, so a rule
   * written `flex-flow: wrap` enumerates as `flex-wrap` / `flex-direction`.
   */
  declares?: readonly string[];
  values: readonly string[];
}

const COLS_1_12 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
const COLS_0_12 = ['0', ...COLS_1_12] as const;

export const BREAKPOINT_SUFFIXES = ['@xs', '@sm', '@md', '@lg', '@xl'] as const;

/** Responsive suffixes actually emitted — `@xs` is the implicit default. */
export const RESPONSIVE: ClassList = {
  label: '@{breakpoint}',
  pattern: /^o-flex--y@([a-z]+)$/,
  values: ['sm', 'md', 'lg', 'xl'],
};

export const FLEX: Record<string, ClassList> = {
  flexFlow: {
    label: '.o-flex--{flow}',
    pattern: /^o-flex--([a-z-]+)$/,
    declares: ['flex-wrap', 'flex-direction'],
    values: [
      // `--y` is authored directly rather than through the map, but it sets the
      // same longhands, so it belongs to this group.
      'y',
      'wrap',
      'nowrap',
      'wrap-reverse',
      'row',
      'row-reverse',
      'col',
      'col-reverse',
      'row-wrap',
      'row-nowrap',
      'col-wrap',
      'col-nowrap',
    ],
  },
  alignItems: {
    label: '.o-flex--align-items-{value}',
    pattern: /^o-flex--align-items-([a-z-]+)$/,
    values: [
      'stretch',
      'center',
      'flex-start',
      'flex-end',
      'baseline',
      'inherit',
      'initial',
      'unset',
    ],
  },
  alignContent: {
    label: '.o-flex--align-content-{value}',
    pattern: /^o-flex--align-content-([a-z-]+)$/,
    values: [
      'center',
      'flex-start',
      'flex-end',
      'space-between',
      'space-around',
      'space-evenly',
      'stretch',
      'inherit',
      'initial',
      'unset',
    ],
  },
  justifyContent: {
    label: '.o-flex--justify-content-{value}',
    pattern: /^o-flex--justify-content-([a-z-]+)$/,
    values: [
      'center',
      'flex-start',
      'flex-end',
      'space-between',
      'space-around',
      'space-evenly',
      'inherit',
      'initial',
      'unset',
    ],
  },
  alignSelf: {
    label: '.o-flex__item--align-self-{value}',
    pattern: /^o-flex__item--align-self-([a-z-]+)$/,
    values: [
      'auto',
      'center',
      'flex-start',
      'flex-end',
      'baseline',
      'stretch',
      'inherit',
      'initial',
      'unset',
    ],
  },
  span: {
    label: '.o-flex__item--{1–12}',
    pattern: /^o-flex__item--(\d+)$/,
    values: COLS_1_12,
  },
  grow: {
    label: '.o-flex__item--grow-{0–12}',
    pattern: /^o-flex__item--grow-(\d+)$/,
    values: COLS_0_12,
  },
  shrink: {
    label: '.o-flex__item--shrink-{0–12}',
    pattern: /^o-flex__item--shrink-(\d+)$/,
    values: COLS_0_12,
  },
  order: {
    label: '.o-flex__item--order-{0–12}',
    pattern: /^o-flex__item--order-(\d+)$/,
    values: COLS_0_12,
  },
};

/** `a | b | c` for an ArgTypes `type.summary`. */
export function summary(list: ClassList): string {
  return list.values.join(' | ');
}
