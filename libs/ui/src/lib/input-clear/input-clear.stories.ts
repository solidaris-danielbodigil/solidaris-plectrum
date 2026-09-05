import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { expect, userEvent, within } from 'storybook/test';
import { InputClearComponent } from './input-clear.component';

const meta: Meta<InputClearComponent> = {
  title: 'Custom components/Input Clear',
  component: InputClearComponent,
  argTypes: {
    visible: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<InputClearComponent>;

export const IconField: Story = {
  render: (args) => ({
    props: { ...args, value: 'Sample query' },
    moduleMetadata: {
      imports: [
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        InputClearComponent,
      ],
    },
    template: `
      <p-iconfield class="o-layout--full-width">
        <input
          pInputText
          class="o-layout--full-width"
          [(ngModel)]="value"
          placeholder="Search"
        />
        <p-inputicon>
          <pds-input-clear
            [visible]="!!value"
            [ariaLabel]="ariaLabel"
            (clear)="value = ''"
          />
        </p-inputicon>
      </p-iconfield>
    `,
  }),
  args: {
    visible: true,
    ariaLabel: 'Clear',
  },
  // Interaction test: clicking the clear affordance empties the bound input.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText<HTMLInputElement>('Search');
    await expect(input).toHaveValue('Sample query');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(input).toHaveValue('');
  },
};

export const SearchWithLeadingIcon: Story = {
  render: (args) => ({
    props: { ...args, query: 'Document' },
    moduleMetadata: {
      imports: [
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        InputClearComponent,
      ],
    },
    template: `
      <p-iconfield class="o-layout--full-width">
        <p-inputicon><i class="bi bi-search" aria-hidden="true"></i></p-inputicon>
        <input
          pInputText
          type="text"
          role="searchbox"
          autocomplete="off"
          class="o-layout--full-width"
          [(ngModel)]="query"
          placeholder="Rechercher document..."
        />
        <p-inputicon>
          <pds-input-clear
            [visible]="!!query"
            [ariaLabel]="ariaLabel"
            (clear)="query = ''"
          />
        </p-inputicon>
      </p-iconfield>
    `,
  }),
  args: {
    ariaLabel: 'Effacer la recherche',
  },
};

export const InInputGroup: Story = {
  render: (args) => ({
    props: { ...args, value: '888' },
    moduleMetadata: {
      imports: [
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        InputGroupModule,
        ButtonModule,
        InputClearComponent,
      ],
    },
    template: `
      <p-inputgroup class="o-layout--full-width">
        <p-iconfield class="o-flex__item--grow-1 o-layout--min-w-0">
          <input pInputText [(ngModel)]="value" placeholder="Numéro NISS" />
          <p-inputicon>
            <pds-input-clear
              [visible]="!!value"
              [ariaLabel]="ariaLabel"
              (clear)="value = ''"
            />
          </p-inputicon>
        </p-iconfield>
        <button pButton type="button" label="Chercher" icon="bi bi-search"></button>
      </p-inputgroup>
    `,
  }),
  args: {
    visible: true,
    ariaLabel: 'Clear',
  },
};
