import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { statusStory } from '../docs/docs-figure-stories';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { evidenceStory } from '../storybook/evidence-story';
import {
  assertRoleVisible,
  waitForText,
} from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

interface DialogArgs {
  header: string;
  body: string;
  closable: boolean;
}

const meta: Meta<DialogArgs> = {
  title: 'PrimeNG/Dialog',
  parameters: { layout: 'padded' },
  argTypes: {
    header: { control: 'text', table: { category: 'PrimeNG' } },
    body: { control: 'text', table: { category: 'Content' } },
    closable: { control: 'boolean', table: { category: 'PrimeNG' } },
  },
  args: {
    header: 'Supprimer ce document ?',
    body: 'Cette action ne peut pas être annulée.',
    closable: true,
  },
};

export default meta;

type Story = StoryObj<DialogArgs>;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'A question the person must answer before continuing. Stock PrimeNG Dialog.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=243-9556',
    },
  ),
};

/** Primary canvas. The Controls panel edits these args. */
export const Default: Story = {
  parameters: {
    docs: { source: { code: primeNgExample('dialog').code, language: 'ts' } },
  },
  play: async ({ canvasElement }) => {
    await waitForText(canvasElement, 'Supprimer ce document ?', {
      inDocument: true,
    });
    await assertRoleVisible(canvasElement, 'button', 'Supprimer', {
      inDocument: true,
    });
  },
  render: (args) => ({
    props: { ...args, visible: true },
    moduleMetadata: { imports: [Button, Dialog] },
    template: `
      <p-dialog
        [header]="header"
        [(visible)]="visible"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [closable]="closable"
        [blockScroll]="true"
        appendTo="body"
        closeAriaLabel="Fermer"
      >
        <p class="o-layout o-layout--margin-0">{{ body }}</p>
        <ng-template #footer>
          <div class="o-flex o-flex--justify-content-flex-end o-layout o-layout--gap-2">
            <p-button
              label="Annuler"
              severity="secondary"
              [text]="true"
              (onClick)="visible = false"
            />
            <p-button
              label="Supprimer"
              severity="danger"
              (onClick)="visible = false"
            />
          </div>
        </ng-template>
      </p-dialog>
    `,
  }),
};

export const ShortForm: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await waitForText(canvasElement, 'Modifier le dossier', {
      inDocument: true,
    });
    await assertRoleVisible(canvasElement, 'button', 'Enregistrer', {
      inDocument: true,
    });
  },
  render: () => ({
    props: { visible: true, title: 'Demande de remboursement' },
    moduleMetadata: {
      imports: [
        FormsModule,
        Button,
        Dialog,
        InputText,
        FormFieldComponent,
      ],
    },
    template: `
      <p-dialog
        header="Modifier le dossier"
        [(visible)]="visible"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [blockScroll]="true"
        appendTo="body"
        closeAriaLabel="Fermer"
      >
        <pds-form-field label="Titre" inputId="record-title">
          <input
            pInputText
            id="record-title"
            [(ngModel)]="title"
            class="o-layout o-layout--full-width"
          />
        </pds-form-field>
        <ng-template #footer>
          <div class="o-flex o-flex--justify-content-flex-end o-layout o-layout--gap-2">
            <p-button
              label="Annuler"
              severity="secondary"
              [text]="true"
              (onClick)="visible = false"
            />
            <p-button label="Enregistrer" (onClick)="visible = false" />
          </div>
        </ng-template>
      </p-dialog>
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('dialog')),
};
