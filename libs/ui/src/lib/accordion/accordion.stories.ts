import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionModule } from 'primeng/accordion';
import { Tag } from 'primeng/tag';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { statusStory } from '../../docs/docs-figure-stories';

interface AccordionStoryArgs {
  title: string;
  statusLabel: string;
  expanded: boolean;
  disabled: boolean;
}

const STOCK_CLASS = 'o-layout--full-width o-layout--min-w-0';
const BORDERED_CLASS = 'c-accordion--bordered o-layout--full-width o-layout--min-w-0';

const meta: Meta<AccordionStoryArgs> = {
  title: 'Custom components/Accordion',
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text', description: 'Panel header label.' },
    statusLabel: {
      control: 'text',
      description: 'Status tag next to the header.',
    },
    expanded: {
      control: 'boolean',
      description: 'When true, the panel value is set so the section is open.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables p-accordion-panel.',
    },
  },
  args: {
    title: 'Certificat ITT',
    statusLabel: 'Accepté',
    expanded: true,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<AccordionStoryArgs>;

/** Ownership badge for the docs page — CSS-only block, so declared inline. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

function accordionTemplate(hostClass: string): string {
  return `
    <p-accordion
      class="${hostClass}"
      [value]="expanded ? '0' : undefined"
      expandIcon="bi bi-chevron-down"
      collapseIcon="bi bi-chevron-up"
    >
      <p-accordion-panel value="0" [disabled]="disabled">
        <p-accordion-header>
          <span class="o-flex o-flex--align-items-center o-layout--gap-2">
            <span>{{ title }}</span>
            <p-tag severity="success" icon="bi bi-check-lg" [value]="statusLabel" />
          </span>
        </p-accordion-header>
        <p-accordion-content>
          <p class="o-layout--margin-0">Date de réception 24/11/2025</p>
        </p-accordion-content>
      </p-accordion-panel>
    </p-accordion>
  `;
}

function renderWithClass(hostClass: string): Story['render'] {
  return (args) => ({
    props: args,
    moduleMetadata: { imports: [AccordionModule, Tag] },
    template: accordionTemplate(hostClass),
  });
}

export const Default: Story = {
  render: renderWithClass(STOCK_CLASS),
  // Interaction test: the header toggles the panel and mirrors it on aria-expanded.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('button', { name: /Certificat ITT/ });
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(header);
    await waitFor(() => expect(header).toHaveAttribute('aria-expanded', 'false'));
    await userEvent.click(header);
    await waitFor(() => expect(header).toHaveAttribute('aria-expanded', 'true'));
  },
};

export const Bordered: Story = {
  render: renderWithClass(BORDERED_CLASS),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: /Certificat ITT/ }),
    ).toHaveAttribute('aria-expanded', 'true');
  },
};

export const Collapsed: Story = {
  render: renderWithClass(BORDERED_CLASS),
  args: { expanded: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('button', { name: /Certificat ITT/ });
    await expect(header).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Disabled: Story = {
  render: renderWithClass(BORDERED_CLASS),
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('button', { name: /Certificat ITT/ });
    const blocked =
      (header as HTMLButtonElement).disabled ||
      header.getAttribute('aria-disabled') === 'true' ||
      header.getAttribute('data-p-disabled') === 'true' ||
      header.closest('[data-p-disabled="true"], .p-disabled') !== null;
    await expect(blocked).toBe(true);
  },
};

export const Stacked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const second = canvas.getByRole('button', { name: /Certificat de reprise/ });
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(second);
    await waitFor(() => expect(second).toHaveAttribute('aria-expanded', 'true'));
  },
  render: () => ({
    props: { value: ['0'] },
    moduleMetadata: { imports: [AccordionModule, Tag] },
    template: `
      <p-accordion
        class="c-accordion--bordered o-layout--full-width o-layout--min-w-0"
        [multiple]="true"
        [value]="value"
        expandIcon="bi bi-chevron-down"
        collapseIcon="bi bi-chevron-up"
      >
        <p-accordion-panel value="0">
          <p-accordion-header>
            <span class="o-flex o-flex--align-items-center o-layout--gap-2">
              <span>Certificat ITT</span>
              <p-tag severity="success" icon="bi bi-check-lg" value="Accepté" />
            </span>
          </p-accordion-header>
          <p-accordion-content>
            <p class="o-layout--margin-0">Date de réception 24/11/2025</p>
          </p-accordion-content>
        </p-accordion-panel>
        <p-accordion-panel value="1">
          <p-accordion-header>Certificat de reprise</p-accordion-header>
          <p-accordion-content>
            <p class="o-layout--margin-0">Date de réception 27/12/2025</p>
          </p-accordion-content>
        </p-accordion-panel>
      </p-accordion>
    `,
  }),
};
