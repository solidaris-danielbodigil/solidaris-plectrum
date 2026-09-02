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
  title: 'UI/Delay Prediction Card',
  component: DelayPredictionCardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ providers: plectrumIconProviders }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Prédiction du délai — Figma [iSHARE-Audit node 704:11968](https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=704-11968).

In iSHARE document detail, the section title **Prédiction du delai** is rendered outside this card (same style as **Détails**).

BEM block: \`c-delay-prediction-card\`
        `,
      },
    },
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
