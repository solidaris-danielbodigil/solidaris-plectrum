import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { statusStory } from '../docs/docs-figure-stories';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { evidenceStory } from '../storybook/evidence-story';
import {
  assertRoleVisible,
  assertTextVisible,
  expect,
  userEvent,
  waitForText,
  within,
} from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const STACK = 'o-flex o-flex--col o-layout o-layout--gap-2';

@Component({
  selector: 'pds-feedback-toast-demo',
  standalone: true,
  imports: [Button, Toast],
  providers: [MessageService],
  template: `
    <p-toast position="top-right" appendTo="body" />
    <div class="o-flex o-flex--row-wrap o-layout o-layout--gap-2">
      <p-button
        label="Confirmer l'enregistrement"
        (onClick)="showSuccess()"
      />
      <p-button
        label="Afficher l'information"
        severity="secondary"
        [outlined]="true"
        (onClick)="showInfo()"
      />
    </div>
  `,
})
class FeedbackToastDemo {
  private readonly messages = inject(MessageService);

  showSuccess(): void {
    this.messages.add({
      severity: 'success',
      summary: 'Enregistré',
      detail: 'Vos modifications sont sauvegardées.',
    });
  }

  showInfo(): void {
    this.messages.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Le traitement continue en arrière-plan.',
    });
  }
}

@Component({
  selector: 'pds-feedback-sticky-toast-demo',
  standalone: true,
  imports: [Button, Toast],
  providers: [MessageService],
  template: `
    <p-toast position="top-right" appendTo="body" />
    <p-button label="Afficher l'action requise" (onClick)="show()" />
  `,
})
class FeedbackStickyToastDemo {
  private readonly messages = inject(MessageService);

  show(): void {
    this.messages.add({
      severity: 'info',
      summary: 'Action requise',
      detail: 'Vérifiez votre adresse avant de continuer.',
      sticky: true,
    });
  }
}

interface FeedbackArgs {
  severity: 'error' | 'warn' | 'info' | 'success';
  content: string;
  closable: boolean;
}

const meta: Meta<FeedbackArgs> = {
  title: 'PrimeNG/Message and Toast',
  parameters: { layout: 'padded' },
  argTypes: {
    severity: {
      control: 'select',
      options: ['error', 'warn', 'info', 'success'],
      table: { category: 'PrimeNG' },
    },
    content: { control: 'text', table: { category: 'Content' } },
    closable: { control: 'boolean', table: { category: 'PrimeNG' } },
  },
  args: {
    severity: 'error',
    content:
      "Le paiement n'a pas pu être enregistré. Vérifiez le numéro de compte et réessayez.",
    closable: false,
  },
};

export default meta;

type Story = StoryObj<FeedbackArgs>;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'Feedback after something happened. Message stays in the page; Toast appears and leaves. Stock PrimeNG.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=393-39252',
    },
  ),
};

/** Primary canvas. The Controls panel edits these args. */
export const Default: Story = {
  parameters: {
    docs: {
      source: { code: primeNgExample('feedback').code, language: 'ts' },
    },
  },
  play: async ({ canvasElement }) => {
    const alerts = within(canvasElement).getAllByRole('alert');
    await expect(alerts.length).toBeGreaterThan(0);
  },
  render: () => ({
    moduleMetadata: { imports: [Message] },
    template: `
      <p-message
        severity="error"
        text="Le paiement n'a pas pu être enregistré. Vérifiez le numéro de compte et réessayez."
        [escape]="true"
      />
    `,
  }),
};

export const MessageSeverities: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const alerts = within(canvasElement).getAllByRole('alert');
    await expect(alerts).toHaveLength(4);
  },
  render: () => ({
    moduleMetadata: { imports: [Message] },
    template: `
      <div class="${STACK}">
        <p-message severity="error" text="Corrigez les données avant de continuer." [escape]="true" />
        <p-message severity="warn" text="Le dossier contient des informations à vérifier." [escape]="true" />
        <p-message severity="info" text="Le traitement peut prendre quelques minutes." [escape]="true" />
        <p-message severity="success" text="Dossier enregistré." [escape]="true" />
      </div>
    `,
  }),
};

export const FieldMessage: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: /Numéro de membre/ });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
  render: () => ({
    moduleMetadata: {
      imports: [InputText, FormFieldComponent],
    },
    template: `
      <pds-form-field
        label="Numéro de membre"
        inputId="member-number"
        [invalid]="true"
        errorMessage="Indiquez votre numéro de membre."
      >
        <input
          pInputText
          id="member-number"
          value=""
          aria-invalid="true"
          class="o-layout o-layout--full-width"
        />
      </pds-form-field>
    `,
  }),
};

export const ClosableMessage: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Fermer' })).toBeTruthy();
  },
  render: () => ({
    moduleMetadata: { imports: [Message] },
    template: `
      <p-message
        severity="info"
        text="La maintenance commence à 18 h."
        [escape]="true"
        [closable]="true"
        closeIcon="bi bi-x-lg"
      />
    `,
  }),
};

export const ToastSeverities: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: "Confirmer l'enregistrement" }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: "Afficher l'information" }),
    );
    await waitForText(canvasElement, 'Enregistré', { inDocument: true });
    await waitForText(canvasElement, 'Information', { inDocument: true });
  },
  render: () => ({
    moduleMetadata: { imports: [FeedbackToastDemo] },
    template: `<pds-feedback-toast-demo />`,
  }),
};

export const StickyToast: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: "Afficher l'action requise" }),
    );
    await waitForText(canvasElement, 'Action requise', { inDocument: true });
    await assertRoleVisible(canvasElement, 'button', 'Fermer', {
      inDocument: true,
    });
  },
  render: () => ({
    moduleMetadata: { imports: [FeedbackStickyToastDemo] },
    template: `<pds-feedback-sticky-toast-demo />`,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('feedback')),
};
