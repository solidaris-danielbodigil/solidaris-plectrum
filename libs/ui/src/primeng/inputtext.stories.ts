import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { statusStory } from '../docs/docs-figure-stories';
import { evidenceStory } from '../storybook/evidence-story';
import { assertTextVisible } from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const meta: Meta = {
  title: 'PrimeNG/InputText',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'One line of free text. Stock PrimeNG InputText inside Form Field. The label, hint and error come from Form Field.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=23-835',
    },
  ),
};

export const Default: Story = {
  parameters: {
    docs: { source: { code: primeNgExample('input-text').code, language: 'ts' } },
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Numéro de membre');
  },
  render: () => ({
    props: { member: '', submitted: false },
    moduleMetadata: { imports: [FormsModule, InputText, FormFieldComponent] },
    template: `
      <pds-form-field
        label="Numéro de membre"
        inputId="member-docs"
        hint="Dix chiffres, sans espaces"
        requiredLabel="obligatoire"
        [required]="true"
      >
        <input pInputText id="member-docs" name="member" [(ngModel)]="member" autocomplete="off" />
      </pds-form-field>
    `,
  }),
};

export const Invalid: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Indiquez votre numéro de membre.');
  },
  render: () => ({
    props: { member: '' },
    moduleMetadata: { imports: [FormsModule, InputText, FormFieldComponent] },
    template: `
      <pds-form-field
        label="Numéro de membre"
        inputId="member-invalid"
        requiredLabel="obligatoire"
        [required]="true"
        [invalid]="true"
        errorMessage="Indiquez votre numéro de membre."
      >
        <input pInputText id="member-invalid" [(ngModel)]="member" />
      </pds-form-field>
    `,
  }),
};

export const LongLabel: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Numéro d’identification de la sécurité sociale');
  },
  render: () => ({
    props: { value: '' },
    moduleMetadata: { imports: [FormsModule, InputText, FormFieldComponent] },
    template: `
      <pds-form-field
        label="Numéro d’identification de la sécurité sociale"
        inputId="niss"
        hint="Onze chiffres"
        requiredLabel="verplicht"
      >
        <input pInputText id="niss" [(ngModel)]="value" autocomplete="off" />
      </pds-form-field>
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('input-text')),
};
