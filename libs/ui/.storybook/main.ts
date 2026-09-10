import type { StorybookConfig } from '@storybook/angular-vite';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// SCSS includePaths and global styles are configured in angular.json under
// the ui:storybook target — stylePreprocessorOptions.includePaths and styles.
// Vite production `base` is already `./`, so Pages sub-path chunk URLs stay
// relative without STORYBOOK_PUBLIC_PATH.

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['**/libs/ui/src/lib/**'],
          exclude: [
            '**/*.stories.ts',
            '**/*.mdx',
            '**/*.spec.ts',
            '**/*.metadata.ts',
          ],
        },
      },
    },
    '@chromatic-com/storybook',
    '@storybook/addon-mcp',
  ],
  framework: {
    name: '@storybook/angular-vite',
    options: {
      tsconfig: 'libs/ui/.storybook/tsconfig.json',
      propsTable: 'inputs',
    },
  },
  features: {
    componentsManifest: true,
  },
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tsconfigPaths()],
    }),
};

export default config;
