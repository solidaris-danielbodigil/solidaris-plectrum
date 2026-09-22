import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from 'primeng/togglebutton';
import { statusStory } from '../docs/docs-figure-stories';
import { evidenceStory } from '../storybook/evidence-story';
import { assertTextVisible } from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const ROW =
  'o-flex o-flex--row-wrap o-flex--align-items-center o-layout o-layout--gap-2';

interface ToggleArgs {
  onLabel: string;
  offLabel: string;
  checked: boolean;
  disabled: boolean;
}

const meta: Meta<ToggleArgs> = {
  title: 'PrimeNG/ToggleButton',
  parameters: { layout: 'padded' },
  args: {
    onLabel: 'Notifications activées',
    offLabel: 'Notifications désactivées',
    checked: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<ToggleArgs>;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'One setting, on or off. Stock PrimeNG ToggleButton with the Plectrum theme. The change applies at once.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=187-6103',
    },
  ),
};

export const Default: Story = {
  parameters: {
    docs: { source: { code: primeNgExample('toggle-button').code, language: 'ts' } },
  },
  play: async ({ canvasElement, args }) => {
    await assertTextVisible(canvasElement, args.checked ? args.onLabel : args.offLabel);
  },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [FormsModule, ToggleButton] },
    template: `
      <p-togglebutton
        [(ngModel)]="checked"
        [onLabel]="onLabel"
        [offLabel]="offLabel"
        [disabled]="disabled"
        onIcon="bi bi-bell"
        offIcon="bi bi-bell-slash"
      />
    `,
  }),
};

export const Labels: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Notifications activées');
  },
  render: () => ({
    props: { checked: true },
    moduleMetadata: { imports: [FormsModule, ToggleButton] },
    template: `
      <p-togglebutton
        [(ngModel)]="checked"
        onLabel="Notifications activées"
        offLabel="Notifications désactivées"
      />
    `,
  }),
};

export const Small: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Filtres affichés');
  },
  render: () => ({
    props: { checked: false },
    moduleMetadata: { imports: [FormsModule, ToggleButton] },
    template: `
      <div class="${ROW}">
        <p-togglebutton [(ngModel)]="checked" onLabel="Filtres affichés" offLabel="Filtres masqués" size="small" />
        <p-togglebutton [(ngModel)]="checked" onLabel="Activé" offLabel="Désactivé" [disabled]="true" />
      </div>
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('toggle-button')),
};
