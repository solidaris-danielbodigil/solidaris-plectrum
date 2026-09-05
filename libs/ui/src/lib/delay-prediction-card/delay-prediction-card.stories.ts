import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { DelayPredictionCardComponent } from './delay-prediction-card.component';

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

const meta: Meta<DelayPredictionCardComponent> = {
  title: 'Custom components/Delay Prediction Card',
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

export const Default: Story = {
  args: {
    daysRemaining: 11,
    predictedCloseDate: '19/06/2026',
  },
};

export const Unavailable: Story = {
  args: {
    unavailable: true,
  },
};

export const FewDaysRemaining: Story = {
  args: {
    daysRemaining: 3,
    predictedCloseDate: '23/06/2026',
  },
};
