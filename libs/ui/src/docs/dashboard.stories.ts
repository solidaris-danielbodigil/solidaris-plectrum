// Figures for Maintainers/Dashboard (dashboard.mdx). Hidden from the sidebar.
// Reader guidance only — the section and rule catalogues live in
// ../storybook/dashboard-docs.ts, typed against libs/insights.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DASHBOARD_URL } from '../storybook/process-docs';
import { DASHBOARD_SECTIONS, sectionUrl } from '../storybook/dashboard-docs';
import type { SectionId } from '@pds-internal/insights';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Dashboard/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Sections: StoryObj = cardsStory(
  Object.entries(DASHBOARD_SECTIONS).map(([id, section]) => ({
    title: section.label,
    lead: section.question,
    items: [`On screen — ${section.shows}`, `What to do — ${section.act}`],
    links: [{ label: `Open ${section.label}`, href: sectionUrl(id as SectionId) }],
  })),
  2,
);

export const Flow: StoryObj = stepsStory([
  {
    who: 'Repository',
    tone: 'system',
    title: 'The facts are already committed',
    detail:
      'The contracts index, the toolkit catalogue, the agent search evaluation, candidate records, the token sync report and proposals, release tags and pending changesets — each with its git history.',
  },
  {
    who: 'Applications',
    tone: 'app',
    title: 'Each team sends a usage report',
    detail:
      'An adoption report per application in .ai/adoption/, written by the team pipeline: components found, local components, agent counts and the Plectrum version in use. No request text, no code, nothing that identifies a person.',
  },
  {
    who: 'Generator',
    tone: 'neutral',
    title: 'insights:generate collects them into one module',
    detail:
      'Facts only, never recommendations. The output is gitignored because it is a pure function of the checkout, so it would churn every pull request. A shallow clone yields empty trends.',
    commands: ['npm run insights:generate'],
  },
  {
    who: 'Dashboard',
    tone: 'system',
    title: 'The rules run in the browser',
    detail:
      'recommend() from libs/insights is evaluated with the current date, so ages and staleness are live rather than frozen at build time. The same facts give different recommendations tomorrow.',
  },
]);

export const Routine: StoryObj = stepsStory([
  {
    who: 'Step 1',
    tone: 'neutral',
    title: 'Check the source selector',
    detail:
      'Reported or Demo. Demo is selected while no application has reported, and everything on the screen then describes a scenario, not your teams.',
    links: [{ label: 'Open the dashboard', href: DASHBOARD_URL }],
  },
  {
    who: 'Step 2',
    tone: 'neutral',
    title: 'Read Overview, not the tabs',
    detail:
      'The tiles and the five top recommendations tell you which tab is worth opening. If nothing moved since last time, you are done.',
    links: [{ label: 'Overview', href: sectionUrl('overview') }],
  },
  {
    who: 'Step 3',
    tone: 'neutral',
    title: 'Clear what blocks other people first',
    detail:
      'A blocked token sync and a submission waiting for review stop work outside Core. They outrank anything that only costs Core time.',
    links: [
      { label: 'Pipeline', href: sectionUrl('pipeline') },
      { label: 'Tokens & releases', href: sectionUrl('tokens-releases') },
    ],
  },
  {
    who: 'Step 4',
    tone: 'neutral',
    title: 'Open the drawer before acting',
    detail:
      'Every recommendation carries the values it was computed from and the file each one came from. Check the evidence against the repository; a fact can be stale without being wrong.',
    links: [{ label: 'Recommendations', href: sectionUrl('recommendations') }],
  },
  {
    who: 'Step 5',
    tone: 'neutral',
    title: 'Turn the decision into a record',
    detail:
      'The dashboard reads records, not conversations. A review that is not recorded keeps firing, and a candidate stage that is not written down never moves.',
    commands: ['npm run candidate:check'],
  },
]);

export const Card: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Evidence',
      tone: 'system',
      title: 'The values behind the claim',
      lead: 'Each row is a label, a value and the file it was read from.',
      items: [
        'Check the source file when a number looks wrong — it is the fact, the card is only the reading',
        'A repository fact is the same under Reported and Demo; a usage fact is not',
      ],
    },
    {
      eyebrow: 'Next',
      tone: 'neutral',
      title: 'The first move, as a command or a link',
      lead: 'Rules that have a mechanical next step carry it on the card.',
      items: [
        'Candidate rules give the exact candidate:record invocation for the missing step',
        'The token sync rule links to the workflow run that failed',
      ],
    },
    {
      eyebrow: 'Provenance',
      tone: 'app',
      title: 'Reported, demo, or repository',
      lead: 'Says what kind of evidence you are acting on.',
      items: [
        'repository — committed facts, trustworthy regardless of the selector',
        'demo — a scenario; never act on it as if a team had reported it',
      ],
    },
  ],
  3,
);

export const Demo: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Demo data is a scenario, not your teams',
  text: 'The dashboard defaults to Demo until an application sends a report, and keeps a banner on screen while it is selected. Demo reports are never written to .ai/adoption/, never reach the shipped toolkit assets, and are never merged with reported data.',
  items: [
    'Agent counts and local components come from a seed file; the component observations are a real scan of the local demo applications',
    'Repository facts — catalogue, search quality, pipeline, tokens, releases — are real under both sources',
    'Under Reported, an absent report means coverage is unknown, not zero: rules that would retire a component stay silent until every external application has reported',
  ],
});

export const Maintenance: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Add a rule',
      tone: 'system',
      title: 'One file, one threshold, two fixtures',
      items: [
        'libs/insights/src/rules/<rule-id>.ts returns Recommendations with a stable <rule>:<subject> id, evidence and a drill target',
        'Register it in recommend.ts and put any number in thresholds.ts',
        'Add a positive and a negative fixture, then document it in dashboard-docs.ts — the typed record will not compile without it',
      ],
      code: 'npm run test:pipelines',
    },
    {
      eyebrow: 'Recover',
      tone: 'neutral',
      title: 'When the generator fails',
      items: [
        'An invalid adoption report or candidate record stops the generation — run the record checks and fix the file',
        'Empty trends and historyAvailable: false mean a shallow clone, not missing data',
        'The generated module is gitignored: delete it and regenerate rather than editing it',
      ],
      code: 'npm run adoption:check\nnpm run candidate:check',
    },
    {
      eyebrow: 'Keep it honest',
      tone: 'app',
      title: 'What must never enter the data',
      items: [
        'No request text, no code, nothing that identifies a person — empty searches stay counts per application',
        'The generator writes facts; recommendations are computed in the browser and are never committed',
        'Dashboard-only styles stay in apps/dashboard/src/styles and out of the shared token inventory',
      ],
    },
  ],
  3,
);
