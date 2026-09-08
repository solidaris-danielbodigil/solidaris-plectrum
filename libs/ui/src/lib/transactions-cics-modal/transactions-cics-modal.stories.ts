import { Component, signal } from '@angular/core';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { expect, userEvent, waitFor, within } from '../../storybook/story-tests';
import { TransactionsCicsModalComponent } from './transactions-cics-modal.component';
import { TransactionsCicsModalMetadata } from './transactions-cics-modal.metadata';

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
    <pds-transactions-cics-modal [(visible)]="visible" />
  `,
})
class TransactionsCicsModalStoryHostComponent {
  readonly visible = signal(false);
}

// App-owned (governance.status 'app', owner 'ishare') — filed under Patterns/iSHARE.
const meta: Meta<TransactionsCicsModalStoryHostComponent> = {
  parameters: {
    ...storyDesign(TransactionsCicsModalMetadata.component.figmaUrl),
  },
  title: 'Patterns/iSHARE/Transactions CICS Modal',
  component: TransactionsCicsModalStoryHostComponent,
  argTypes: argTypesFromProps(TransactionsCicsModalMetadata.props ?? []),
  decorators: [
    moduleMetadata({
      imports: [TransactionsCicsModalStoryHostComponent],
    }),
    componentWrapperDecorator(
      (story) => `<div style="padding: 1.5rem">${story}</div>`,
    ),
  ],
};

export default meta;

type Story = StoryObj<TransactionsCicsModalStoryHostComponent>;

/** Ownership badge for the docs page — hidden from the sidebar. */
export const Status = statusStory(TransactionsCicsModalMetadata.governance);

export const Dutch: Story = {
  globals: { locale: 'nl' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Transactions CICS' }),
    );
    await waitFor(() => {
      const page = within(canvasElement.ownerDocument.body);
      expect(page.getByRole('dialog', { name: /CICS-transacties/ })).toBeVisible();
    });
  },
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Transactions CICS' }),
    );
    await waitFor(() => {
      const page = within(canvasElement.ownerDocument.body);
      expect(page.getByRole('dialog', { name: /Transactions CICS/ })).toBeVisible();
    });
  },
};
