// Figures for Docs/Token pipeline/Figma sync (token-pipeline-figma.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
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
  tone: 'warning',
  title: 'Repository → Figma is parked — Figma → repository is live',
  text: 'tokens:apply and the tokens:pull-figma safety net use the Figma Variables REST API, which Figma offers on the Enterprise plan only. Solidaris is on the Organization plan: a personal access token cannot carry file_variables:read or file_variables:write, and the first dry run (2026-09-07) stopped at the first Variables call with 403 Invalid scope. Nothing was written. The plugin sync and the comment thread need no Variables scope, so the inbound transport is unaffected.',
});

export const OutboundOptions: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Option A',
      tone: 'design',
      title: 'Custom Figma plugin',
      lead: 'A small private plugin, published inside the Solidaris organization, that a designer runs with the branch proposals/{app} open. It reads proposed.dtcg.json and creates the variables through figma.variables. The Plugin API is not plan-gated.',
      items: [
        'Keeps the branch-only rule and the designer review. No licence change.',
        'Not unattended: a person opens the file and runs it. apply-to-figma.yml stays parked.',
        'Code to own: manifest and UI, DTCG → variable mapping (colours first), private publishing, keeping pace with the propose output.',
        'Does not restore tokens:pull-figma; the same plugin would have to export the branch instead.',
      ],
    },
    {
      eyebrow: 'Option B',
      tone: 'system',
      title: 'Enterprise plan',
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
  title: 'Until the decision',
  items: [
    'Code-owned tokens keep compiling into the stylesheet. Nothing changes for applications.',
    'tokens:propose remains the list of what the UI Kit lacks. A designer who needs one of those tokens in Figma creates it on the branch proposals/{app} by hand, with the name from proposed.dtcg.json (for example color/surface/75).',
    'Do not expect Apply tokens to Figma or Figma library publish to write anything: both stop at the first Variables call.',
    'Decision record: .ai/questions/2026-09-07-repo-to-figma-transport.md.',
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
    who: 'CI',
    tone: 'neutral',
    title: 'tokens:apply — parked',
    detail:
      'Writes the proposal into the collection proposals/{app} on the Figma branch of the same name through the Variables REST API. Dry run is the default; a real write is a manual workflow run behind the figma-write environment. Enterprise only — on the Organization plan the job stops with 403 Invalid scope. Until the plan decision a designer enters the proposed names on the branch by hand.',
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
    'Variables REST API calls are Enterprise only. On the Organization plan both apply and pull stop with 403 Invalid scope before any write.',
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
        'The REST Variables API is a safety net only, not the ingestion path. The plugin sync and the comment thread need no Variables scope.',
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
