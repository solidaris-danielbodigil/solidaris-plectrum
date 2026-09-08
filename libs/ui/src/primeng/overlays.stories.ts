import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { MessageService } from 'primeng/api';
import type { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';
import { Popover } from 'primeng/popover';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { statusStory } from '../docs/docs-figure-stories';
import {
  assertRoleVisible,
  assertTextVisible,
  expect,
  userEvent,
  waitFor,
  waitForText,
  within,
} from '../storybook/story-tests';

@Component({
  selector: 'pds-gallery-toast-demo',
  standalone: true,
  imports: [Button, Toast],
  providers: [MessageService],
  template: `
    <p-toast appendTo="body" />
    <p-button label="Afficher un toast" icon="bi bi-bell" (onClick)="show()" />
  `,
})
class GalleryToastDemo {
  private readonly messages = inject(MessageService);

  show(): void {
    this.messages.add({
      severity: 'success',
      summary: 'Enregistré',
      detail: 'Le dossier a été mis à jour.',
      life: 8000,
    });
  }
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Exporter', icon: 'bi bi-download' },
  { label: 'Imprimer', icon: 'bi bi-printer' },
  { separator: true },
  { label: 'Supprimer', icon: 'bi bi-trash' },
];

const meta: Meta = {
  title: 'PrimeNG/Overlays',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only theme proof. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

export const DialogOpen: Story = {
  play: async ({ canvasElement }) => {
    await waitForText(canvasElement, 'Modifier le dossier', {
      inDocument: true,
    });
    await assertRoleVisible(canvasElement, 'button', 'Enregistrer', {
      inDocument: true,
    });
  },
  render: () => ({
    props: { visible: true },
    moduleMetadata: { imports: [Button, Dialog] },
    template: `
      <p-dialog
        header="Modifier le dossier"
        [(visible)]="visible"
        [modal]="true"
        appendTo="body"
        closeAriaLabel="Fermer"
      >
        <p class="o-layout--margin-0">Mettez à jour les informations du dossier.</p>
        <ng-template #footer>
          <div class="o-flex o-flex--justify-content-flex-end o-layout--gap-2">
            <p-button label="Annuler" severity="secondary" (onClick)="visible = false" />
            <p-button label="Enregistrer" (onClick)="visible = false" />
          </div>
        </ng-template>
      </p-dialog>
    `,
  }),
};

export const DrawerOpen: Story = {
  play: async ({ canvasElement }) => {
    await waitForText(canvasElement, 'Filtres', { inDocument: true });
  },
  render: () => ({
    props: { visible: true },
    moduleMetadata: { imports: [Drawer] },
    template: `
      <p-drawer
        header="Filtres"
        [(visible)]="visible"
        position="right"
        appendTo="body"
        ariaCloseLabel="Fermer"
      >
        <p class="o-layout--margin-0">Filtres du dossier. Le chrome est stock PrimeNG.</p>
      </p-drawer>
    `,
  }),
};

export const PopoverOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: "Plus d'actions" }),
    );
    await waitForText(canvasElement, 'Exporter le dossier', {
      inDocument: true,
    });
  },
  render: () => ({
    moduleMetadata: { imports: [Button, Popover] },
    template: `
      <p-button
        label="Plus d'actions"
        icon="bi bi-three-dots"
        (onClick)="op.toggle($event)"
      />
      <p-popover #op appendTo="body">
        <p class="o-layout--margin-0">Exporter le dossier</p>
      </p-popover>
    `,
  }),
};

export const ToastMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Afficher un toast' }),
    );
    await waitForText(canvasElement, 'Enregistré', { inDocument: true });
  },
  render: () => ({
    moduleMetadata: { imports: [GalleryToastDemo] },
    template: `<pds-gallery-toast-demo />`,
  }),
};

export const TooltipTrigger: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'NISS' });
    await userEvent.hover(trigger);
    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.body.querySelector('.p-tooltip'),
      ).toBeTruthy(),
    );
  },
  render: () => ({
    moduleMetadata: { imports: [Button, Tooltip] },
    template: `
      <p-button
        label="NISS"
        pTooltip="Numéro d'identification à la sécurité sociale"
        tooltipPosition="top"
        tooltipEvent="hover"
      />
    `,
  }),
};

export const MenuInline: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Exporter');
    await assertTextVisible(canvasElement, 'Supprimer');
  },
  render: () => ({
    props: { items: MENU_ITEMS },
    moduleMetadata: { imports: [Menu] },
    template: `<p-menu [model]="items" />`,
  }),
};
