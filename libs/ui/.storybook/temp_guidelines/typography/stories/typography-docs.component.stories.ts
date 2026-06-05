import { ButtonModule } from '@fba/button';
import { TagModule } from '@fba/info';
import { CardModule } from '@fba/panel';
import { Meta, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Foundations / Typography / Typography Docs ',
  decorators: [
    moduleMetadata({
      imports: [TagModule, CardModule, ButtonModule],
    }),
  ],
  tags: ['!autodocs', 'Foundations'],
} as Meta;

export const Light = {
  render: () => ({
    template: ` <fba-card
    class="foundations-tokens__item o-flex o-layout o-layout--gap-2"
  >
    <fba-card
      [outlined]="true"
      class="storybook-dark-theme foundations-tokens__value o-flex__item typo__light--xl--xl"
    >
      300<br />
      <p>This is a lightly weighted text, used for a subdued effect.</p>
    </fba-card>`,
  }),
  args: {},
  tags: ['!dev'],
};
export const Regular = {
  render: () => ({
    template: ` <fba-card
    class="foundations-tokens__item o-flex o-layout o-layout--gap-2"
  >
    <fba-card
      [outlined]="true"
      class="storybook-dark-theme foundations-tokens__value o-flex__item typo__regular--xl--xl"
    >
      400<br />
      This is the normal weighted text, primarily used for body content.
    </fba-card>`,
  }),
  args: {},
  tags: ['!dev'],
};
export const Medium = {
  render: () => ({
    template: ` <fba-card
    class="foundations-tokens__item o-flex o-layout o-layout--gap-2"
  >
    <fba-card
      [outlined]="true"
      class="storybook-dark-theme foundations-tokens__value o-flex__item typo__medium--xl--xl"
    >
      500<br />
      This is a medium weighted text, commonly used for sub-headings.
    </fba-card>`,
  }),
  args: {},
  tags: ['!dev'],
};
export const Bold = {
  render: () => ({
    template: ` <fba-card
    class="foundations-tokens__item o-flex o-layout o-layout--gap-2"
  >
    <fba-card
      [outlined]="true"
      class="storybook-dark-theme foundations-tokens__value o-flex__item typo__bold--xl--xl"
    >
      700<br />
      This is a bold weighted text, predominantly used for main titles and prominent headings.
    </fba-card>`,
  }),
  args: {},
  tags: ['!dev'],
};
