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
  { who: 'Designer', tone: 'design', title: 'Edit the variable in the Plectrum UI Kit', detail: 'Primitive and Semantic collections are the source of truth. Component collections reference them.' },
  { who: 'Designer', tone: 'design', title: 'Run the plugin sync', detail: 'The PrimeUI theme generator plugin commits to design-tokens/sync. It has no access to main.' },
  { who: 'CI', tone: 'neutral', title: 'Audit and promotion pull request', detail: 'tokens-sync.yml compares Figma, the PrimeNG preset and the SCSS, runs tokens:build, and opens a pull request that promotes the staging files to libs/plectrum/src/tokens.json.' },
  { who: 'Developer', tone: 'system', title: 'Review and merge', detail: 'Theme files are copied into Plectrum_v1/ only when tokens:validate-preset passes. Manual fixes live in extend.ts, never in generated files.' },
  { who: 'CI', tone: 'neutral', title: 'Publish', detail: 'The change ships in the next package release. Foundations pages update without a documentation edit.' },
]);

export const BranchWarning: StoryObj = calloutStory({
  tone: 'warning',
  title: 'The Branch field must remain design-tokens/sync',
  text: 'Pointing the plugin at main pushes unreviewed generated code to production. A full sync overwrites the theme directory; the staging branch makes that safe. Review the promotion pull request, keep durable overrides in extend.ts, and fix values upstream in Figma where possible.',
});

export const OutboundProcess: StoryObj = stepsStory([
  { who: 'Developer', tone: 'system', title: 'Declare the token in 01-settings', detail: 'Example: --pds-color-surface-75, --pds-color-emutnav-*. The token is usable in applications immediately.' },
  { who: 'CI', tone: 'neutral', title: 'tokens:propose', detail: 'Compares code-declared --pds-* with tokens.json and writes proposed.dtcg.json. Dotted paths map to Figma groups.' },
  { who: 'CI', tone: 'neutral', title: 'tokens:apply', detail: 'Writes the proposal to the Figma branch proposals/{app}. Dry run is the default; a real write is a manual workflow run behind the figma-write environment.' },
  { who: 'Designer', tone: 'design', title: 'Review the Figma branch', detail: 'Rename, regroup or reject. The main file is unchanged at this point.' },
  { who: 'Designer', tone: 'design', title: 'Merge to main and publish the library', detail: 'Publishing is only possible from main. Other files see the variables after publish.' },
  { who: 'CI', tone: 'neutral', title: 'Re-pull', detail: 'The LIBRARY_PUBLISH repository_dispatch event runs tokens:pull-figma, so the repository reflects the merged state.' },
]);

export const Guardrails: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Enforced by the CLI and the workflow',
  items: [
    'Missing proposals/{app} branch: the CLI aborts. There is no fallback to the main file key.',
    'Creating the Figma branch is a manual Full-seat action, once per application. Figma has no API for it.',
    'A real write requires workflow_dispatch plus the figma-write GitHub Environment. First apply only on a throwaway branch.',
    'POST /variables is atomic: one invalid variable rejects the whole batch. Nothing is partially written.',
  ],
});

export const ComponentPromotion: StoryObj = stepsStory([
  { who: 'Developer', tone: 'app', title: 'Develop in the application while the API is unstable' },
  { who: 'Developer', tone: 'system', title: 'Open a pull request in this repository with the generic component', detail: 'libs/ui + libs/styles + a story. No application-specific logic.' },
  { who: 'CI', tone: 'neutral', title: 'Publish @solidaris/ui through changesets' },
  { who: 'Developer', tone: 'app', title: 'Bump the package, delete the local copy, import from @solidaris/ui' },
]);

export const Reference: StoryObj = cardsStory(
  [
    {
      title: 'Inbound safety net',
      items: [
        'npm run tokens:pull-figma calls GET /v1/files/{key}/variables/local and flags variables changed in Figma but never plugin-pushed. Requires FIGMA_TOKEN.',
        'LIBRARY_PUBLISH (repository_dispatch) re-runs the pull after a designer merge and library publish.',
        'The REST Variables API is a safety net only, not the ingestion path.',
      ],
    },
    {
      title: 'Outbound CLI behaviour',
      items: [
        'propose-to-figma diffs code-declared --pds-* against tokens.json and maps dotted paths to Figma groups (names cannot contain . { }).',
        'apply-to-figma resolves proposals/{app} via GET /v1/files/:key?branch_data=true and POSTs to that branch key.',
        'POST /variables is Tier 3 rate-limited with a ~4 MB body limit. Constraints are listed in the CLI --help.',
      ],
    },
  ],
  2,
);
