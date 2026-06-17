import { Component, signal } from '@angular/core';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { TransactionsCicsModalComponent } from './transactions-cics-modal.component';

@Component({
  selector: 'pds-transactions-cics-modal-story-host',
  standalone: true,
  imports: [ButtonModule, TransactionsCicsModalComponent],
  template: `
    <button
      pButton
      type="button"
      label="Transactions CICS"
      (click)="visible.set(true)"
    ></button>
    <(pds|app|lib)-transactions-cics-modal [(visible)]="visible" />
  `,
})
class TransactionsCicsModalStoryHostComponent {
  readonly visible = signal(false);
}

const meta: Meta<TransactionsCicsModalStoryHostComponent> = {
  title: 'UI/Transactions CICS Modal',
  component: TransactionsCicsModalStoryHostComponent,
  decorators: [
    moduleMetadata({
      imports: [TransactionsCicsModalStoryHostComponent],
    }),
    componentWrapperDecorator(
      (story) => `<div style="padding: 1.5rem">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Legacy iShare Transactions CICS modal — searchable list with per-row CICS launch CTA (Scenario 4).',
      },
    },
  },
};

export default meta;

type Story = StoryObj<TransactionsCicsModalStoryHostComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Open the modal, search for UA38 (jours vacances ONVA), launch CICS.',
      },
    },
  },
};
