import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { InputClearMetadata } from './input-clear.metadata';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { expect, userEvent, within } from 'storybook/test';
import { InputClearComponent } from './input-clear.component';

const meta: Meta<InputClearComponent> = {
  parameters: {
    ...storyDesign(InputClearMetadata.component.figmaUrl),
  },
  title: 'Custom components/Input Clear',
  component: InputClearComponent,
  argTypes: argTypesFromProps(InputClearMetadata.props ?? []),
};

export default meta;

type Story = StoryObj<InputClearComponent>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from input-clear.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(InputClearMetadata.governance, InputClearMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(InputClearMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(InputClearMetadata, 'anatomy') };
export const Composition = { tags: ['!dev'], ...contractStory(InputClearMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(InputClearMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(InputClearMetadata, 'accessibility') };

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
      <p-iconfield class="c-docs-control">
        <input
          pInputText
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
      <p-iconfield class="c-docs-control">
        <p-inputicon><i class="bi bi-search" aria-hidden="true"></i></p-inputicon>
        <input
          pInputText
          type="text"
          role="searchbox"
          autocomplete="off"
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole<HTMLInputElement>('searchbox');
    await expect(input).toHaveValue('Document');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Effacer la recherche' }),
    );
    await expect(input).toHaveValue('');
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
      <p-inputgroup class="c-docs-control">
        <p-iconfield>
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
