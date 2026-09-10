import type { ComponentMetadata } from '@solidaris/contracts';

/**
 * CSS-only block: c-drawer shell elements for headless PrimeNG p-drawer. There
 * is no generic Angular wrapper, so this file is not exported from the library —
 * it is the documentation SSOT for the Storybook page and for agents.
 */
export const DrawerMetadata: ComponentMetadata = {
  component: {
    name: 'Drawer',
    category: 'organisms',
    description:
      "c-drawer is the headless shell vocabulary for PrimeNG drawers: features render inside p-drawer's #headless template using these element classes plus object-class mixes. There is no generic Angular wrapper — the block keeps shared chrome consistent while every feature owns its content.",
    type: 'container',
    path: 'libs/styles/src/06-components/_components.drawer.scss',
    primeNgComponent: 'Drawer',
    bemBlock: 'c-drawer',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.drawer.scss',
    created: '2026-09-09',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'A headless p-drawer that needs shared header and section chrome',
      'Feature drawers that prefix elements on c-drawer (rule 09 §9)',
      'Overlay panels that must appendTo="body" to escape clipped layouts',
    ],
    commonPatterns: [
      {
        name: 'Headless drawer shell',
        description:
          'p-drawer stays stock Plectrum; the feature renders header and sections inside #headless with the shared element classes, mounts on body and takes its width from PDS_DRAWER_CONTENT_STYLE (libs/ui/src/lib/drawer).',
        composition:
          '<p-drawer [(visible)]="open" position="right" [appendTo]="PDS_DRAWER_APPEND_TO" [style]="PDS_DRAWER_CONTENT_STYLE">\n  <ng-template #headless>\n    <header class="c-drawer__header u-border-bottom o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout--gap-2 o-layout--padding-2" [style]="PDS_PANEL_BORDER_BOTTOM_STYLE">…</header>\n    <section class="c-drawer__section o-flex o-flex--y o-layout--gap-2 o-flex__item--shrink-0 o-layout--padding-inline-2" aria-labelledby="section-1">\n      <h3 id="section-1" class="c-drawer__section-title o-layout--margin-0">Informations générales</h3>\n      <dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0">…</dl>\n    </section>\n  </ng-template>\n</p-drawer>',
      },
      {
        name: 'Feature-scoped elements',
        description:
          'Feature children prefix the element name on the shared block instead of opening a nested block — c-drawer__profile-name, c-drawer__profile-note (Affiliate Detail Drawer).',
        composition: '<h2 class="c-drawer__profile-name o-layout--margin-0">{{ name }}</h2>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'styleClass on the p-drawer root (rule 09 §11)',
        reason:
          'Rule 09 §11 reserves the p-drawer root for PrimeNG: width and chrome never hang off a root class, so the sizing decision stays visible in the template as a style binding.',
        alternative:
          'Bind [style]="PDS_DRAWER_CONTENT_STYLE" for width and keep chrome on the #headless elements.',
      },
      {
        scenario: 'Inventing a nested BEM block for feature chrome',
        reason:
          'A second block inside the drawer splits ownership of the shell and duplicates spacing and typography (rule 09 §9).',
        alternative: 'Prefix the element on c-drawer: c-drawer__{feature}-{part}.',
      },
      {
        scenario: 'An always-visible side panel',
        reason:
          'p-drawer is an overlay with a mask, focus trap and Escape handling — none of that belongs on persistent layout.',
        alternative: 'Use a static column layout (o-layout / o-flex) for always-visible content.',
      },
    ],
  },
  anatomy: [
    { part: 'p-drawer', role: 'PrimeNG host — stock Plectrum, no --p-drawer-* override; owns the mask, focus trap and Escape' },
    { part: 'c-drawer__header', role: 'Header row — identity, actions, bottom border via u-border-bottom + panel-border' },
    { part: 'c-drawer__section', role: 'One content section — vertical flex, shrink-0, inline padding' },
    { part: 'c-drawer__section-title', role: 'Section heading typography' },
    { part: 'c-drawer__{feature}-{part}', role: 'Feature children prefix the element name on the shared block — never a nested block (rule 09 §9)' },
  ],
  behavior: {
    states: ['closed', 'open', 'headless'],
    interactions: [
      'p-drawer itself is stock Plectrum — no --p-drawer-* token is overridden; the block covers only what #headless leaves to the consumer',
      'Content-driven width: width: max-content clamped between --pds-size-drawer-min-width and --pds-size-drawer-max-width (_settings.drawer.scss), applied through [style]="PDS_DRAWER_CONTENT_STYLE" because rule 09 §11 forbids styleClass on the root',
      'Overlay target: appendTo="body" (PDS_DRAWER_APPEND_TO) so flex and overflow-hidden layouts do not clip the panel; pdsOverlayAppendTo() resolves the Storybook preview frame for docs canvases',
      'Header, section and section-title classes exist because headless mode ships no header or section chrome — every drawer would otherwise invent its own',
      'Feature elements (c-drawer__profile-*) are owned by the Affiliate Detail Drawer and prefixed on the shared block per rule 09 §9',
    ],
    responsive: [
      '--pds-size-drawer-max-width is calc(100vw - --pds-spacing-4), so the panel never exceeds the viewport',
    ],
  },
  props: [],
  accessibility: {
    wcagLevel: 'AA',
    role: 'complementary',
    ariaAttributes: [
      'Label each section with aria-labelledby pointing at the section title id',
      'PrimeNG renders the panel as role="complementary" and owns the focus trap (pFocusTrap), Escape and the modal mask',
      "Headless mode drops PrimeNG's close button and its aria label — close and overflow actions need their own accessible names; decorative separators stay aria-hidden",
    ],
    keyboardSupport: [
      'Escape closes the drawer (closeOnEscape, PrimeNG default)',
      'Tab cycles inside the panel while it is open (PrimeNG focus trap)',
    ],
  },
  tokens: {
    consumed: [
      '--pds-color-content-border',
      '--pds-color-panel-border',
      '--pds-color-profile-drawer-note-author',
      '--pds-color-profile-drawer-note-bg',
      '--pds-color-profile-drawer-note-timestamp',
      '--pds-color-profile-drawer-relationship',
      '--pds-color-profile-drawer-tile-bg',
      '--pds-color-text',
      '--pds-color-text-muted',
      '--pds-focus-ring-color',
      '--pds-focus-ring-offset',
      '--pds-focus-ring-style',
      '--pds-focus-ring-width',
      '--pds-radius-profile-drawer-note',
      '--pds-radius-profile-drawer-tile',
      '--pds-size-drawer-max-width',
      '--pds-size-drawer-min-width',
      '--pds-spacing-4',
    ],
  },
  composition: {
    slots: [
      {
        name: '#headless',
        description:
          'PrimeNG headless template — the feature renders c-drawer__header and c-drawer__section elements here',
      },
    ],
    companions: ['ProfileDrawerComponent', 'DetailList', 'Accordion'],
    nestedComponents: ['Drawer'],
  },
  aiHints: {
    priority: 'high',
    context:
      'Shared shell vocabulary for headless PrimeNG drawers. Use the element classes inside #headless, mount on body with PDS_DRAWER_APPEND_TO, size with PDS_DRAWER_CONTENT_STYLE and prefix feature elements on c-drawer. Helpers (PDS_DRAWER_APPEND_TO, PDS_DRAWER_CONTENT_STYLE, PDS_PANEL_BORDER_BOTTOM_STYLE, DrawerPosition, DetailListRow, pdsOverlayAppendTo) live in libs/ui/src/lib/drawer. Stock Drawer lives in the Plectrum for PrimeNG (Main) Figma file; there is no UI Kit node for the shell. Reference usage: Affiliate Detail Drawer (iSHARE-Audit node 7:1012).',
    selectionCriteria: {
      'headless p-drawer with sections': 'use the c-drawer elements',
      'affiliate detail surface': 'use ProfileDrawerComponent',
      'always-visible side panel': 'use a static column layout',
    },
    keywords: ['drawer', 'headless', 'p-drawer', 'overlay', 'side panel', 'appendTo', 'section', 'shell'],
  },
  examples: [
    {
      name: 'Headless drawer',
      description:
        'Stock p-drawer mounted on body with content-driven width; the shell elements live in #headless.',
      code: '<p-drawer [(visible)]="open" position="right" [appendTo]="PDS_DRAWER_APPEND_TO" [style]="PDS_DRAWER_CONTENT_STYLE">\n  <ng-template #headless>\n    <header class="c-drawer__header u-border-bottom o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout--gap-2 o-layout--padding-2" [style]="PDS_PANEL_BORDER_BOTTOM_STYLE">\n      <h2 class="c-drawer__section-title o-layout--margin-0">Drawer title</h2>\n      <p-button icon="bi bi-x-lg" variant="text" [rounded]="true" ariaLabel="Fermer" (onClick)="open = false" />\n    </header>\n    <section class="c-drawer__section o-flex o-flex--y o-layout--gap-2 o-flex__item--shrink-0 o-layout--padding-inline-2" aria-labelledby="section-1">\n      <h3 id="section-1" class="c-drawer__section-title o-layout--margin-0">Section title</h3>\n      …\n    </section>\n  </ng-template>\n</p-drawer>',
    },
  ],
};
