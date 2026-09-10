import type { ComponentMetadata } from '@solidaris/contracts';

/**
 * CSS-only block: PrimeNG p-timeline + the c-timeline--content-only modifier.
 * There is no Angular wrapper, so this file is not exported from the library —
 * it is the documentation SSOT for the Storybook page and for agents.
 */
export const TimelineMetadata: ComponentMetadata = {
  component: {
    name: 'Timeline',
    category: 'molecules',
    description:
      'c-timeline--content-only is a PrimeNG Timeline restyle for single-column journeys: it removes the empty opposite column so content starts at the marker. There is no Angular wrapper — apply the class to p-timeline directly.',
    type: 'display',
    path: 'libs/styles/src/06-components/_components.timeline.scss',
    primeNgComponent: 'Timeline',
    bemBlock: 'c-timeline',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.timeline.scss',
    created: '2026-09-09',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Single-column journey timelines where dates sit with the content, not in #opposite',
      'iSHARE document more-details drawers and similar follow-up histories',
    ],
    commonPatterns: [
      {
        name: 'Content-only timeline',
        description:
          'Dates, titles and status tags all live in the #content template; the modifier hides the opposite column.',
        composition:
          '<p-timeline class="c-timeline--content-only" [value]="events" align="left">\n  <ng-template #content let-event>\n    <div class="o-flex o-flex--col o-layout--gap-0-5 o-layout--padding-block-end-3">\n      <small>{{ event.date }}</small>\n      <strong>{{ event.title }}</strong>\n      <p-tag [value]="event.status" [severity]="event.severity" />\n    </div>\n  </ng-template>\n</p-timeline>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Two-column timelines that need the #opposite slot',
        reason:
          'The modifier sets display: none on .p-timeline-event-opposite, so anything rendered there disappears.',
        alternative: 'Use stock p-timeline without the modifier.',
      },
      {
        scenario: 'Reimplementing markers or connectors outside PrimeNG',
        reason:
          'p-timeline already renders the marker, the connector and the event layout; a custom list duplicates it.',
        alternative: 'Customise through the #marker template and c-timeline--* modifiers.',
      },
    ],
  },
  anatomy: [
    { part: 'p-timeline', role: 'PrimeNG host — never reimplemented' },
    { part: 'c-timeline--content-only', role: 'Modifier — drops the empty opposite column' },
    { part: '.p-timeline-event-marker / .p-timeline-event-connector', role: 'PrimeNG timeline chrome' },
    { part: '#content template', role: 'Event title, date, and status tag' },
  ],
  behavior: {
    states: ['content-only', 'stock'],
    interactions: [
      'PrimeNG always renders .p-timeline-event-opposite with flex: 1, even without an #opposite template; the modifier hides it and lets .p-timeline-event-content grow (flex: 1 1 auto, min-width: 0, overflow: visible)',
      'A nested p-table inside an event keeps overflow visible and width: max-content so the table drives the panel width inside content-driven drawers',
      'The restyle assumes align="left"; the story knob exposes right only for comparison',
    ],
  },
  props: [],
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Keep event titles and dates as visible text in the content template',
      'Status tags need a text label — not colour alone',
      'PrimeNG Timeline renders events as plain div elements with no roles or ARIA — all meaning must live in the content template as visible text',
    ],
    keyboardSupport: [
      'The timeline is static — only interactive content (links, buttons inside #content) enters the tab order',
    ],
  },
  tokens: {
    consumed: [],
  },
  composition: {
    nestedComponents: ['Timeline', 'Tag'],
    companions: ['Accordion', 'Drawer'],
    slots: [],
  },
  aiHints: {
    priority: 'medium',
    context:
      'PrimeNG Timeline restyle for single-column journeys — the modifier hides the empty opposite column so dates and content start at the marker. Reference usage: iSHARE document more-details drawer (bordered accordions inside timeline events). No Plectrum UI Kit node; stock Timeline lives in the Plectrum for PrimeNG (Main) Figma file.',
    selectionCriteria: {
      'single-column event history': 'p-timeline with c-timeline--content-only',
      'two-column timeline with dates opposite': 'stock p-timeline',
    },
    keywords: ['timeline', 'journey', 'history', 'events', 'p-timeline', 'content-only'],
  },
  examples: [
    {
      name: 'Content-only timeline',
      description: 'The class is written on the PrimeNG host; dates live in the content template.',
      code: '<p-timeline class="c-timeline--content-only" [value]="events" align="left">\n  <ng-template #content let-event>\n    <div class="o-flex o-flex--col o-layout--gap-0-5 o-layout--padding-block-end-3">\n      <small>{{ event.date }}</small>\n      <strong>{{ event.title }}</strong>\n      <p-tag [value]="event.status" [severity]="event.severity" />\n    </div>\n  </ng-template>\n</p-timeline>',
    },
  ],
};
