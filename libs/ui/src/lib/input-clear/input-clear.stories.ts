import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputClearComponent } from './input-clear.component';

const meta: Meta<InputClearComponent> = {
  title: 'UI/Input Clear',
  component: InputClearComponent,
  parameters: {
    docs: {
      description: {
        component: `
Reusable clear affordance for \`pInputText\` fields. Uses the same PrimeNG \`times\` SVG as
\`showClear\` on autocomplete, select, and multiselect (14×14 via \`--p-icon-size\`).

Always keep the control in the DOM and toggle \`[visible]\` so \`p-iconfield\` padding stays reserved.
        `,
      },
    },
  },
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
          <sds-input-clear
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
          <sds-input-clear
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
            <sds-input-clear
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
