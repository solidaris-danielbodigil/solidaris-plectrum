import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { assertRoleVisible, assertTextVisible, expect, fn, tabSequence, resetFocus, userEvent, within } from '../../storybook/story-tests';
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
export const Patterns = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'patterns') };
export const Examples = { tags: ['!dev'], ...contractStory(DelayPredictionCardMetadata, 'examples') };
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

export const Anatomy = {
  tags: ['!dev'],
  ...anatomyStory(DelayPredictionCardMetadata, Default),
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

/**
 * Keyboard contract (delay-prediction-card.metadata.ts → accessibility.keyboardSupport):
 * the overflow trigger is the only stop in the tab order, and Enter or Space emits menuClick.
 */
export const Keyboard: Story = {
  tags: ['keyboard'],
  args: {
    daysRemaining: 11,
    predictedCloseDate: '19/06/2026',
    menuClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: "Plus d'actions — prédiction du délai" });
    resetFocus(canvasElement);
    await expect(await tabSequence(canvasElement, 1)).toEqual(["Plus d'actions — prédiction du délai"]);
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.menuClick).toHaveBeenCalledTimes(2);
    await expect(canvasElement.querySelectorAll('button, [tabindex]:not([tabindex="-1"]), a[href], input')).toHaveLength(1);
  },
};
