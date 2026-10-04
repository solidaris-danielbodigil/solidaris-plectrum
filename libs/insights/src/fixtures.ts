// Fixture for UI work and rule tests. Repository facts mirror the checkout at
// c02f621 (2026-10-02); history points are approximate. The `demo` usage
// branch is invented like tools/insights/demo/seed.json; the `reported` branch
// is empty because no application has sent a report yet. Candidates other than
// ishare-temporary-probe are fixture-only.
import type { PlectrumInsights } from './insights.types';

const STORYBOOK = 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/';
const REPOSITORY = 'https://github.com/solidaris-danielbodigil/solidaris-plectrum';

export const INSIGHTS_FIXTURE: PlectrumInsights = {
  schemaVersion: 1,
  generatedAt: '2026-10-02T21:42:54.000Z',
  revision: 'c02f6218f67fe5786201fdd5f54b5f684d7b1dac',
  repository: REPOSITORY,
  links: {
    storybook: STORYBOOK,
    dashboard: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/dashboard/',
  },
  versions: { runtime: '2.1.0', toolkit: '0.7.1' },
  historyAvailable: true,
  repo: {
    components: [
      {
        id: 'plectrum:accordion',
        name: 'Accordion',
        status: 'core',
        owner: 'design-system',
        distribution: 'styles',
        measurable: true,
        created: '2026-09-09',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-accordion--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:copyable-text',
        name: 'CopyableText',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-08',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-copyable-text--docs',
        usedBy: [
          'plectrum:profile-card',
          'plectrum:profile-drawer',
          'plectrum:profile-header'
        ],
        scanUsedIn: []
      },
      {
        id: 'plectrum:delay-prediction-card',
        name: 'DelayPredictionCard',
        status: 'app',
        owner: 'ishare',
        distribution: 'angular',
        measurable: true,
        created: '2026-09-05',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/patterns-ishare-delay-prediction-card--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:detail-list',
        name: 'DetailList',
        status: 'core',
        owner: 'design-system',
        distribution: 'styles',
        measurable: true,
        created: '2026-09-09',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-detail-list--docs',
        usedBy: [],
        scanUsedIn: []
      },
      {
        id: 'plectrum:drawer',
        name: 'Drawer',
        status: 'core',
        owner: 'design-system',
        distribution: 'styles',
        measurable: true,
        created: '2026-09-09',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-drawer--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:empty-state',
        name: 'EmptyState',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-05',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-empty-state--docs',
        usedBy: [],
        scanUsedIn: [
          'iged',
          'ishare'
        ]
      },
      {
        id: 'plectrum:form-field',
        name: 'FormField',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-07',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-form-field--docs',
        usedBy: [],
        scanUsedIn: [
          'iged',
          'ishare'
        ]
      },
      {
        id: 'plectrum:icon',
        name: 'Icon',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-05-20',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-icon--docs',
        usedBy: [
          'plectrum:copyable-text',
          'plectrum:nav-shell'
        ],
        scanUsedIn: []
      },
      {
        id: 'plectrum:input-clear',
        name: 'InputClear',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-07',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-input-clear--docs',
        usedBy: [
          'plectrum:sub-nav-shell',
          'plectrum:top-nav'
        ],
        scanUsedIn: [
          'iged',
          'ishare'
        ]
      },
      {
        id: 'plectrum:list',
        name: 'List',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-07',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-list--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:nav-shell',
        name: 'NavShell',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2025-01-01',
        modified: '2026-09-14',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-navshell--docs',
        usedBy: [],
        scanUsedIn: [
          'iged',
          'ishare'
        ]
      },
      {
        id: 'plectrum:plectrum-avatar',
        name: 'PlectrumAvatar',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-04',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-plectrumavatar--docs',
        usedBy: [
          'plectrum:profile-card',
          'plectrum:profile-drawer',
          'plectrum:profile-header',
          'plectrum:top-nav'
        ],
        scanUsedIn: []
      },
      {
        id: 'plectrum:profile-card',
        name: 'ProfileCard',
        status: 'deprecated',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        replacementId: 'plectrum:profile-header',
        created: '2026-09-08',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-profile-card--docs',
        usedBy: [],
        scanUsedIn: []
      },
      {
        id: 'plectrum:profile-drawer',
        name: 'ProfileDrawer',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-09-08',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-profile-drawer--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:profile-header',
        name: 'ProfileHeader',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-10-02',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-profile-header--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:skeleton-slot',
        name: 'SkeletonSlot',
        status: 'core',
        owner: 'design-system',
        distribution: 'styles',
        measurable: true,
        created: '2026-09-09',
        modified: '2026-10-02',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-skeleton-slot--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:sub-nav-shell',
        name: 'SubNavShell',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-05-26',
        modified: '2026-09-14',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-subnavshell--docs',
        usedBy: [],
        scanUsedIn: [
          'iged'
        ]
      },
      {
        id: 'plectrum:timeline',
        name: 'Timeline',
        status: 'core',
        owner: 'design-system',
        distribution: 'styles',
        measurable: true,
        created: '2026-09-09',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-timeline--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      },
      {
        id: 'plectrum:toolbar',
        name: 'Toolbar',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-09-05',
        modified: '2026-09-14',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-toolbar--docs',
        usedBy: [],
        scanUsedIn: [
          'iged',
          'ishare'
        ]
      },
      {
        id: 'plectrum:top-nav',
        name: 'TopNav',
        status: 'core',
        owner: 'design-system',
        distribution: 'angular',
        measurable: true,
        created: '2026-06-05',
        modified: '2026-09-14',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-topnav--docs',
        usedBy: [],
        scanUsedIn: [
          'iged',
          'ishare'
        ]
      },
      {
        id: 'plectrum:transactions-cics-modal',
        name: 'TransactionsCicsModal',
        status: 'app',
        owner: 'ishare',
        distribution: 'angular',
        measurable: true,
        created: '2026-09-05',
        modified: '2026-09-09',
        docsUrl: 'https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/patterns-ishare-transactions-cics-modal--docs',
        usedBy: [],
        scanUsedIn: [
          'ishare'
        ]
      }
    ],
    scanHistory: [
      {
        at: '2026-09-25T12:39:31.000Z',
        revision: 'f0cc040',
        usedIn: {
          'plectrum:empty-state': ['iged', 'ishare'],
          'plectrum:form-field': ['iged', 'ishare'],
          'plectrum:input-clear': ['iged', 'ishare'],
          'plectrum:list': ['ishare'],
          'plectrum:nav-shell': ['iged', 'ishare'],
          'plectrum:sub-nav-shell': ['iged'],
          'plectrum:toolbar': ['iged', 'ishare'],
          'plectrum:top-nav': ['iged', 'ishare'],
          'plectrum:delay-prediction-card': ['ishare'],
          'plectrum:transactions-cics-modal': ['ishare'],
          'plectrum:profile-card': ['ishare'],
        },
      },
      {
        at: '2026-09-28T12:16:58.000Z',
        revision: '4424c08',
        usedIn: {
          'plectrum:empty-state': ['iged', 'ishare'],
          'plectrum:form-field': ['iged', 'ishare'],
          'plectrum:input-clear': ['iged', 'ishare'],
          'plectrum:list': ['ishare'],
          'plectrum:nav-shell': ['iged', 'ishare'],
          'plectrum:sub-nav-shell': ['iged'],
          'plectrum:toolbar': ['iged', 'ishare'],
          'plectrum:top-nav': ['iged', 'ishare'],
          'plectrum:delay-prediction-card': ['ishare'],
          'plectrum:transactions-cics-modal': ['ishare'],
          'plectrum:profile-card': ['ishare'],
          'plectrum:profile-drawer': ['ishare'],
          'plectrum:drawer': ['ishare'],
          'plectrum:timeline': ['ishare'],
        },
      },
      {
        at: '2026-10-02T21:27:41.000Z',
        revision: '29e6b2d',
        usedIn: {
          'plectrum:accordion': ['ishare'],
          'plectrum:delay-prediction-card': ['ishare'],
          'plectrum:drawer': ['ishare'],
          'plectrum:empty-state': ['iged', 'ishare'],
          'plectrum:form-field': ['iged', 'ishare'],
          'plectrum:input-clear': ['iged', 'ishare'],
          'plectrum:list': ['ishare'],
          'plectrum:nav-shell': ['iged', 'ishare'],
          'plectrum:profile-drawer': ['ishare'],
          'plectrum:profile-header': ['ishare'],
          'plectrum:skeleton-slot': ['ishare'],
          'plectrum:sub-nav-shell': ['iged'],
          'plectrum:timeline': ['ishare'],
          'plectrum:toolbar': ['iged', 'ishare'],
          'plectrum:top-nav': ['iged', 'ishare'],
          'plectrum:transactions-cics-modal': ['ishare'],
        },
      },
    ],
    catalogueHistory: [
      { at: '2026-09-25T07:27:19.000Z', revision: '4020736', byStatus: { core: 15, app: 2, deprecated: 0, candidate: 1 } },
      { at: '2026-10-01T12:04:35.000Z', revision: '72b9661', byStatus: { core: 17, app: 2, deprecated: 0, candidate: 0 } },
      { at: '2026-10-02T21:27:41.000Z', revision: '29e6b2d', byStatus: { core: 18, app: 2, deprecated: 1, candidate: 0 } },
    ],
    searchEval: {
      toolkitVersion: '0.7.1',
      total: 17,
      passed: 16,
      rate: 94,
      regressions: [],
      fixed: [],
      knownMisses: [{ id: 'member-side-panel', since: '2026-10-02T02:04:51.000Z' }],
      results: [
        {
          id: 'member-side-panel',
          query: "I need a side panel showing a member's details",
          anyOf: [
            'plectrum:drawer',
            'plectrum:profile-drawer'
          ],
          allOf: [
            'plectrum:detail-list'
          ],
          none: false,
          results: [
            'plectrum:drawer',
            'plectrum:empty-state',
            'plectrum:sub-nav-shell'
          ],
          pass: false,
          knownMiss: true
        },
        {
          id: 'document-list-states',
          query: 'What states does this document list need when it is empty or loading?',
          anyOf: [
            'plectrum:list'
          ],
          allOf: [
            'plectrum:empty-state',
            'plectrum:skeleton-slot'
          ],
          none: false,
          results: [
            'plectrum:skeleton-slot',
            'plectrum:empty-state',
            'plectrum:list',
            'plectrum:plectrum-avatar',
            'plectrum:icon'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'copy-reference',
          query: 'Let the user copy a reference number to the clipboard',
          anyOf: [
            'plectrum:copyable-text'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:copyable-text'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'clearable-search',
          query: 'Search input with a button to clear the text',
          anyOf: [
            'plectrum:input-clear'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:input-clear',
            'plectrum:form-field',
            'plectrum:toolbar',
            'plectrum:top-nav',
            'plectrum:copyable-text'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'required-field',
          query: 'Form label with a required marker and an error message',
          anyOf: [
            'plectrum:form-field'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:form-field'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'certificate-panels',
          query: 'Expandable panels for certificates on a dossier',
          anyOf: [
            'plectrum:accordion'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:accordion',
            'plectrum:profile-header',
            'plectrum:list'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'event-history',
          query: 'Show the history of events in chronological order',
          anyOf: [
            'plectrum:timeline'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:timeline'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'app-sidebar',
          query: 'Left sidebar navigation for the application',
          anyOf: [
            'plectrum:nav-shell',
            'plectrum:sub-nav-shell'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:nav-shell',
            'plectrum:sub-nav-shell',
            'plectrum:top-nav',
            'plectrum:profile-header'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'page-header',
          query: "Page header with breadcrumb, search and the user's avatar",
          anyOf: [
            'plectrum:top-nav'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:top-nav',
            'plectrum:profile-header',
            'plectrum:empty-state',
            'plectrum:skeleton-slot',
            'plectrum:toolbar'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'initials',
          query: "Show a person's initials in a circle",
          anyOf: [
            'plectrum:plectrum-avatar'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:plectrum-avatar'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'loading-placeholder',
          query: 'Placeholder while the data is loading',
          anyOf: [
            'plectrum:skeleton-slot'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:skeleton-slot'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'no-results',
          query: 'Message when a search returns no results',
          anyOf: [
            'plectrum:empty-state'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:empty-state'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'key-values',
          query: 'Summary of label and value pairs',
          anyOf: [
            'plectrum:detail-list'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:detail-list',
            'plectrum:form-field'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'filter-row',
          query: 'Row of filters and actions above a table',
          anyOf: [
            'plectrum:toolbar'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:toolbar',
            'plectrum:profile-header'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'pictogram',
          query: 'Display a bootstrap icon with an accessible name',
          anyOf: [
            'plectrum:icon'
          ],
          allOf: [],
          none: false,
          results: [
            'plectrum:icon'
          ],
          pass: true,
          knownMiss: false
        },
        {
          id: 'date-picker',
          query: 'Date picker for a birth date',
          anyOf: [],
          allOf: [],
          none: true,
          results: [],
          pass: true,
          knownMiss: false
        },
        {
          id: 'file-upload',
          query: 'Upload a PDF file',
          anyOf: [],
          allOf: [],
          none: true,
          results: [],
          pass: true,
          knownMiss: false
        }
      ],
      history: [
        { at: '2026-10-02T02:04:51.000Z', revision: 'ba1fc98', passed: 15, total: 16, rate: 94 },
        { at: '2026-10-02T02:32:11.000Z', revision: '02a5c40', passed: 16, total: 17, rate: 94 },
        { at: '2026-10-02T21:27:41.000Z', revision: '29e6b2d', passed: 16, total: 17, rate: 94 },
      ],
    },
    candidates: [
      {
        id: 'ishare-temporary-probe',
        componentId: 'ishare:temporary-probe',
        team: 'ishare',
        application: 'ishare',
        stage: 'withdrawn',
        decidedAt: '2026-09-25T08:28:11.403Z',
        submittedAt: '2026-09-25T09:10:00.000Z',
        reviewCurrent: false,
        links: {
          issue: `${REPOSITORY}/issues/12`,
          proposal: `${REPOSITORY}/blob/main/.ai/candidates/proposals/ishare-temporary-probe.json`,
          submission: `${REPOSITORY}/blob/main/.ai/candidates/submissions/ishare-temporary-probe.json`,
        },
      },
      {
        id: 'iged-queue-card',
        componentId: 'iged:queue-card',
        team: 'iged',
        application: 'iged',
        stage: 'submitted',
        decidedAt: '2026-09-15T09:00:00.000Z',
        submittedAt: '2026-09-22T14:30:00.000Z',
        reviewCurrent: false,
        links: { issue: `${REPOSITORY}/issues/31` },
      },
      {
        id: 'ishare-document-more-details-drawer',
        componentId: 'ishare:document-more-details-drawer',
        team: 'ishare',
        application: 'ishare',
        stage: 'accepted',
        decidedAt: '2026-08-28T10:00:00.000Z',
        submittedAt: '2026-09-01T10:00:00.000Z',
        reviewedAt: '2026-09-05T15:00:00.000Z',
        reviewCurrent: true,
        links: { issue: `${REPOSITORY}/issues/27` },
      },
    ],
    tokens: {
      names: 2849,
      sync: {
        stage: 'merged',
        generatedAt: '2026-09-25T12:20:37.183Z',
        runUrl: `${REPOSITORY}/actions/runs/36134312949`,
        checks: [
          { id: 'build', name: 'Build', status: 'success' },
          { id: 'audit', name: 'Audit', status: 'success' },
          { id: 'validate', name: 'Validate', status: 'success' },
          { id: 'theme', name: 'Theme', status: 'success' },
        ],
      },
      proposals: { count: 87, since: '2026-09-12T01:34:31.000Z' },
    },
    releases: {
      tags: [
        { tag: 'plectrum-v2.0.1-devkit-0.2.0', runtime: '2.0.1', toolkit: '0.2.0', at: '2026-09-27T20:55:48.000Z' },
        { tag: 'plectrum-v2.0.2-devkit-0.2.0', runtime: '2.0.2', toolkit: '0.2.0', at: '2026-09-28T05:12:43.000Z' },
        { tag: 'plectrum-v2.0.2-devkit-0.2.1', runtime: '2.0.2', toolkit: '0.2.1', at: '2026-09-28T08:36:16.000Z' },
        { tag: 'plectrum-v2.0.4-devkit-0.6.0', runtime: '2.0.4', toolkit: '0.6.0', at: '2026-10-01T22:57:34.000Z' },
        { tag: 'plectrum-v2.0.5-devkit-0.7.0', runtime: '2.0.5', toolkit: '0.7.0', at: '2026-10-02T02:59:29.000Z' },
        { tag: 'plectrum-v2.1.0-devkit-0.7.1', runtime: '2.1.0', toolkit: '0.7.1', at: '2026-10-02T21:42:54.000Z' },
      ],
      pending: [],
    },
    mcpTools: ['search_components', 'get_component', 'find_token', 'check_tokens', 'get_process'],
  },
  usage: {
    reported: {
      provenance: 'reported',
      note: 'No application has sent a usage report yet.',
      staleAfterDays: 14,
      applications: [
        { id: 'icrm', label: 'iCRM', team: 'icrm', kind: 'local-demo', reportedAt: null, packageVersion: null, reports: 0 },
        { id: 'iged', label: 'iGED', team: 'iged', kind: 'local-demo', reportedAt: null, packageVersion: null, reports: 0 },
        { id: 'ishare', label: 'iSHARE', team: 'ishare', kind: 'local-demo', reportedAt: null, packageVersion: null, reports: 0 },
      ],
      observations: [],
      agentHistory: [],
      localComponents: [],
      similarity: [],
    },
    demo: {
      provenance: 'demo',
      note: 'Demo data: component usage is scanned from this repository; agent counts and local components are invented.',
      staleAfterDays: 14,
      applications: [
        { id: 'icrm', label: 'iCRM', team: 'icrm', kind: 'local-demo', reportedAt: '2026-09-11T21:42:54.000Z', packageVersion: '2.0.2', reports: 3 },
        { id: 'iged', label: 'iGED', team: 'iged', kind: 'local-demo', reportedAt: '2026-10-02T21:42:54.000Z', packageVersion: '2.0.5', reports: 4 },
        { id: 'ishare', label: 'iSHARE', team: 'ishare', kind: 'local-demo', reportedAt: '2026-10-02T21:42:54.000Z', packageVersion: '2.1.0', reports: 4 },
      ],
      observations: [
        { application: 'iged', componentId: 'plectrum:empty-state', count: 3, files: 2 },
        { application: 'iged', componentId: 'plectrum:form-field', count: 6, files: 3 },
        { application: 'iged', componentId: 'plectrum:input-clear', count: 2, files: 1 },
        { application: 'iged', componentId: 'plectrum:nav-shell', count: 1, files: 1 },
        { application: 'iged', componentId: 'plectrum:sub-nav-shell', count: 1, files: 1 },
        { application: 'iged', componentId: 'plectrum:toolbar', count: 2, files: 2 },
        { application: 'iged', componentId: 'plectrum:top-nav', count: 1, files: 1 },
        { application: 'ishare', componentId: 'plectrum:accordion', count: 4, files: 2 },
        { application: 'ishare', componentId: 'plectrum:delay-prediction-card', count: 1, files: 1 },
        { application: 'ishare', componentId: 'plectrum:drawer', count: 3, files: 3 },
        { application: 'ishare', componentId: 'plectrum:empty-state', count: 5, files: 4 },
        { application: 'ishare', componentId: 'plectrum:form-field', count: 9, files: 4 },
        { application: 'ishare', componentId: 'plectrum:input-clear', count: 4, files: 2 },
        { application: 'ishare', componentId: 'plectrum:list', count: 3, files: 2 },
        { application: 'ishare', componentId: 'plectrum:nav-shell', count: 1, files: 1 },
        { application: 'ishare', componentId: 'plectrum:profile-drawer', count: 1, files: 1 },
        { application: 'ishare', componentId: 'plectrum:profile-header', count: 1, files: 1 },
        { application: 'ishare', componentId: 'plectrum:skeleton-slot', count: 6, files: 3 },
        { application: 'ishare', componentId: 'plectrum:timeline', count: 2, files: 1 },
        { application: 'ishare', componentId: 'plectrum:toolbar', count: 3, files: 3 },
        { application: 'ishare', componentId: 'plectrum:top-nav', count: 1, files: 1 },
        { application: 'ishare', componentId: 'plectrum:transactions-cics-modal', count: 1, files: 1 },
      ],
      agentHistory: [
        {
          application: 'icrm', observedAt: '2026-08-14T21:42:54.000Z', windowDays: 30, activeDays: 0,
          tools: { search_components: 0, get_component: 0, find_token: 0, check_tokens: 0, get_process: 0 },
          commands: {}, lookups: {}, emptySearches: 0,
          commits: { total: 0, reuse: 0, scaffold: 0, advice: 0 }, reused: {},
        },
        {
          application: 'icrm', observedAt: '2026-08-28T21:42:54.000Z', windowDays: 30, activeDays: 2,
          tools: { search_components: 4, get_component: 5, find_token: 1, check_tokens: 0, get_process: 1 },
          commands: { check: 1 }, lookups: { 'plectrum:profile-card': 2 }, emptySearches: 1,
          commits: { total: 2, reuse: 1, scaffold: 0, advice: 1 }, reused: {},
        },
        {
          application: 'icrm', observedAt: '2026-09-11T21:42:54.000Z', windowDays: 30, activeDays: 3,
          tools: { search_components: 6, get_component: 9, find_token: 2, check_tokens: 0, get_process: 1 },
          commands: { check: 2 }, lookups: { 'plectrum:profile-card': 4, 'plectrum:drawer': 2 }, emptySearches: 1,
          commits: { total: 3, reuse: 1, scaffold: 0, advice: 2 }, reused: {},
        },
        {
          application: 'iged', observedAt: '2026-08-21T21:42:54.000Z', windowDays: 30, activeDays: 5,
          tools: { search_components: 14, get_component: 18, find_token: 6, check_tokens: 0, get_process: 2 },
          commands: { check: 6 }, lookups: { 'plectrum:sub-nav-shell': 5, 'plectrum:form-field': 4 }, emptySearches: 2,
          commits: { total: 6, reuse: 4, scaffold: 0, advice: 2 }, reused: { 'plectrum:sub-nav-shell': 1 },
        },
        {
          application: 'iged', observedAt: '2026-09-04T21:42:54.000Z', windowDays: 30, activeDays: 6,
          tools: { search_components: 17, get_component: 21, find_token: 5, check_tokens: 0, get_process: 2 },
          commands: { check: 8 }, lookups: { 'plectrum:form-field': 5, 'plectrum:drawer': 3 }, emptySearches: 2,
          commits: { total: 7, reuse: 5, scaffold: 0, advice: 2 }, reused: { 'plectrum:form-field': 2 },
        },
        {
          application: 'iged', observedAt: '2026-09-18T21:42:54.000Z', windowDays: 30, activeDays: 7,
          tools: { search_components: 20, get_component: 26, find_token: 7, check_tokens: 0, get_process: 3 },
          commands: { check: 9, scaffold: 1 }, lookups: { 'plectrum:drawer': 5, 'plectrum:list': 3 }, emptySearches: 3,
          commits: { total: 8, reuse: 5, scaffold: 1, advice: 2 }, reused: { 'plectrum:toolbar': 1 },
        },
        {
          application: 'iged', observedAt: '2026-10-02T21:42:54.000Z', windowDays: 30, activeDays: 8,
          tools: { search_components: 22, get_component: 30, find_token: 8, check_tokens: 0, get_process: 2 },
          commands: { check: 11 }, lookups: { 'plectrum:drawer': 6, 'plectrum:list': 4 }, emptySearches: 3,
          commits: { total: 9, reuse: 6, scaffold: 0, advice: 3 }, reused: { 'plectrum:empty-state': 2 },
        },
        {
          application: 'ishare', observedAt: '2026-08-21T21:42:54.000Z', windowDays: 30, activeDays: 9,
          tools: { search_components: 31, get_component: 44, find_token: 12, check_tokens: 0, get_process: 3 },
          commands: { check: 14, scaffold: 1 }, lookups: { 'plectrum:drawer': 9 }, emptySearches: 9,
          commits: { total: 11, reuse: 7, scaffold: 1, advice: 3 }, reused: { 'plectrum:drawer': 3 },
        },
        {
          application: 'ishare', observedAt: '2026-09-04T21:42:54.000Z', windowDays: 30, activeDays: 11,
          tools: { search_components: 38, get_component: 51, find_token: 15, check_tokens: 0, get_process: 4 },
          commands: { check: 17, scaffold: 1 }, lookups: { 'plectrum:drawer': 7, 'plectrum:timeline': 5 }, emptySearches: 12,
          commits: { total: 13, reuse: 8, scaffold: 1, advice: 4 }, reused: { 'plectrum:timeline': 2 },
        },
        {
          application: 'ishare', observedAt: '2026-09-18T21:42:54.000Z', windowDays: 30, activeDays: 12,
          tools: { search_components: 44, get_component: 58, find_token: 17, check_tokens: 0, get_process: 3 },
          commands: { check: 19, scaffold: 2 }, lookups: { 'plectrum:skeleton-slot': 6, 'plectrum:accordion': 4 }, emptySearches: 15,
          commits: { total: 15, reuse: 9, scaffold: 2, advice: 4 }, reused: { 'plectrum:skeleton-slot': 3 },
        },
        {
          application: 'ishare', observedAt: '2026-10-02T21:42:54.000Z', windowDays: 30, activeDays: 14,
          tools: { search_components: 48, get_component: 63, find_token: 19, check_tokens: 0, get_process: 4 },
          commands: { check: 22, scaffold: 1 }, lookups: { 'plectrum:profile-header': 7, 'plectrum:drawer': 5 }, emptySearches: 18,
          commits: { total: 16, reuse: 10, scaffold: 1, advice: 5 }, reused: { 'plectrum:profile-header': 2, 'plectrum:drawer': 1 },
        },
      ],
      localComponents: [
        {
          id: 'ishare:document-more-details-drawer',
          name: 'DocumentMoreDetailsDrawer',
          description: 'Side drawer with the full details of a document: metadata, status history and related files.',
          useCases: ['Show every field of a document without leaving the list', 'Review the status history of a document'],
          reusePotential: 'likely',
          reuseNote: 'Same structure as the iCRM contact details drawer; both sit on PrimeNG Drawer.',
          team: 'ishare',
          application: 'ishare',
        },
        {
          id: 'ishare:delay-banner',
          name: 'DelayBanner',
          description: 'Inline banner announcing processing delays for the current file type.',
          useCases: ['Warn a member that a request will take longer than usual'],
          reusePotential: 'none',
          team: 'ishare',
          application: 'ishare',
        },
        {
          id: 'iged:queue-card',
          name: 'QueueCard',
          description: 'Card summarising a work queue: item count, oldest item age and an open action.',
          useCases: ['Pick the next work queue to process', 'See which queue is falling behind'],
          reusePotential: 'possible',
          reuseNote: 'Close to a list item with a count; could become a List variant.',
          team: 'iged',
          application: 'iged',
        },
        {
          id: 'icrm:contact-details-drawer',
          name: 'ContactDetailsDrawer',
          description: 'Side drawer with the details of a contact: identity, channels and recent interactions.',
          useCases: ['Open a contact from a search result', 'Check the last interactions before calling back'],
          reusePotential: 'likely',
          team: 'icrm',
          application: 'icrm',
        },
      ],
      similarity: [
        { a: 'icrm:contact-details-drawer', b: 'ishare:document-more-details-drawer', kind: 'local-local', score: 8, matchedFields: ['name', 'description', 'useCases'] },
        { a: 'icrm:contact-details-drawer', b: 'plectrum:drawer', kind: 'local-core', score: 7, matchedFields: ['name', 'description'] },
        { a: 'ishare:document-more-details-drawer', b: 'plectrum:drawer', kind: 'local-core', score: 9, matchedFields: ['name', 'description', 'useCases'] },
        { a: 'iged:queue-card', b: 'plectrum:list', kind: 'local-core', score: 4, matchedFields: ['description'] },
      ],
    },
  },
};
