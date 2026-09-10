// =============================================================================
// libs/ui/src/docs/docs-figure-stories.ts
// Story factories for the PrimeNG-based docs figures. Each MDX page keeps its
// content in a sibling *.stories.ts (tagged !dev, so hidden from the sidebar)
// and embeds it with <Story of={…} />; Angular components cannot receive
// props from MDX directly.
// =============================================================================

import type { StoryObj } from '@storybook/angular-vite';
import type {
  ComponentGovernance,
  ComponentMetadata,
} from '@solidaris/contracts';
import type {
  ChangelogChangeset,
  ChangelogRelease,
} from '../storybook/changelog.types';
import { DocsCalloutComponent } from '../storybook/docs-callout.component';
import { DocsCardsComponent } from '../storybook/docs-cards.component';
import { DocsChangesetsComponent } from '../storybook/docs-changesets.component';
import {
  type ContractsIndex,
  DocsComponentIndexComponent,
} from '../storybook/docs-component-index.component';
import { DocsContractComponent } from '../storybook/docs-contract.component';
import { DocsDoDontComponent } from '../storybook/docs-do-dont.component';
import type {
  DocsCalloutTone,
  DocsCard,
  DocsContractSection,
  DocsDoDontItem,
  DocsStep,
} from '../storybook/docs-figures.types';
import {
  type DocsHeroAction,
  DocsHeroComponent,
} from '../storybook/docs-hero.component';
import { DocsReleasesComponent } from '../storybook/docs-releases.component';
import { DocsStatusComponent } from '../storybook/docs-status.component';
import { DocsStepsComponent } from '../storybook/docs-steps.component';
import { DocsSyncChangesComponent } from '../storybook/docs-sync-changes.component';
import { DocsSyncChecksComponent } from '../storybook/docs-sync-checks.component';
import type { SyncReport } from '../storybook/sync-report.types';

export interface HeroContent {
  title: string;
  lead?: string;
  actions?: readonly DocsHeroAction[];
}

const DOCS_FIGURE_PARAMETERS = {
  chromatic: { disableSnapshot: true },
  // Catalogue metas may set layout: 'fullscreen' (shells, token catalogues).
  // Figures are prose, not chrome demos — padded keeps them content-sized.
  layout: 'padded' as const,
};

/**
 * `tags: ['!dev']` on a factory return is runtime-only. The CSF indexer is
 * acorn — it never evaluates the call — so the story stays in the sidebar
 * unless the export writes the tag as a literal:
 *
 *   export const Usage = { tags: ['!dev'], ...contractStory(meta, 'usage') };
 */

export function heroStory({
  title,
  lead,
  actions = [],
}: HeroContent): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsHeroComponent] },
      props: { title, lead, actions },
      template: `<pds-docs-hero [title]="title" [lead]="lead" [actions]="actions" />`,
    }),
  };
}

export function stepsStory(steps: readonly DocsStep[]): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsStepsComponent] },
      props: { steps },
      template: `<pds-docs-steps [steps]="steps" />`,
    }),
  };
}

export function cardsStory(
  cards: readonly DocsCard[],
  columns: 2 | 3 = 3,
): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsCardsComponent] },
      props: { cards, columns },
      template: `<pds-docs-cards [cards]="cards" [columns]="columns" />`,
    }),
  };
}

export interface CalloutContent {
  tone?: DocsCalloutTone;
  title: string;
  text?: string;
  items?: readonly string[];
}

export function calloutStory({
  tone = 'info',
  title,
  text,
  items,
}: CalloutContent): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsCalloutComponent] },
      props: { tone, title, text, items },
      template: `<pds-docs-callout [tone]="tone" [title]="title" [text]="text" [items]="items" />`,
    }),
  };
}

/** The `component` block fields the page header shows next to the badge. */
export type StatusHeader = Partial<
  Pick<ComponentMetadata['component'], 'description' | 'figmaUrl'>
>;

/**
 * Ownership badge + lead for a component docs page. Pass
 * `XMetadata.governance` and `XMetadata.component` so the description and the
 * Figma link come from the metadata rather than the MDX.
 * Hide from the sidebar with a literal `tags: ['!dev']` on the export
 * (the indexer does not see tags on this factory return):
 *
 *   export const Status = { tags: ['!dev'], ...statusStory(meta.governance, meta.component) };
 */
export function statusStory(
  { status, owner, note }: ComponentGovernance,
  header?: StatusHeader,
): StoryObj {
  const { description, figmaUrl } = header ?? {};
  return {
    tags: ['!dev'],
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsStatusComponent] },
      props: { status, owner, note, description, figmaUrl },
      template: `<pds-docs-status [status]="status" [owner]="owner" [note]="note" [description]="description" [figmaUrl]="figmaUrl" />`,
    }),
  };
}

/**
 * One block of a component's .metadata.ts, rendered by pds-docs-contract.
 * The MDX page embeds one per section:
 *
 *   export const Usage = { tags: ['!dev'], ...contractStory(XMetadata, 'usage') };
 *   <Unstyled><Story of={Stories.Usage} /></Unstyled>
 */
export function contractStory(
  metadata: ComponentMetadata,
  section: DocsContractSection,
): StoryObj {
  return {
    tags: ['!dev'],
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsContractComponent] },
      props: { metadata, section },
      template: `<pds-docs-contract [metadata]="metadata" [section]="section" />`,
    }),
  };
}

export interface DoDontContent {
  dos?: readonly DocsDoDontItem[];
  donts?: readonly DocsDoDontItem[];
  doLabel?: string;
  dontLabel?: string;
}

/**
 * Do / Don't cards with hand-authored entries — for pages that have no
 * .metadata.ts (foundations, process). Component pages use contractStory().
 */
export function doDontStory({
  dos = [],
  donts = [],
  doLabel = 'Do',
  dontLabel = "Don't",
}: DoDontContent): StoryObj {
  return {
    tags: ['!dev'],
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsDoDontComponent] },
      props: { dos, donts, doLabel, dontLabel },
      template: `<pds-docs-do-dont [dos]="dos" [donts]="donts" [doLabel]="doLabel" [dontLabel]="dontLabel" />`,
    }),
  };
}

/** Outcome + check list of a token sync record (Docs/Token pipeline/Sync status). */
export function syncChecksStory(report: SyncReport): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsSyncChecksComponent] },
      props: { report },
      template: `<pds-docs-sync-checks [report]="report" />`,
    }),
  };
}

/** Searchable change list of a token sync record (Docs/Token pipeline/Sync status). */
export function syncChangesStory(report: SyncReport): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsSyncChangesComponent] },
      props: { report },
      template: `<pds-docs-sync-changes [report]="report" />`,
    }),
  };
}

/** Pending changesets as cards, with what the next version PR bumps (Docs/What's new). */
export function changesetsStory(
  changesets: readonly ChangelogChangeset[],
): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsChangesetsComponent] },
      props: { changesets },
      template: `<pds-docs-changesets [changesets]="changesets" />`,
    }),
  };
}

/** Published versions as a timeline, newest first (Docs/What's new). */
export function releasesStory(releases: readonly ChangelogRelease[]): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsReleasesComponent] },
      props: { releases },
      template: `<pds-docs-releases [releases]="releases" />`,
    }),
  };
}

/** Searchable, filterable component table from .ai/contracts/index.json (Docs/Component status). */
export function componentIndexStory(index: ContractsIndex): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsComponentIndexComponent] },
      props: { index },
      template: `<pds-docs-component-index [index]="index" />`,
    }),
  };
}
