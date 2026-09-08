import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { statusStory } from '../docs/docs-figure-stories';
import { FORMS_API } from './gallery-arg-types';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import {
  assertRoleVisible,
  assertTextVisible,
  expect,
  waitFor,
} from '../storybook/story-tests';

const SECTORS = [
  { label: 'Indemnités', value: 'indemnites' },
  { label: 'Soins de santé', value: 'soins' },
  { label: 'Allocations', value: 'allocations' },
];

const meta: Meta = {
  title: 'PrimeNG/Forms',
  parameters: { layout: 'padded' },
  argTypes: FORMS_API as Meta['argTypes'],
};

export default meta;

type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only theme proof. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Secteur');
    await assertRoleVisible(canvasElement, 'textbox');
  },
  render: () => ({
    props: { value: 'Indemnités' },
    moduleMetadata: {
      imports: [FormsModule, InputText, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Secteur" inputId="gallery-sector" hint="Champ recommandé : pds-form-field autour du contrôle PrimeNG.">
        <input id="gallery-sector" pInputText [(ngModel)]="value" />
      </pds-form-field>
    `,
  }),
};

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'textbox');
  },
  render: () => ({
    props: { value: '319' },
    moduleMetadata: { imports: [FormsModule, InputText] },
    template: `<input pInputText variant="filled" [(ngModel)]="value" aria-label="O.A. rempli" />`,
  }),
};

export const Invalid: Story = {
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.textContent).toContain('Sélectionnez une O.A.'),
    );
  },
  render: () => ({
    props: { value: '' },
    moduleMetadata: {
      imports: [FormsModule, InputText, FormFieldComponent],
    },
    template: `
      <pds-form-field
        label="O.A."
        inputId="gallery-oa-invalid"
        [required]="true"
        [invalid]="true"
        errorMessage="Sélectionnez une O.A."
      >
        <input id="gallery-oa-invalid" pInputText [(ngModel)]="value" [invalid]="true" />
      </pds-form-field>
    `,
  }),
};

export const Disabled: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expectDisabled(input);
  },
  render: () => ({
    props: { value: '319' },
    moduleMetadata: {
      imports: [FormsModule, InputText, FormFieldComponent],
    },
    template: `
      <pds-form-field label="O.A." inputId="gallery-oa-disabled">
        <input id="gallery-oa-disabled" pInputText [(ngModel)]="value" [disabled]="true" />
      </pds-form-field>
    `,
  }),
};

export const WithIcon: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'textbox');
  },
  render: () => ({
    props: { value: 'Eva Martinez' },
    moduleMetadata: {
      imports: [FormsModule, IconField, InputIcon, InputText],
    },
    template: `
      <p-iconfield>
        <p-inputicon>
          <i class="bi bi-search" aria-hidden="true"></i>
        </p-inputicon>
        <input pInputText [(ngModel)]="value" placeholder="Rechercher" aria-label="Rechercher" />
      </p-iconfield>
    `,
  }),
};

export const Group: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'textbox');
    await assertTextVisible(canvasElement, 'NISS');
  },
  render: () => ({
    props: { value: '85.07.30-123.45' },
    moduleMetadata: {
      imports: [FormsModule, InputGroup, InputGroupAddon, InputText],
    },
    template: `
      <p-inputgroup>
        <p-inputgroup-addon>NISS</p-inputgroup-addon>
        <input pInputText [(ngModel)]="value" aria-label="NISS" />
      </p-inputgroup>
    `,
  }),
};

export const SelectField: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Territoire');
  },
  render: () => ({
    props: {
      value: SECTORS[0],
      options: SECTORS,
    },
    moduleMetadata: {
      imports: [FormsModule, Select, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Territoire" inputId="gallery-select">
        <p-select
          inputId="gallery-select"
          appendTo="body"
          [options]="options"
          [(ngModel)]="value"
          optionLabel="label"
          placeholder="Sélectionnez un territoire"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const AutoCompleteField: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Secteur');
  },
  render: () => ({
    props: {
      value: SECTORS[0],
      suggestions: SECTORS,
      search(event: { query: string }) {
        const q = event.query.toLowerCase();
        this['suggestions'] = SECTORS.filter((s) =>
          s.label.toLowerCase().includes(q),
        );
      },
    },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Secteur" inputId="gallery-autocomplete">
        <p-autocomplete
          inputId="gallery-autocomplete"
          appendTo="body"
          [(ngModel)]="value"
          [suggestions]="suggestions"
          (completeMethod)="search($event)"
          optionLabel="label"
          [dropdown]="true"
          dropdownAriaLabel="Afficher les suggestions"
          [forceSelection]="true"
          placeholder="Sélectionnez un secteur"
          size="small"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const DatePickerField: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Filtrer par date');
  },
  render: () => ({
    props: { value: new Date(2025, 10, 24) },
    moduleMetadata: {
      imports: [FormsModule, DatePicker, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Filtrer par date" inputId="gallery-date">
        <p-datepicker
          inputId="gallery-date"
          appendTo="body"
          [(ngModel)]="value"
          dateFormat="dd/mm/yy"
          showIcon="true"
          iconDisplay="input"
          inputStyleClass="o-layout--full-width"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

async function expectDisabled(input: Element | null): Promise<void> {
  const blocked =
    (input as HTMLInputElement | null)?.disabled === true ||
    input?.getAttribute('aria-disabled') === 'true' ||
    input?.getAttribute('data-p-disabled') === 'true';
  await expect(blocked).toBe(true);
}
