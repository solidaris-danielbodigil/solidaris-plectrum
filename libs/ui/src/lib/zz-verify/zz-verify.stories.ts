// Temporary — forces the Storybook watcher to re-see and then unlink this path.
import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = { title: 'zz-verify', tags: ['!dev'] };
export default meta;

export const Default: StoryObj = {
  render: () => ({ template: '<span></span>' }),
};
