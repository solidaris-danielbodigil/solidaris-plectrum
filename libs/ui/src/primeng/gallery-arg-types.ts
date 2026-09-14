import type { ArgTypes } from 'storybook/internal/csf';
import {
  argTypesFromProps,
  type ArgTypeProp,
} from '../storybook/arg-types-from-props';

function primeNgApi(props: readonly ArgTypeProp[]): ArgTypes {
  return argTypesFromProps(
    props.map((prop) => ({
      ...prop,
      category: 'PrimeNG' as const,
      control: false,
    })),
  );
}

/** Documented PrimeNG props shown on each gallery page — not a Plectrum wrapper. */
export const ACTIONS_API = primeNgApi([
  {
    name: 'label',
    type: 'string',
    required: false,
    description: 'Button text. Icon-only buttons need ariaLabel instead.',
  },
  {
    name: 'severity',
    type: 'ButtonSeverity',
    required: false,
    default: 'primary',
    description:
      'Visual meaning — primary, secondary, success, info, warn, danger, contrast.',
  },
  {
    name: 'outlined',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Outlined (ghost) treatment.',
  },
  {
    name: 'text',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Text-only treatment (no fill, no border).',
  },
  {
    name: 'link',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Link treatment.',
  },
  {
    name: 'size',
    type: "'small' | 'large' | undefined",
    required: false,
    default: 'undefined',
    description: 'Prefer small in toolbars; default size on page actions.',
  },
  {
    name: 'icon',
    type: 'string',
    required: false,
    description: 'Bootstrap Icons class (bi bi-*), never PrimeIcons.',
  },
  {
    name: 'loading',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Shows the PrimeNG loading spinner on the button.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Disables the action.',
  },
]);

export const FORMS_API = primeNgApi([
  {
    name: 'placeholder',
    type: 'string',
    required: false,
    description:
      'Empty-state hint on pInputText, Select, AutoComplete, DatePicker.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Disables the control.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    required: false,
    default: 'false',
    description:
      'Invalid treatment — pair with pds-form-field for the label and error.',
  },
  {
    name: 'fluid',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Stretches the control to the field width.',
  },
  {
    name: 'showClear',
    type: 'boolean',
    required: false,
    default: 'false',
    description:
      'Native clear on Select / AutoComplete / DatePicker. Use pds-input-clear on pInputText.',
  },
]);

export const DATA_API = primeNgApi([
  {
    name: 'value',
    type: 'unknown[]',
    required: false,
    description: 'Rows for p-table, nodes for p-tree, events for p-timeline.',
  },
  {
    name: 'sortMode',
    type: "'single' | 'multiple'",
    required: false,
    description: 'p-table header sorting.',
  },
  {
    name: 'width / height / size',
    type: 'string',
    required: false,
    description: 'p-skeleton dimensions. Prefer wrapping with c-skeleton-slot.',
  },
  {
    name: 'align',
    type: "'left' | 'right' | 'alternate'",
    required: false,
    default: 'left',
    description:
      'p-timeline alignment. Content-only restyle lives on Custom components/Timeline.',
  },
]);

export const OVERLAYS_API = primeNgApi([
  {
    name: 'visible',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Open state on Dialog, Drawer, Popover.',
  },
  {
    name: 'appendTo',
    type: 'HTMLElement | string',
    required: false,
    default: 'body',
    description:
      'Required as body so flex and overflow-hidden layouts do not clip the overlay.',
  },
  {
    name: 'header',
    type: 'string',
    required: false,
    description: 'Dialog title.',
  },
  {
    name: 'modal',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Backdrop mask on Dialog and Drawer.',
  },
  {
    name: 'position',
    type: 'DrawerPosition',
    required: false,
    default: 'right',
    description: 'Edge the Drawer slides in from.',
  },
  {
    name: 'tooltip',
    type: 'string',
    required: false,
    description: 'pTooltip text on the trigger.',
  },
]);

export const CONTENT_API = primeNgApi([
  {
    name: 'value',
    type: 'string | number | MenuItem[]',
    required: false,
    description: 'Tag / Badge text, Breadcrumb items, or Tabs / Stepper value.',
  },
  {
    name: 'severity',
    type: 'TagSeverity | MessageSeverity',
    required: false,
    description: 'Tag, Badge, and Message meaning.',
  },
  {
    name: 'icon',
    type: 'string',
    required: false,
    description: 'Bootstrap Icons class on Tag or Message.',
  },
  {
    name: 'closable',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Message dismiss control.',
  },
]);
