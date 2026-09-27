// Figures for Get started/Use Plectrum in an app (get-started-consume.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular-vite';
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
      'Install `@solidaris-danielbodigil/ui`, `@solidaris-danielbodigil/plectrum` and `@solidaris-danielbodigil/styles`, plus `primeng` and `@primeuix/themes`. Until npm publish is on, use the packed tarballs from `npm run pack:libs`.',
    links: [
      {
        label: 'Packages and how to get them',
        href: '#packages-and-how-to-get-them',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Download the agent files',
    detail:
      'Place `.ai` at the repository root, `.cursor/agents` for Cursor, and `.github/agents` for VS Code. The packages do not install these folders.',
    links: [
      { label: 'Agent files', href: '#agent-files' },
      {
        label: '.ai',
        href: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/tree/main/.ai',
      },
      {
        label: 'Cursor agents',
        href: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/tree/main/.cursor/agents',
      },
      {
        label: 'VS Code agents',
        href: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/tree/main/.github/agents',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Wire the stylesheet',
    detail:
      "Add `node_modules/@solidaris-danielbodigil/styles/src` to `stylePreprocessorOptions.includePaths` and `@use 'main'` in `styles.scss`.",
    links: [
      { label: 'Wire the stylesheet', href: '#wire-the-stylesheet' },
      { label: 'Fonts, icons and browsers', href: '#fonts-icons-and-browsers' },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Boot the theme',
    detail:
      '`providePlectrum()` in the application config. Every `--p-*` and `--pds-*` custom property exists after this.',
    links: [{ label: 'Boot the theme', href: '#boot-the-theme' }],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Render the first component',
    detail:
      '`pds-form-field` from `@solidaris-danielbodigil/ui` around a `pInputText` — the same component the sample application builds in CI.',
    links: [
      { label: 'First component', href: '#first-component' },
      {
        label: 'Form Field',
        path: '/docs/custom-components-form-field--docs',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Build screens',
    detail:
      'PrimeNG and `pds-*` components from this Storybook. Layout via `o-flex` / `o-layout` classes.',
    links: [
      { label: 'Build screens', href: '#build-screens' },
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
      { label: 'Find a Token', path: '/docs/foundations-token-finder--docs' },
    ],
  },
]);

/** Check, then ask, then maybe build — the default before inventing. */
export const BeforeYouInvent: StoryObj = stepsStory([
  {
    who: 'App team',
    tone: 'app',
    title: 'Use Plectrum-themed PrimeNG',
    detail:
      'Start in the theme gallery. Most screens are a PrimeNG control with the Plectrum theme, plus layout classes.',
    links: [{ label: 'Theme gallery', path: '/docs/primeng-actions--docs' }],
  },
  {
    who: 'App team',
    tone: 'app',
    title: 'Use a Core pds-* component',
    detail:
      'If PrimeNG is not enough, import a Core component from @solidaris-danielbodigil/ui. Find a component lists each one and which teams already use it.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
    ],
  },
  {
    who: 'App team',
    tone: 'design',
    title: 'Propose the gap',
    detail:
      'If still nothing covers the need, open a proposal. Do not start a new component. The core team will say whether to use something that already exists, whether they will build it, or whether your team should build it.',
    links: [
      { label: 'Contribute', path: '/docs/get-started-contribute--docs' },
    ],
  },
]);
