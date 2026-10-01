// Figures for Docs/Token pipeline/Figma sync (token-pipeline-figma.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Token pipeline/Figures/Figma sync',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const InboundProcess: StoryObj = stepsStory([
  {
    who: 'Designer',
    tone: 'design',
    title: 'Edit the variable in PrimeNG 21',
    detail:
      'Primitive and Semantic collections are the source of truth. Component collections reference them.',
  },
  {
    who: 'Designer',
    tone: 'design',
    title: 'Run the plugin sync',
    detail:
      'The PrimeUI theme generator plugin commits to design-tokens/sync. It has no access to main.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Audit, report and promotion pull request',
    detail:
      'tokens-sync.yml runs tokens:build, compares Figma, the PrimeNG preset and the SCSS, and writes a plain-language report: which values changed, which checks passed, what happens next. The report is the body of the pull request that promotes staging to libs/plectrum/src/tokens.json.',
  },
  {
    who: 'CI',
    tone: 'design',
    title: 'Comment in the Figma file',
    detail:
      'The same report is posted as a comment thread in PrimeNG 21 — promoted or blocked — so the designer who pushed sees the outcome without GitHub. A comment is an annotation; no design data is written.',
  },
  {
    who: 'Developer',
    tone: 'system',
    title: 'Review and merge',
    detail:
      'Theme files are copied into Plectrum_v1/ only when tokens:validate-preset passes. Manual fixes live in extend.ts, never in generated files.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Publish',
    detail:
      'The change ships in the next package release. Foundations pages update without a documentation edit.',
  },
]);

export const BranchWarning: StoryObj = calloutStory({
  tone: 'warning',
  title: 'The Branch field must remain design-tokens/sync',
  text: 'Pointing the plugin at main pushes unreviewed generated code to production. A full sync overwrites the theme directory; the staging branch makes that safe. Review the promotion pull request, keep durable overrides in extend.ts, and fix values upstream in Figma where possible.',
});

export const OutboundStatus: StoryObj = calloutStory({
  tone: 'info',
  title:
    'Repository → Figma is the Plugin API — agent first, plugin as fallback, REST parked',
  text: 'On the Organization plan token writes go through figma.variables on a PrimeNG 21 proposal branch. Default: an agent with Figma MCP. Fallback: the Plectrum tokens plugin. Both fetch proposed.dtcg.json. Component candidates live on a separate Custom components branch and may start with the design team before code exists. tokens:apply and tokens:pull-figma still need the Enterprise-only Variables REST API; they remain the unattended token alternative.',
});

export const OutboundOptions: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Default',
      tone: 'system',
      title: 'Agent + Figma MCP',
      lead: 'Same Plugin API as the plugin. The agent upserts selected tokens on a PrimeNG 21 branch and may build the component on a separate Custom components branch.',
      items: [
        'Branch-only: refuse both main Figma file keys. Token collection proposals/{app} is hidden from publishing.',
        'Variables first, then frames bound to those variables — not hex from a screenshot.',
        'A designer may draw the component by hand instead. Merge and publish stay human.',
        'Attended: there is no unattended CI write on the Organization plan.',
      ],
    },
    {
      eyebrow: 'Fallback',
      tone: 'design',
      title: 'Plectrum tokens plugin',
      lead: 'Private plugin in tools/figma-plugin. Use it when no agent is available. A designer opens proposals/{app}, fetches the committed proposal, selects tokens, plans, then applies.',
      items: [
        'Tokens only. The plugin does not create Figma components.',
        'Explicit selection: nothing is selected after fetch.',
        'Typed proposal: color, dimension (px), number, fontWeight, fontFamily. Everything else is listed as skip.',
        'Does not restore tokens:pull-figma; export is a follow-up.',
      ],
    },
    {
      eyebrow: 'Parked',
      tone: 'neutral',
      title: 'Enterprise REST path',
      lead: 'Unlocks file_variables:read and file_variables:write on personal access tokens. Apply tokens to Figma and Figma library publish run as built.',
      items: [
        'Unattended CI with two review gates: the figma-write GitHub environment and the Figma branch review.',
        'Needs a new FIGMA_TOKEN with the Variables scopes — scopes cannot be added to the existing token — and the Figma branch proposals/{app} created once in the UI.',
        'A licensing decision outside the design-system team.',
      ],
    },
  ],
  3,
);

export const OutboundInterim: StoryObj = calloutStory({
  tone: 'info',
  title: 'How to apply a code-owned token',
  items: [
    'npm run tokens:propose writes tools/tokens/proposed.dtcg.json (committed; CI fails if it is stale).',
    'Open the PrimeNG 21 token branch proposals/{app}. Agent + Figma MCP when a session is running; otherwise Plectrum tokens — fetch, select, plan, apply. Setup: tools/figma-plugin/README.md and tools/tokens/PLUGIN_SETUP.md.',
    'Design the component on a separate Custom components branch (agent or designer). A reviewed design can also precede Core code. Bind published variables; do not paint from a screenshot.',
    'Do not expect Apply tokens to Figma or Figma library publish to write anything: both stop at the first Variables REST call.',
    'Decisions: .ai/decisions/2026-09-10-repo-to-figma-plugin.md, .ai/decisions/2026-09-12-repo-to-figma-agent-and-plugin.md.',
  ],
});

export const OutboundProcess: StoryObj = stepsStory([
  {
    who: 'Core developer',
    tone: 'system',
    title: 'Declare the token in 01-settings',
    detail:
      'Example: --pds-color-surface-75. Applications can use it from the next release.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'tokens:propose',
    detail:
      'Compares code-declared --pds-* with tokens.json and writes proposed.dtcg.json. Dotted paths map to Figma groups.',
  },
  {
    who: 'Agent or designer',
    tone: 'design',
    title: 'Write selected tokens on the branch',
    detail:
      'With the PrimeNG 21 branch proposals/{app} open, apply selected names from proposed.dtcg.json through the Plugin API. Default: agent + Figma MCP. Fallback: Plectrum tokens plugin (nothing is selected after fetch). Writes go to the collection proposals/{app} only. Refuse both main file keys. tokens:apply remains the Enterprise REST alternative.',
  },
  {
    who: 'Agent or designer',
    tone: 'design',
    title: 'Figma component in Custom components',
    detail:
      'Use a separate Custom components branch. An agent or designer can build from reviewed Core code; a designer can also propose the component first. Bind published PrimeNG 21 variables. The token branch is never the component destination.',
  },
  {
    who: 'Designer',
    tone: 'design',
    title: 'Review the Figma branch',
    detail:
      'Rename, regroup or reject. The main file is unchanged at this point.',
  },
  {
    who: 'Designer',
    tone: 'design',
    title: 'Merge to main and publish the library',
    detail:
      'Publish the PrimeNG 21 variable library and the Custom components library through their own reviewed merges when each changed.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Re-pull — parked',
    detail:
      'The LIBRARY_PUBLISH repository_dispatch event runs tokens:pull-figma, so the repository reflects the merged state. Same Enterprise gate as tokens:apply (file_variables:read).',
  },
]);

export const Guardrails: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Enforced on every write',
  items: [
    'Missing proposals/{app} branch: the CLI aborts. There is no fallback to the main file key. A resolved key equal to the main file is refused.',
    'Creating the Figma branch is a manual Full-seat action, once per application. Figma has no API for it.',
    '--only is required; --all is an explicit opt-in. The first real write never dumps every code-owned token.',
    'A real write requires workflow_dispatch plus the figma-write GitHub Environment. First apply only on a throwaway branch.',
    'POST /variables is atomic: one invalid variable rejects the whole batch. Nothing is partially written.',
    'The plugin and any Figma MCP write refuse a missing file key and either configured main file key. Variables REST API calls stay Enterprise only; on the Organization plan apply and pull still stop with 403 Invalid scope.',
  ],
});

export const ComponentPromotion: StoryObj = stepsStory([
  {
    who: 'Application team',
    tone: 'app',
    title: 'Build and use the component locally',
    detail: 'No Core approval is needed. The team owns the component in its application.',
  },
  {
    who: 'Application team',
    tone: 'app',
    title: 'Submit it to Core',
    detail: 'With an approved-candidate decision, the team submits the candidate with its preview and CI result.',
  },
  {
    who: 'Core team',
    tone: 'system',
    title: 'Integrate it',
    detail: 'Core generalizes the component in libs/ui and libs/styles, with its story and metadata.',
  },
  {
    who: 'Agent or designer',
    tone: 'design',
    title: 'Design the Figma component',
    detail: 'On a separate Custom components branch, bound to published variables. A designer merges and publishes.',
  },
  {
    who: 'Release maintainer',
    tone: 'neutral',
    title: 'Release',
  },
  {
    who: 'Application team',
    tone: 'app',
    title: 'Upgrade and delete the local copy',
    detail: 'Import the released component from the UI package instead.',
  },
]);

export const Reference: StoryObj = cardsStory(
  [
    {
      title: 'Inbound safety net — parked',
      items: [
        'npm run tokens:pull-figma calls GET /v1/files/{key}/variables/local and flags variables changed in Figma but never plugin-pushed. Requires FIGMA_TOKEN with file_variables:read — Enterprise only.',
        'LIBRARY_PUBLISH (repository_dispatch) re-runs the pull after a designer merge and library publish. Same gate.',
        'The REST Variables API is a safety net only, not the ingestion path. The PrimeUI plugin sync, the comment thread, Figma MCP writes, and the Plectrum tokens plugin need no Variables REST scope.',
      ],
    },
    {
      title: 'Outbound CLI behaviour',
      items: [
        'propose-to-figma diffs code-declared --pds-* against tokens.json and maps dotted paths to Figma groups (names cannot contain . { }).',
        'apply-to-figma lists branches on the PrimeNG 21 token file (GET /v1/files/:key?branch_data=true), reads branch variables, then POSTs CREATE / UPDATE into collection proposals/{app}. --branch-key skips the listing when it returns no branches.',
        'POST /variables is Tier 3 rate-limited with a ~4 MB body limit and atomic. Enterprise only: on the Organization plan the first GET returns 403 Invalid scope and the CLI stops.',
      ],
    },
  ],
  2,
);
