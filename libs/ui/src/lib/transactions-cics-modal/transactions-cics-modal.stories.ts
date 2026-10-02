import { Component, signal } from '@angular/core';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular-vite';
import { ButtonModule } from 'primeng/button';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { expect, expectFocus, fn, pressEscape, tabTo, userEvent, waitFor, within } from '../../storybook/story-tests';
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

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from transactions-cics-modal.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(
  TransactionsCicsModalMetadata.governance,
  TransactionsCicsModalMetadata.component,
) };
export const Usage = { tags: ['!dev'], ...contractStory(TransactionsCicsModalMetadata, 'usage') };
export const Patterns = { tags: ['!dev'], ...contractStory(TransactionsCicsModalMetadata, 'patterns') };
export const Examples = { tags: ['!dev'], ...contractStory(TransactionsCicsModalMetadata, 'examples') };
export const Composition = { tags: ['!dev'], ...contractStory(TransactionsCicsModalMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(TransactionsCicsModalMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(TransactionsCicsModalMetadata, 'accessibility') };

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

export const Anatomy = {
  tags: ['!dev'],
  ...anatomyStory(TransactionsCicsModalMetadata, Default),
};

/**
 * Keyboard contract (transactions-cics-modal.metadata.ts → accessibility.keyboardSupport):
 * opened from the keyboard, focus is inside the dialog; typing filters the rows,
 * Enter on a launch button opens the transaction, and Escape closes the dialog
 * with focus back on the trigger. The focus trap is PrimeNG Dialog's.
 */
export const Keyboard: Story = {
  tags: ['keyboard'],
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView!;
    const open = view.open;
    const opened = fn();
    view.open = opened as unknown as typeof view.open;
    try {
      const trigger = within(canvasElement).getByRole('button', { name: 'Transactions CICS' });
      await tabTo(canvasElement, trigger);
      await userEvent.keyboard('{Enter}');
      const page = within(canvasElement.ownerDocument.body);
      const dialog = await waitFor(() => page.getByRole('dialog', { name: /Transactions CICS/ }));
      await waitFor(() => expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(true));

      const search = within(dialog).getByRole('searchbox');
      await tabTo(canvasElement, search);
      await userEvent.type(search, 'UA38');
      await userEvent.tab();
      const launch = within(dialog).getByRole('button', { name: 'Lancer UA38 dans CICS' });
      await expectFocus(launch);
      await userEvent.keyboard('{Enter}');
      await expect(opened).toHaveBeenCalledWith('https://example.com/cics/UA38', '_blank', 'noopener,noreferrer');

      pressEscape(canvasElement);
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
      await expectFocus(trigger);
    } finally {
      view.open = open;
    }
  },
};
