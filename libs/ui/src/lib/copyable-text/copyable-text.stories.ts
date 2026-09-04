import { Component, inject, input } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import type { IconSize } from '../icon/icon.types';
import { showStorybookToast } from '../../storybook/storybook-toast';
import { CopyableTextComponent } from './copyable-text.component';

@Component({
  selector: 'pds-copyable-text-toast-demo',
  standalone: true,
  imports: [CopyableTextComponent],
  template: `
    <pds-copyable-text
      [label]="label()"
      [value]="value()"
      [ariaLabel]="ariaLabel()"
      [iconSize]="iconSize()"
      [disabled]="disabled()"
      (copied)="onCopied($event)"
    />
  `,
})
class CopyableTextToastDemoComponent {
  constructor() {
    registerPlectrumIcons(inject(IconRegistry));
  }

  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly iconSize = input<IconSize>('xs');
  readonly disabled = input(false);

  onCopied(value: string): void {
    showStorybookToast({
      summary: 'Copié !',
      detail: `${this.label()}: ${value}`,
    });
  }
}

@Component({
  selector: 'pds-copyable-text-row-demo',
  standalone: true,
  imports: [CopyableTextComponent],
  template: `
    <div class="o-flex o-flex--align-items-center o-layout--gap-1 o-flex--wrap">
      <pds-copyable-text
        label="Territoire"
        value="319"
        [iconSize]="iconSize()"
        (copied)="onCopied('Territoire', $event)"
      />
      <span class="c-copyable-text__separator" aria-hidden="true">•</span>
      <pds-copyable-text
        label="NISS"
        value="85010112345"
        [iconSize]="iconSize()"
        (copied)="onCopied('NISS', $event)"
      />
      <span class="c-copyable-text__separator" aria-hidden="true">•</span>
      <pds-copyable-text
        label="NSI"
        value="A-123456"
        [iconSize]="iconSize()"
        (copied)="onCopied('NSI', $event)"
      />
    </div>
  `,
})
class CopyableTextRowDemoComponent {
  constructor() {
    registerPlectrumIcons(inject(IconRegistry));
  }

  readonly iconSize = input<IconSize>('sm');

  onCopied(label: string, value: string): void {
    showStorybookToast({
      summary: 'Copié !',
      detail: `${label}: ${value}`,
    });
  }
}

const meta: Meta<CopyableTextComponent> = {
  tags: ['!dev'],
  title: 'Custom components/Copyable Text',
  component: CopyableTextComponent,
  decorators: [
    moduleMetadata({
      imports: [CopyableTextToastDemoComponent, CopyableTextRowDemoComponent],
    }),
  ],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    ariaLabel: { control: 'text' },
    iconSize: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <pds-copyable-text-toast-demo
        [label]="label"
        [value]="value"
        [ariaLabel]="ariaLabel"
        [iconSize]="iconSize"
        [disabled]="disabled"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<CopyableTextComponent>;

export const Default: Story = {
  args: {
    label: 'Territoire',
    value: '319',
    iconSize: 'xs',
    disabled: false,
  },
};

export const IdentifierRow: Story = {
  render: (args) => ({
    props: args,
    template: `<pds-copyable-text-row-demo [iconSize]="iconSize" />`,
  }),
  args: {
    iconSize: 'sm',
  },
};

export const CustomAriaLabel: Story = {
  args: {
    label: 'Territoire',
    value: '319',
    ariaLabel: 'Copier le numéro de territoire 319',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Territoire',
    value: '319',
    disabled: true,
  },
};
