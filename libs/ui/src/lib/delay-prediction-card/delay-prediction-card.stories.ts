import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
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
    ...storyDesign(DelayPredictionCardMetadata.component.figmaUrl),
  },
  argTypes: argTypesFromProps(DelayPredictionCardMetadata.props ?? []),
};

export default meta;

type Story = StoryObj<DelayPredictionCardComponent>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from delay-prediction-card.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(
  DelayPredictionCardMetadata.governance,
  DelayPredictionCardMetadata.component,
) };
export const Usage = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'anatomy') };
export const Composition = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'accessibility') };

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

export const Dutch: Story = {
  globals: { locale: 'nl' },
  args: {
    daysRemaining: 11,
    predictedCloseDate: '19/06/2026',
  },
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'article', /Termijnvoorspelling/);
    await assertTextVisible(canvasElement, 'Resterende dagen');
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
