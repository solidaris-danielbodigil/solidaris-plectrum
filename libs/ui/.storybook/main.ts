import type { StorybookConfig } from '@storybook/angular';
import remarkGfm from 'remark-gfm';

// SCSS includePaths and global styles are configured in angular.json under
// the ui:storybook target — stylePreprocessorOptions.includePaths and styles.
// webpackFinal is only set for GitHub Pages (STORYBOOK_PUBLIC_PATH).

const pagesPublicPath = process.env.STORYBOOK_PUBLIC_PATH;

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
