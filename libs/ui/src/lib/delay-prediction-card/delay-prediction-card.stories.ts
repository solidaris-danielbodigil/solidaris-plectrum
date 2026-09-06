import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { statusStory } from '../../docs/docs-figure-stories';
import { assertRoleVisible, assertTextVisible } from '../../storybook/story-tests';
import { DelayPredictionCardComponent } from './delay-prediction-card.component';
import { DelayPredictionCardMetadata } from './delay-prediction-card.metadata';

const plectrumIconProviders = [
  {
    provide: IconRegistry,
    useFactory: () => {
      const registry = new IconRegistry();
      registerPlectrumIcons(registry);
      return registry;
    },
  },
];

// App-owned (governance.status 'app', owner 'ishare') — filed under Patterns/iSHARE,
// not Custom components, so it never reads as a design-system contract.
const meta: Meta<DelayPredictionCardComponent> = {
  title: 'Patterns/iSHARE/Delay Prediction Card',
  component: DelayPredictionCardComponent,
  decorators: [
    moduleMetadata({ providers: plectrumIconProviders }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    unavailable: { control: 'boolean' },
    daysRemaining: { control: 'number' },
    predictedCloseDate: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<DelayPredictionCardComponent>;

/** Ownership badge for the docs page — hidden from the sidebar. */
export const Status = statusStory(DelayPredictionCardMetadata.governance);

export const Default: Story = {
  args: {
    daysRemaining: 11,
    predictedCloseDate: '19/06/2026',
  },
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'article', /Prédiction du délai/);
    await assertTextVisible(canvasElement, 'Jours restants');
  },
};

export const Unavailable: Story = {
  args: {
    unavailable: true,
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(
      canvasElement,
      /Aucune prédiction de délais/,
    );
  },
};

export const FewDaysRemaining: Story = {
  args: {
    daysRemaining: 3,
    predictedCloseDate: '23/06/2026',
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, '3');
    await assertTextVisible(canvasElement, '23/06/2026');
  },
};
