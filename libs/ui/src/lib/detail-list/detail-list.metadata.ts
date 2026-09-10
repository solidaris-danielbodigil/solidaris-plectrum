import type { ComponentMetadata } from '@solidaris/contracts';

/**
 * CSS-only block: c-detail-list on a semantic <dl>. There is no Angular
 * wrapper, so this file is not exported from the library — it is the
 * documentation SSOT for the Storybook page and for agents.
 */
export const DetailListMetadata: ComponentMetadata = {
  component: {
    name: 'DetailList',
    category: 'molecules',
    description:
      'c-detail-list renders label / value description rows on a semantic <dl>. The block owns the label column width and typography; layout is o-flex mixes in the template. The DetailListRow type is exported from @solidaris/ui (libs/ui/src/lib/drawer).',
    type: 'display',
    path: 'libs/styles/src/06-components/_components.detail-list.scss',
    bemBlock: 'c-detail-list',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.detail-list.scss',
    created: '2026-09-09',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Read-only label / value rows in a drawer or card section',
      'Shared description lists that need a fixed label column',
    ],
    commonPatterns: [
      {
        name: 'Description rows',
        description:
          'A dl block with o-flex rows; dt / dd carry the element classes and the dd margin is reset with an object class.',
        composition:
          '<dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0">\n  <div class="o-flex o-flex--align-items-baseline o-layout--gap-2">\n    <dt class="c-detail-list__label">Numéro national</dt>\n    <dd class="c-detail-list__value o-layout--margin-0">85.07.30-033.61</dd>\n  </div>\n</dl>',
      },
      {
        name: 'Inside a drawer section',
        description:
          'The list sits under a c-drawer__section-title; aria-labelledby on the section points at the title.',
        composition:
          '<section class="c-drawer__section o-flex o-flex--y o-layout--gap-2" aria-labelledby="general-title">\n  <h3 id="general-title" class="c-drawer__section-title o-layout--margin-0">Informations générales</h3>\n  <dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0">…</dl>\n</section>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Editable fields',
        reason:
          'c-detail-list is read-only display typography; it has no label association, validation or help-text contract.',
        alternative: 'Use Form Field (pds-form-field) for inputs.',
      },
      {
        scenario: 'Tabular data with many columns',
        reason:
          'A description list pairs one label with one value; extra columns lose their header semantics.',
        alternative: 'Use a data table (p-table) for columnar data.',
      },
    ],
  },
  anatomy: [
    { part: 'c-detail-list', role: '<dl> block — rows are flex children' },
    { part: 'c-detail-list__label', role: '<dt> — fixed-width label column' },
    { part: 'c-detail-list__value', role: '<dd> — value; margin reset via o-layout--margin-0' },
  ],
  behavior: {
    states: ['default', 'in-drawer-section'],
    interactions: [
      'The block styles only the label width and typography; row layout is object classes in the template (o-flex rows, o-layout--gap-2, o-layout--margin-0 on dd)',
      'The label column is fixed at --pds-size-detail-list-label-width (flex: 0 0) so values align across rows',
    ],
  },
  props: [],
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Keep the semantic <dl> / <dt> / <dd> pairing — do not flatten rows into generic divs without those roles',
      'When the list sits in a drawer section, point aria-labelledby on the section at the section title',
      'Values that are links or copy actions must expose their own accessible names',
    ],
    keyboardSupport: [
      'The list itself is static text — only interactive values (links, copy buttons) enter the tab order',
    ],
  },
  tokens: {
    consumed: ['--pds-color-text', '--pds-size-detail-list-label-width'],
  },
  composition: {
    parentConstraints: ['c-drawer__section', 'Card or panel sections'],
    companions: ['ProfileDrawerComponent', 'Drawer'],
    slots: [],
  },
  aiHints: {
    priority: 'medium',
    context:
      'Read-only label / value rows on a semantic dl inside drawers, panels and cards. CSS-only block: write the markup (or map DetailListRow[] from @solidaris/ui) and compose the layout with o-flex / o-layout. Reference usage: Profile Drawer sections (iSHARE-Audit node 7:1012); there is no Plectrum UI Kit node.',
    selectionCriteria: {
      'label / value rows': 'use c-detail-list on a dl',
      'editable fields': 'use FormField',
      'many columns': 'use a data table',
    },
    keywords: ['detail list', 'description list', 'dl', 'label value', 'key value', 'drawer section'],
  },
  examples: [
    {
      name: 'Description rows',
      description: 'Rows mapped from DetailListRow[] — dt / dd carry the element classes.',
      code: '<dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0">\n  @for (row of rows; track row.label) {\n    <div class="o-flex o-flex--align-items-baseline o-layout--gap-2">\n      <dt class="c-detail-list__label">{{ row.label }}</dt>\n      <dd class="c-detail-list__value o-layout--margin-0">{{ row.value }}</dd>\n    </div>\n  }\n</dl>',
    },
  ],
};
