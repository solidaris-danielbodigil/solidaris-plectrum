import type { ComponentMetadata } from '@solidaris/contracts';

export const DocDemoBoxMetadata: ComponentMetadata = {
  component: {
    name: 'DocDemoBox',
    category: 'atoms',
    description:
      'Storybook-only demo sandbox — framed preview area with a collapsible Show code panel. Not for application use.',
    type: 'display',
    path: 'libs/ui/src/lib/doc-demo-box/doc-demo-box.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-doc-demo-box',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.doc-demo-box.scss',
    created: '2026-09-05',
    modified: '2026-09-05',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
    note: 'Storybook docs tooling — not for application use.',
  },
  usage: {
    useCases: ['Foundation docs pages — framed live demos with optional source view'],
    commonPatterns: [
      {
        name: 'Demo with code panel',
        description: 'Project the live demo; pass the same markup as a string for the code panel.',
        composition: '<pds-doc-demo-box [code]="demoHtml"><div class="o-flex">…</div></pds-doc-demo-box>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Application UI',
        reason: 'Docs-only primitive — not part of the published design-system surface.',
        alternative: 'Use p-card or plain BEM blocks in apps.',
      },
    ],
  },
  props: [
    { name: 'code', type: 'string', default: "''", description: 'HTML shown in the collapsible code panel.', required: false },
    { name: 'minHeight', type: 'number', default: '0', description: 'Minimum preview height in px (0 = auto).', required: false },
  ],
  behavior: {
    states: ['code hidden', 'code visible'],
  },
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [],
  },
  aiHints: {
    priority: 'low',
    context: 'Storybook foundations infrastructure (Layout / Flex Grid pages). Never import in apps.',
    selectionCriteria: {},
    keywords: ['storybook', 'docs', 'demo'],
  },
  examples: [
    {
      name: 'default',
      description: 'Foundation demo cell',
      code: '<pds-doc-demo-box [code]="html"><div class="o-flex o-layout--gap-2">…</div></pds-doc-demo-box>',
    },
  ],
};
