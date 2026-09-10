import type { Meta, StoryObj } from '@storybook/angular';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { assertTextVisible } from '../../storybook/story-tests';
import { PlectrumAvatarComponent } from './plectrum-avatar.component';
import { PlectrumAvatarMetadata } from './plectrum-avatar.metadata';

const meta: Meta<PlectrumAvatarComponent> = {
  title: 'Custom components/PlectrumAvatar',
  component: PlectrumAvatarComponent,
  parameters: {
    layout: 'centered',
    ...storyDesign(PlectrumAvatarMetadata.component.figmaUrl),
  },
  argTypes: argTypesFromProps(PlectrumAvatarMetadata.props ?? [], {
    size: { control: 'select', options: ['small', 'large'] },
    gender: { control: 'select', options: ['female', 'male', 'other'] },
    variant: { control: 'select', options: [1, 2, 3] },
    state: { control: 'select', options: ['default', 'active'] },
  }),
};

export default meta;
type Story = StoryObj<PlectrumAvatarComponent>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from plectrum-avatar.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(PlectrumAvatarMetadata.governance, PlectrumAvatarMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(PlectrumAvatarMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(PlectrumAvatarMetadata, 'anatomy') };
export const Variants = { tags: ['!dev'], ...contractStory(PlectrumAvatarMetadata, 'variants') };
export const Composition = { tags: ['!dev'], ...contractStory(PlectrumAvatarMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(PlectrumAvatarMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(PlectrumAvatarMetadata, 'accessibility') };

export const Default: Story = {
  args: {
    initials: 'LV',
    state: 'default',
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'LV');
  },
};

export const Active: Story = {
  args: {
    initials: 'LV',
    state: 'active',
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'LV');
  },
};

export const LargeIllustrated: Story = {
  args: {
    initials: 'EM',
    size: 'large',
    gender: 'female',
    variant: 1,
    ariaLabel: 'Eva Martinez',
  },
};

export const LargeMaleVariant2: Story = {
  args: {
    initials: 'JD',
    size: 'large',
    gender: 'male',
    variant: 2,
    ariaLabel: 'John Doe',
  },
};

export const LargeOther: Story = {
  args: {
    initials: 'AX',
    size: 'large',
    gender: 'other',
    variant: 1,
    ariaLabel: 'Alex',
  },
};
