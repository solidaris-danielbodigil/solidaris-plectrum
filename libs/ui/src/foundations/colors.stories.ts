import type { Meta, StoryObj } from '@storybook/angular';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import {
  COLOR_PRIMITIVE_GROUPS,
  COLOR_SEMANTIC_GROUPS,
} from '../storybook/token-sections';
import { COMPONENT_GROUP } from '../storybook/token-taxonomy';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Colors',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'color' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Primitive: Story = {
  args: { groups: COLOR_PRIMITIVE_GROUPS },
};

export const SemanticCommon: Story = {
  args: { groups: [...COLOR_SEMANTIC_GROUPS, COMPONENT_GROUP] },
};

export const StubbedProvidePlectrum: Story = {
  name: 'Stubbed providePlectrum',
  args: { stubPrime: true, groups: [...COLOR_SEMANTIC_GROUPS, COMPONENT_GROUP] },
};
