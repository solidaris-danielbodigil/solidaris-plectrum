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
  { who: 'Dev', tone: 'app', title: 'Install the packages', detail: '@solidaris/ui, @solidaris/styles, @solidaris/plectrum, plus primeng and @primeuix/themes as peers.' },
  { who: 'Dev', tone: 'app', title: 'Wire the stylesheet', detail: 'Add node_modules/@solidaris/styles/src to stylePreprocessorOptions.includePaths and @use main in styles.scss.' },
  { who: 'Dev', tone: 'app', title: 'Boot the theme', detail: 'providePlectrum() in the application config. Every --p-* and --pds-* custom property exists after this.' },
  { who: 'Dev', tone: 'app', title: 'Build with the catalogue', detail: 'PrimeNG components and pds-* components from this Storybook. Layout via o-flex / o-layout classes.' },
  { who: 'CI', tone: 'neutral', title: 'Receive upgrades', detail: 'Renovate or Dependabot opens a bump pull request when new versions publish. pds-tokens-lint guards hardcoded values.' },
]);
