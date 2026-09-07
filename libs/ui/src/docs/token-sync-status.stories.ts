// Figures for Docs/Token pipeline/Sync status (token-sync-status.mdx). Hidden from the sidebar.
// `Checks` / `Changes` render the committed record (sync-report.generated.ts);
// the `Sample*` stories render a fixture so the populated states stay covered
// while the record is empty.
import type { Meta, StoryObj } from '@storybook/angular';
import { SYNC_REPORT } from '../storybook/sync-report.generated';
import type { SyncReport } from '../storybook/sync-report.types';
import { syncChangesStory, syncChecksStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Token pipeline/Figures/Sync status',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

const SAMPLE: SyncReport = {
  generatedAt: '2026-09-07T01:36:50.000Z',
  source: 'primeui-figma-plugin-v4',
  branch: 'design-tokens/sync',
  sha: 'd702032',
  actor: 'designer',
  runNumber: '3',
  runUrl: null,
  sets: [
    'aura/primitive',
    'aura/semantic/common',
    'aura/component/light',
    'aura/effects',
  ],
  leafCount: 2677,
  resolvedCount: 2677,
  unresolved: 0,
  outcomes: {
    build: 'success',
    audit: 'success',
    validate: 'success',
    theme: 'skipped',
  },
  diff: {
    base: { available: true, label: 'HEAD:libs/plectrum/src/tokens.json' },
    changed: [
      {
        path: 'surface.50',
        before: '#fafafa',
        after: '#f6f6f6',
        alias: 'neutral.50',
      },
      {
        path: 'text.color',
        before: '#0a0a0a',
        after: '#262626',
        alias: 'surface.950',
      },
      {
        path: 'accordion.panel.border.width',
        before: '1',
        after: '0',
        alias: null,
      },
      {
        path: 'overlay.modal.shadow',
        before:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        after: '0 24px 32px -8px rgba(0, 0, 0, 0.12)',
        alias: null,
      },
    ],
    reordered: [],
    added: [
      {
        path: 'card.background',
        after: '#ffffff',
        alias: 'content.background',
      },
    ],
    removed: [{ path: 'togglebutton.sm.zadding.x', before: '12' }],
  },
  checks: [
    {
      id: 'integrity',
      name: 'Value integrity',
      status: 'PASS',
      detail: 'Every alias resolves to a literal.',
      items: [],
    },
    {
      id: 'build',
      name: 'Build',
      status: 'OK',
      detail:
        'Generated SCSS and the Storybook token manifest were refreshed from this dump.',
      items: [],
    },
    {
      id: 'audit',
      name: 'Drift audit',
      status: 'PASS',
      detail: 'Figma, the PrimeNG preset and the generated SCSS agree.',
      items: [],
    },
    {
      id: 'coverage',
      name: 'Preset coverage',
      status: 'WARN',
      detail:
        '2 code-owned gaps (allowlisted: spacing, durations, focus style). Expected.',
      items: ['focus.ring.style', 'transition.duration'],
    },
    {
      id: 'theme',
      name: 'Theme',
      status: 'SKIP',
      detail:
        'No theme files in this sync — the plugin has no Theme Designer key yet. Plectrum_v1/ is unchanged.',
      items: [],
    },
  ],
  result: 'promote',
  resultText: 'A promotion pull request is opened for developer review.',
};

export const Checks: StoryObj = syncChecksStory(SYNC_REPORT);

export const Changes: StoryObj = syncChangesStory(SYNC_REPORT);

export const SampleChecks: StoryObj = syncChecksStory(SAMPLE);

export const SampleChanges: StoryObj = syncChangesStory(SAMPLE);

export const SampleBlocked: StoryObj = syncChecksStory({
  ...SAMPLE,
  result: 'blocked',
  checks: SAMPLE.checks.map((check) =>
    check.id === 'audit'
      ? {
          ...check,
          status: 'FAIL',
          detail: '1 value mismatch.',
          items: [
            'surface.50 — Figma #f6f6f6, preset #f6f6f6, SCSS #fafafa (--pds-color-surface-50)',
          ],
        }
      : check,
  ),
});
