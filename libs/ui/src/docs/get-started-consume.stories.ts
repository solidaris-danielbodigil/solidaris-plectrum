// Figures for Get started/Use Plectrum in an app (get-started-consume.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Get started/Figures/Use Plectrum in an app',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const InstallFlow: StoryObj = stepsStory([
  {
    who: 'Dev',
    tone: 'app',
    title: 'Install the packages',
    detail:
      '@solidaris/ui, @solidaris/plectrum and @solidaris/styles, plus primeng and @primeuix/themes as peers. Until the first release they install as packed tarballs from npm run pack:libs; afterwards from the registry.',
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Wire the stylesheet',
    detail:
      'Add node_modules/@solidaris/styles/src to stylePreprocessorOptions.includePaths and @use main in styles.scss.',
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Boot the theme',
    detail:
      'providePlectrum() in the application config. Every --p-* and --pds-* custom property exists after this.',
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Render the first component',
    detail:
      'pds-form-field from @solidaris/ui around a pInputText — the same component the packed-consumer fixture builds in CI.',
    links: [
      {
        label: 'Form Field',
        path: '/docs/custom-components-form-field--docs',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Build with the catalogue',
    detail:
      'PrimeNG components and pds-* components from this Storybook. Layout via o-flex / o-layout classes.',
    links: [
      { label: 'Component status', path: '/docs/docs-component-status--docs' },
      { label: 'Token finder', path: '/docs/foundations-token-finder--docs' },
    ],
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Receive upgrades',
    detail:
      'Once versions publish, Renovate or Dependabot opens a bump pull request. Optionally, pds-tokens-lint from @solidaris/tokens-cli guards hardcoded values in your CI.',
  },
]);
