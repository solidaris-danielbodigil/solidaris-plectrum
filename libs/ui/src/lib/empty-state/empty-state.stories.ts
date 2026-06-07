import type { Meta, StoryObj } from '@storybook/angular';
import { EmptyStateComponent } from './empty-state.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'UI/Empty State',
  component: EmptyStateComponent,
  parameters: {
    docs: {
      description: {
        component: `
Reusable placeholder for empty results, document details, or onboarding states.
- Figma: [Empty state illustration](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=441-7641)
- One illustration is picked at random from the exported Figma SVG assets on each render; the art is decorative and the title and description carry the message.
        `,
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<EmptyStateComponent>;

export const Default: Story = {
  args: {
    title: 'Aucune recherche pour le moment',
    description: 'Lancez une recherche pour afficher les informations du document sélectionné.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default placeholder state used for the iShare document details card.',
      },
    },
  },
};