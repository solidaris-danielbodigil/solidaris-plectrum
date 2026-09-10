// Figures for Docs/What's new (whats-new.mdx). Hidden from the sidebar.
// `Unreleased` / `Released` render the committed record (changelog.generated.ts);
// the `Sample*` stories render fixtures so the populated and the empty state of
// each figure stay covered whatever the record holds.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import {
  CHANGELOG_RELEASES,
  CHANGELOG_UNRELEASED,
} from '../storybook/changelog.generated';
import type {
  ChangelogChangeset,
  ChangelogRelease,
} from '../storybook/changelog.types';
import { assertTextVisible, expect, within } from '../storybook/story-tests';
import { changesetsStory, releasesStory } from './docs-figure-stories';

const meta: Meta = {
  title: "Docs/What's new/Figures",
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

const PACKAGES = ['@solidaris/ui', '@solidaris/plectrum', '@solidaris/styles'];

const SAMPLE_CHANGESETS: ChangelogChangeset[] = [
  {
    id: 'form-field-hint',
    bumps: PACKAGES.map((packageName) => ({ packageName, bump: 'minor' as const })),
    summary:
      'Add an optional hint on form-field and require Storybook play tests on every component.',
  },
  {
    id: 'profile-card-rename',
    bumps: PACKAGES.map((packageName) => ({ packageName, bump: 'major' as const })),
    summary:
      'Rename pds-affiliate-overview-card to pds-profile-card. ProfileDrawerData uses generalRows / contactRows / relatedMembers.',
  },
  {
    id: 'tokens-cli-only',
    bumps: [{ packageName: '@solidaris/tokens-cli', bump: 'patch' }],
    summary: 'pds-tokens-lint reports the offending file next to each finding.',
  },
];

const SHARED_CHANGE = {
  bump: 'major',
  text: '3f2a9c1: Rename the three Core catalogue APIs to domain-neutral names.',
} as const;

const SAMPLE_RELEASES: ChangelogRelease[] = [
  {
    packageName: '@solidaris/ui',
    version: '1.0.0',
    changes: [
      SHARED_CHANGE,
      { bump: 'minor', text: '8b1d2e4: Add an optional hint on form-field.' },
      {
        bump: 'patch',
        text: '9c0e1f2: Publish the three packages as versioned packages.',
      },
    ],
    notes: '',
  },
  {
    packageName: '@solidaris/plectrum',
    version: '1.0.0',
    changes: [SHARED_CHANGE],
    notes: '',
  },
  {
    packageName: '@solidaris/styles',
    version: '1.0.0',
    changes: [SHARED_CHANGE],
    notes: '',
  },
  {
    packageName: '@solidaris/ui',
    version: '0.9.0',
    changes: [{ bump: 'minor', text: 'a1b2c3d: First public catalogue.' }],
    notes: 'Pre-release — installed from the repository, not the registry.',
  },
];

export const Unreleased: StoryObj = changesetsStory(CHANGELOG_UNRELEASED);

export const Released: StoryObj = releasesStory(CHANGELOG_RELEASES);

export const SampleUnreleased: StoryObj = {
  ...changesetsStory(SAMPLE_CHANGESETS),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await assertTextVisible(canvasElement, 'Next release');
    // Highest pending bump per package: the three fixed-group packages are major,
    // tokens-cli only has a patch — so the header lists packages one by one.
    await expect(canvas.getByText('@solidaris/ui major')).toBeVisible();
    await expect(canvas.getByText('@solidaris/tokens-cli patch')).toBeVisible();
    await expect(canvas.getByText('3 changesets')).toBeVisible();
    // Cards sort by bump: the major changeset comes first.
    const files = canvas.getAllByText(/^\.changeset\//);
    await expect(files[0]).toHaveTextContent('.changeset/profile-card-rename.md');
  },
};

export const SampleNoChangesets: StoryObj = {
  ...changesetsStory([]),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'No pending changesets');
  },
};

export const SampleReleased: StoryObj = {
  ...releasesStory(SAMPLE_RELEASES),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const versions = canvas.getAllByText(/^v\d/);
    // Newest first, one event per version.
    await expect(versions.map((tag) => tag.textContent?.trim())).toEqual([
      'v1.0.0',
      'v0.9.0',
    ]);
    // The change shared by the three packages collapses to one line.
    await expect(canvas.getAllByText(SHARED_CHANGE.text)).toHaveLength(1);
    await expect(canvas.getByText('@solidaris/styles')).toBeVisible();
    await assertTextVisible(canvasElement, /Pre-release/);
  },
};

export const SampleNoReleases: StoryObj = {
  ...releasesStory([]),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'No release yet');
  },
};
