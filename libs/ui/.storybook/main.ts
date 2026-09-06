import type { StorybookConfig } from '@storybook/angular';
import remarkGfm from 'remark-gfm';

// SCSS includePaths and global styles are configured in angular.json under
// the ui:storybook target — stylePreprocessorOptions.includePaths and styles.
// Static GitHub Pages builds set STORYBOOK_PUBLIC_PATH=./ so iframe
// module imports stay relative (an absolute /repo/storybook/ path
// becomes .//repo/storybook/... and 404s).

const pagesPublicPath = process.env['STORYBOOK_PUBLIC_PATH'];

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
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  ...(pagesPublicPath
    ? {
        webpackFinal: async (webpackConfig) => {
          webpackConfig.output = {
            ...webpackConfig.output,
            publicPath: pagesPublicPath,
          };
          return webpackConfig;
        },
      }
    : {}),
};

export default config;
