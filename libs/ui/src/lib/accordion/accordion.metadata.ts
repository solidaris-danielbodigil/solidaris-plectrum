import type { ComponentMetadata } from '@solidaris/contracts';

/**
 * CSS-only block: PrimeNG p-accordion + the c-accordion--* BEMIT layer. There is
 * no Angular wrapper, so this file is not exported from the library — it is the
 * documentation SSOT for the Storybook page and for agents.
 */
export const AccordionMetadata: ComponentMetadata = {
  component: {
    name: 'Accordion',
    category: 'molecules',
    description:
      'PrimeNG p-accordion with the Plectrum theme. Certificate and audit panels add c-accordion--bordered — a BEMIT modifier already in libs/styles. There is no Angular wrapper and no [border] input: put the class on p-accordion.',
    type: 'container',
    path: 'libs/styles/src/06-components/_components.accordion.scss',
    primeNgComponent: 'Accordion',
    bemBlock: 'c-accordion',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.accordion.scss',
    figmaUrl:
      'https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=544-6474',
    created: '2026-09-09',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Expandable certificate or audit panels on a dossier',
      'Stacked sections where one or more panels may be open',
      'Stock Plectrum accordion when the bordered card stack is not required',
    ],
    commonPatterns: [
      {
        name: 'Bordered certificate panel',
        description:
          'Same PrimeNG control as the stock accordion; the host class is written in the template, as in iSHARE.',
        composition:
          '<p-accordion class="c-accordion--bordered o-layout--full-width o-layout--min-w-0" [value]="\'0\'">\n  <p-accordion-panel value="0">\n    <p-accordion-header>Certificat ITT</p-accordion-header>\n    <p-accordion-content>…</p-accordion-content>\n  </p-accordion-panel>\n</p-accordion>',
      },
      {
        name: 'Stacked bordered panels',
        description:
          'Several panels share one outer edge; the sibling radii come from the 06-components layer.',
        composition:
          '<p-accordion class="c-accordion--bordered o-layout--full-width o-layout--min-w-0" [multiple]="true" [value]="[\'0\']">\n  <p-accordion-panel value="0">…</p-accordion-panel>\n  <p-accordion-panel value="1">…</p-accordion-panel>\n</p-accordion>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Reimplementing expand / collapse outside PrimeNG',
        reason:
          'p-accordion already owns the toggle, the aria-expanded / aria-controls wiring and the arrow-key navigation between headers.',
        alternative:
          'Use p-accordion and change only its appearance through the c-accordion--* modifiers.',
      },
      {
        scenario: 'Overriding .p-accordionpanel with hardcoded colour or !important',
        reason:
          'Stock --p-accordion-* tokens come from providePlectrum(); ad-hoc overrides break theme switching and the PrimeNG-first rule.',
        alternative:
          'Bridge --p-accordion-* to --pds-* tokens inside the modifier in 01-settings/_settings.accordion.scss.',
      },
      {
        scenario: 'A [border] input on a wrapper that does not exist',
        reason:
          'There is no Angular Accordion wrapper; the bordered look is a CSS modifier, not a property.',
        alternative: 'Write c-accordion--bordered on p-accordion in the template.',
      },
    ],
  },
  anatomy: [
    { part: 'p-accordion', role: 'PrimeNG host — owns expand, collapse, and the .p-accordion* DOM' },
    { part: 'c-accordion--bordered', role: 'BEMIT modifier — card-like stacked radii and --p-accordion-* token bridges' },
    { part: 'p-accordion-panel', role: 'One collapsible section; may be disabled' },
    { part: 'p-accordion-header / p-accordion-content', role: 'PrimeNG header and body slots' },
  ],
  variants: {
    modifier: {
      options: ['none', 'bordered', 'nav'],
      default: 'none',
      purpose: {
        none: 'Stock Plectrum p-accordion — no host class, themed by providePlectrum()',
        bordered:
          'c-accordion--bordered — card-like stacked panels for certificate and audit flows (iSHARE-Audit node 544:6474)',
        nav: 'c-accordion--nav — transparent section panels inside c-sub-nav-shell (documented on Sub Nav Shell)',
      },
    },
  },
  behavior: {
    states: ['expanded', 'collapsed', 'disabled', 'stacked'],
    interactions: [
      'PrimeNG owns expand / collapse and the .p-accordion* DOM; Plectrum owns the stock --p-accordion-* tokens through providePlectrum()',
      'c-accordion--bordered owns the card-like stack: token bridges in 01-settings/_settings.accordion.scss, stacked radii in 06-components/_components.accordion.scss',
      'Panel radii follow position: an only child keeps every corner, first / last panels keep the outer corners, middle panels are square with no block borders',
      'An expanded header gains a bottom border in --pds-color-panel-border; a disabled panel fades to --pds-disabled-opacity with a not-allowed cursor',
    ],
  },
  props: [],
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'PrimeNG renders each header as role="button" with aria-expanded, aria-controls and aria-disabled; the content is role="region" labelled by its header',
      'Keep a visible header label on every panel — do not rely on colour or a tag alone',
      'Disabled panels use [disabled] on p-accordion-panel: PrimeNG sets aria-disabled="true" and tabindex="-1" on the header',
    ],
    keyboardSupport: [
      'Enter / Space toggle the focused header',
      'ArrowDown / ArrowUp move between headers; Home / End jump to the first / last header (PrimeNG)',
      'Toggle icons are aria-hidden — the header text is the accessible name',
    ],
  },
  tokens: {
    consumed: [
      '--pds-base-unit',
      '--pds-color-accordion-bordered-header-text',
      '--pds-color-accordion-bordered-section-bg',
      '--pds-color-content-bg',
      '--pds-color-panel-border',
      '--pds-color-sub-nav-shell-section-text',
      '--pds-color-text',
      '--pds-color-text-muted',
      '--pds-disabled-opacity',
      '--pds-radius-accordion-bordered-content',
      '--pds-radius-accordion-bordered-header',
      '--pds-radius-accordion-bordered-section',
      '--pds-radius-none',
      '--pds-radius-xl',
      '--pds-space-accordion-bordered-header-gap',
      '--pds-space-accordion-bordered-padding',
      '--pds-space-sub-nav-shell-section-header-px',
      '--pds-space-sub-nav-shell-section-header-py',
      '--pds-space-sub-nav-shell-section-px',
      '--pds-space-sub-nav-shell-section-py',
      '--pds-spacing-2',
    ],
    // c-accordion--bordered bridges (01-settings/_settings.accordion.scss).
    // c-accordion--nav bridges are documented on Sub Nav Shell.
    primeNgMappings: {
      '--p-accordion-panel-border-color': '--pds-color-panel-border',
      '--p-accordion-header-background': '--pds-color-accordion-bordered-section-bg',
      '--p-accordion-header-hover-background': '--pds-color-accordion-bordered-section-bg',
      '--p-accordion-header-active-background': '--pds-color-accordion-bordered-section-bg',
      '--p-accordion-header-color': '--pds-color-accordion-bordered-header-text',
      '--p-accordion-header-hover-color': '--pds-color-accordion-bordered-header-text',
      '--p-accordion-header-active-color': '--pds-color-accordion-bordered-header-text',
      '--p-accordion-header-padding': '--pds-space-accordion-bordered-padding',
      '--p-accordion-content-background': '--pds-color-accordion-bordered-section-bg',
      '--p-accordion-content-padding': '--pds-space-accordion-bordered-padding',
      '--p-accordion-toggle-icon-color': '--pds-color-text-muted',
      '--p-accordion-toggle-icon-hover-color': '--pds-color-text',
      '--p-accordion-toggle-icon-active-color': '--pds-color-text',
    },
  },
  composition: {
    nestedComponents: ['Accordion', 'Tag'],
    companions: ['SubNavShellComponent'],
    slots: [],
  },
  aiHints: {
    priority: 'medium',
    context:
      'PrimeNG accordion with Plectrum theming. Write c-accordion--bordered on p-accordion for card-like stacked certificate / audit panels (iSHARE document detail, document more-details drawer); leave the host bare for the stock accordion. c-accordion--nav belongs to Sub Nav Shell. Never override .p-accordion* directly.',
    selectionCriteria: {
      'stacked certificate / audit panels': 'p-accordion with c-accordion--bordered',
      'plain expandable sections': 'stock p-accordion, no modifier',
      'sub-navigation sections': 'use SubNavShell (c-accordion--nav)',
    },
    keywords: ['accordion', 'p-accordion', 'bordered', 'collapsible', 'panel', 'certificate', 'stack'],
  },
  examples: [
    {
      name: 'Bordered accordion',
      description: 'The class is written on the PrimeNG host; there is no Angular input for it.',
      code: '<p-accordion class="c-accordion--bordered o-layout--full-width o-layout--min-w-0" [value]="\'0\'" expandIcon="bi bi-chevron-down" collapseIcon="bi bi-chevron-up">\n  <p-accordion-panel value="0">\n    <p-accordion-header>Certificat ITT</p-accordion-header>\n    <p-accordion-content><p class="o-layout--margin-0">Date de réception 24/11/2025</p></p-accordion-content>\n  </p-accordion-panel>\n</p-accordion>',
    },
  ],
};
