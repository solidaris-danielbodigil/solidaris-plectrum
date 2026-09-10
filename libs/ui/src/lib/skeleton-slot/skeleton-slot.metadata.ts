import type { ComponentMetadata } from '@solidaris/contracts';

/**
 * CSS-only block: c-skeleton-slot / c-skeleton-count-badge wrappers around
 * PrimeNG p-skeleton. There is no Angular wrapper, so this file is not exported
 * from the library — it is the documentation SSOT for the Storybook page and
 * for agents.
 */
export const SkeletonSlotMetadata: ComponentMetadata = {
  component: {
    name: 'SkeletonSlot',
    category: 'atoms',
    description:
      'c-skeleton-slot and c-skeleton-count-badge are sized wrappers that keep PrimeNG p-skeleton placeholders on the same rhythm as the content they stand in for — no layout shift when data arrives. Both classes are generic: the slot is a line-height box, the count badge a circle sized by a token.',
    type: 'feedback',
    path: 'libs/styles/src/06-components/_components.skeleton-slot.scss',
    primeNgComponent: 'Skeleton',
    bemBlock: 'c-skeleton-slot',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.skeleton-slot.scss',
    created: '2026-09-09',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Loading placeholders that must match the eventual line or badge size',
      'List and profile-card loading states that already wrap p-skeleton',
    ],
    commonPatterns: [
      {
        name: 'Text line placeholder',
        description:
          'The slot is a display: block, line-height: 0 box; p-skeleton fills it and inherits the slot radius (--pds-radius-sm).',
        composition: '<div class="c-skeleton-slot"><p-skeleton width="60%" height="1.25rem" /></div>',
      },
      {
        name: 'Count badge placeholder',
        description: 'Circular wrapper sized by the list count-badge token.',
        composition:
          '<span class="c-skeleton-count-badge"><p-skeleton shape="circle" size="var(--pds-size-list-count-badge-min)" /></span>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Reimplementing a skeleton shape',
        reason:
          'p-skeleton already provides the shimmer, the shapes and aria-hidden; a hand-rolled placeholder duplicates PrimeNG.',
        alternative: 'Always place PrimeNG p-skeleton inside the slot.',
      },
      {
        scenario: 'Page-specific skeleton dimensions in 06-components',
        reason:
          'Per-page sizes hardcode px / rem into the shared layer and drift from the content they mimic.',
        alternative:
          'Add a size token in 01-settings first and pass it through p-skeleton width / height / size.',
      },
    ],
  },
  anatomy: [
    { part: 'c-skeleton-slot', role: 'Line-height box around p-skeleton' },
    { part: 'c-skeleton-count-badge', role: 'Circular badge-sized wrapper' },
    { part: 'p-skeleton', role: 'PrimeNG placeholder — never reimplemented' },
  ],
  behavior: {
    states: ['loading'],
    interactions: [
      "The slot is display: block, flex-shrink: 0, line-height: 0 with --pds-radius-sm; the nested p-skeleton fills it (inline-size / block-size 100%) and inherits the radius, so PrimeNG's width / height inputs set the slot size",
      'c-skeleton-count-badge only prevents shrinking and collapses line-height; the circle size comes from p-skeleton size="var(--pds-size-list-count-badge-min)"',
    ],
  },
  props: [],
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Loading regions that contain these slots should set aria-busy="true" on the parent',
      'Decorative placeholders do not need names — p-skeleton sets aria-hidden="true" on its host, so the parent loading label is enough',
    ],
    keyboardSupport: ['Placeholders are not focusable and never enter the tab order'],
  },
  tokens: {
    consumed: ['--pds-radius-sm', '--pds-size-list-count-badge-min'],
  },
  composition: {
    nestedComponents: ['Skeleton'],
    companions: ['ProfileCardComponent'],
    slots: [],
  },
  aiHints: {
    priority: 'medium',
    context:
      'Generic sized wrappers for PrimeNG p-skeleton loading placeholders — the slot matches a text line, the count badge a circle. Reference usage: Affiliate Overview Card loading state (libs/ui) and the iSHARE affiliate document detail skeletons. There is no Plectrum UI Kit node.',
    selectionCriteria: {
      'loading placeholder matching a text line': 'use c-skeleton-slot around p-skeleton',
      'count / avatar placeholder': 'use c-skeleton-count-badge with shape="circle"',
      'custom skeleton shape': 'use p-skeleton inputs — never a new block',
    },
    keywords: ['skeleton', 'loading', 'placeholder', 'shimmer', 'p-skeleton', 'aria-busy'],
  },
  examples: [
    {
      name: 'Loading lines',
      description: 'Slots keep each placeholder on the rhythm of the line it replaces.',
      code: '<div class="o-flex o-flex--col o-layout--gap-3" aria-busy="true">\n  <div class="c-skeleton-slot"><p-skeleton width="60%" height="1.25rem" /></div>\n  <div class="c-skeleton-slot"><p-skeleton width="100%" height="1rem" /></div>\n  <div class="o-flex o-flex--align-items-center o-layout--gap-2">\n    <span class="c-skeleton-count-badge"><p-skeleton shape="circle" size="var(--pds-size-list-count-badge-min)" /></span>\n    <div class="c-skeleton-slot o-flex__item--grow-1"><p-skeleton width="40%" height="1rem" /></div>\n  </div>\n</div>',
    },
  ],
};
