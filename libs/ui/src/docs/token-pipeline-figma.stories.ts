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
    title: 'Edit the variable in the Plectrum UI Kit',
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
      'The same report is posted as a comment thread in the Plectrum UI Kit — promoted or blocked — so the designer who pushed sees the outcome without GitHub. A comment is an annotation; no design data is written.',
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
    'Repository → Figma is the Plectrum tokens plugin — REST apply stays parked',
  text: 'On the Organization plan a designer runs the private Plectrum tokens plugin with the branch proposals/{app} open. It fetches proposed.dtcg.json from GitHub and writes the collection of the same name through figma.variables. tokens:apply and tokens:pull-figma still need the Enterprise-only Variables REST API (file_variables:read/write); they remain the unattended alternative. The inbound PrimeUI plugin sync is unchanged.',
});

export const OutboundOptions: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Chosen',
      tone: 'design',
      title: 'Plectrum tokens plugin',
      lead: 'Private plugin in tools/figma-plugin. A designer opens proposals/{app}, fetches the committed proposal from GitHub, selects tokens, plans, then applies. The Plugin API is not plan-gated.',
      items: [
        'Branch-only: refuses the main UI Kit file key. Collection proposals/{app} is hidden from publishing.',
        'Attended: a person runs it. apply-to-figma.yml stays parked.',
        'Typed proposal: color, dimension (px), number, fontWeight, fontFamily. Everything else is listed as skip.',
        'Does not restore tokens:pull-figma; export is a follow-up.',
      ],
    },
    {
      eyebrow: 'Parked',
      tone: 'system',
      title: 'Enterprise REST path',
      lead: 'Unlocks file_variables:read and file_variables:write on personal access tokens. Apply tokens to Figma and Figma library publish run as built.',
      items: [
        'Unattended CI with two review gates: the figma-write GitHub environment and the Figma branch review.',
        'Needs a new FIGMA_TOKEN with the Variables scopes — scopes cannot be added to the existing token — and the Figma branch proposals/{app} created once in the UI.',
        'A licensing decision outside the design-system team.',
      ],
    },
  ],
  2,
);

export const OutboundInterim: StoryObj = calloutStory({
  tone: 'info',
  title: 'How to apply a code-owned token',
  items: [
    'npm run tokens:propose writes tools/tokens/proposed.dtcg.json (committed; CI fails if it is stale).',
    'Open the Figma branch proposals/{app}. Run Plectrum tokens, fetch, select, plan, apply. Setup: tools/figma-plugin/README.md and tools/tokens/PLUGIN_SETUP.md.',
    'Do not expect Apply tokens to Figma or Figma library publish to write anything: both stop at the first Variables REST call.',
    'Decision: .ai/decisions/2026-09-10-repo-to-figma-plugin.md.',
  ],
});

export const OutboundProcess: StoryObj = stepsStory([
  {
    who: 'Developer',
    tone: 'system',
    title: 'Declare the token in 01-settings',
    detail:
      'Example: --pds-color-surface-75, --pds-color-emutnav-*. The token is usable in applications immediately.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'tokens:propose',
    detail:
      'Compares code-declared --pds-* with tokens.json and writes proposed.dtcg.json. Dotted paths map to Figma groups.',
  },
  {
    who: 'Designer',
    tone: 'design',
    title: 'Plectrum tokens plugin',
    detail:
      'With the Figma branch proposals/{app} open, fetch proposed.dtcg.json from GitHub, select tokens (nothing is selected by default), plan, then apply. Writes go to the collection proposals/{app} only. The plugin refuses the main UI Kit file key. tokens:apply remains the Enterprise REST alternative.',
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
      'Publishing is only possible from main. Other files see the variables after publish.',
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
  title: 'Enforced by the CLI and the workflow',
  items: [
    'Missing proposals/{app} branch: the CLI aborts. There is no fallback to the main file key. A resolved key equal to the main file is refused.',
    'Creating the Figma branch is a manual Full-seat action, once per application. Figma has no API for it.',
    '--only is required; --all is an explicit opt-in. The first real write never dumps every code-owned token.',
    'A real write requires workflow_dispatch plus the figma-write GitHub Environment. First apply only on a throwaway branch.',
    'POST /variables is atomic: one invalid variable rejects the whole batch. Nothing is partially written.',
    'The Plectrum tokens plugin refuses a missing file key and the main UI Kit key. Variables REST API calls stay Enterprise only; on the Organization plan apply and pull still stop with 403 Invalid scope.',
  ],
});

export const ComponentPromotion: StoryObj = stepsStory([
  {
    who: 'Developer',
    tone: 'app',
    title: 'Develop in the application while the API is unstable',
  },
  {
    who: 'Developer',
    tone: 'system',
    title: 'Open a pull request in this repository with the generic component',
    detail: 'libs/ui + libs/styles + a story. No application-specific logic.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Publish @solidaris/ui through changesets',
  },
  {
    who: 'Developer',
    tone: 'app',
    title: 'Bump the package, delete the local copy, import from @solidaris/ui',
  },
]);

export const Reference: StoryObj = cardsStory(
  [
    {
      title: 'Inbound safety net — parked',
      items: [
        'npm run tokens:pull-figma calls GET /v1/files/{key}/variables/local and flags variables changed in Figma but never plugin-pushed. Requires FIGMA_TOKEN with file_variables:read — Enterprise only.',
        'LIBRARY_PUBLISH (repository_dispatch) re-runs the pull after a designer merge and library publish. Same gate.',
        'The REST Variables API is a safety net only, not the ingestion path. The PrimeUI plugin sync, the comment thread, and the Plectrum tokens plugin need no Variables REST scope.',
      ],
    },
    {
      title: 'Outbound CLI behaviour',
      items: [
        'propose-to-figma diffs code-declared --pds-* against tokens.json and maps dotted paths to Figma groups (names cannot contain . { }).',
        'apply-to-figma lists branches on the main UI Kit (GET /v1/files/:key?branch_data=true), reads the branch variables, then POSTs CREATE / UPDATE into the collection proposals/{app} on that branch key. --branch-key skips the listing when it returns no branches.',
        'POST /variables is Tier 3 rate-limited with a ~4 MB body limit and atomic. Enterprise only: on the Organization plan the first GET returns 403 Invalid scope and the CLI stops.',
      ],
    },
  ],
  2,
);
