import { componentWrapperDecorator, Meta } from '@storybook/angular';

export default {
  title: 'Foundations / Layout',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div class="sb-demo-wrapper">${story}</div>`,
    ),
  ],
  argTypes: {
    'o-layout': {
      name: '.o-layout',
      description: 'Layout object initalizer',
      table: {
        category: 'Block',
      },
    },
  },
  tags: ['!dev', 'Foundations'],
} as Meta;

export const FullHeight = {
  decorators: [
    componentWrapperDecorator(
      (story) => `
      <html class="o-layout o-layout--full-height">
        <body class="o-layout o-layout--full-height">
          <section class="o-layout o-layout--full-height">
            <article class="o-layout o-layout--full-height">
              <div class="o-layout o-layout--full-height">${story}</div>
          </article>
        </section>
        </body>
      </html>
      `,
    ),
  ],
  render: () => ({
    template: `<div class="o-flex o-flex--y o-layout o-layout--full-height">
                <div class="o-flex__item"></div>
              </div>`,
  }),
};
export const Overflow = {
  render: () => ({
    template: `<div class="o-flex o-flex--y o-layout o-layout--overflow-auto">
                <div class="o-flex__item o-flex__item--3"></div>
                <div class="o-flex__item o-flex__item--8"></div>
                <div class="o-flex__item o-flex__item--3"></div>
              </div>`,
  }),
};
export const Spacing = {
  render: () => ({
    template: `<div class="o-flex
                           o-flex--y
                           o-layout
                           o-layout--gap-2
                           o-layout--overflow-auto">
                <div class="o-flex__item o-flex__item--3"></div>
                <div class="o-flex__item"></div>
                <div class="o-flex__item o-flex__item--3"></div>
              </div>`,
  }),
};
