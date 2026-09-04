import { Component, inject, input, signal } from '@angular/core';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import {
  AffiliateOverviewCardComponent,
  type AffiliateOverviewCardVariant,
  type AffiliateOverviewIdentifier,
  type AffiliateOverviewInfoTag,
  type AffiliateOverviewPrimaryAction,
  type AffiliateOverviewStatusAction,
} from './affiliate-overview-card.component';
import { SIMULATED_LOADING_MS } from '../../storybook/simulated-loading';

// =============================================================================
// Affiliate Overview Card
// Design ref: Figma node 507:7910 / 507:7915 / 507:8227 (iSHARE-Audit)
// =============================================================================

const FIGMA_IDENTIFIERS: AffiliateOverviewIdentifier[] = [
  { label: 'Territoire', value: '319' },
  { label: 'NSI', value: '00004212182' },
  { label: 'N° de contrat', value: '1241786-19630928-2' },
  { label: 'NISS', value: '63092814612' },
];

const DEFAULT_IDENTIFIERS: AffiliateOverviewIdentifier[] = [
  { label: 'NISS', value: '85.12.30-123.45' },
  { label: 'NSI', value: '12345678901' },
  { label: 'Mutuelle', value: 'Solidaris Liège' },
  { label: 'Statut affilié', value: 'Actif' },
];

// Filterable tags (filterKey set) render as a single p-selectbutton group bound to the active filter;
// display-only tags (no filterKey) render as non-interactive pButton chips.
const DEFAULT_INFO_TAGS: AffiliateOverviewInfoTag[] = [
  {
    label: 'Dernière action:',
    value: 'Consultation 02/06/2026',
    filterKey: 'last-action',
  },
  {
    label: 'Documents actifs:',
    value: '2',
    filterKey: 'active-documents',
    active: true,
  },
  { label: 'Documents clôturés:', value: '1', filterKey: 'closed-documents' },
];

const DEFAULT_PRIMARY_ACTION: AffiliateOverviewPrimaryAction = {
  label: 'Voir carte affilié',
  icon: 'bi bi-eye',
  shortcut: 'ALT + A',
};

interface AffiliateOverviewCardStoryArgs {
  title: string;
  avatarInitials: string;
  avatarGender: 'female' | 'male' | 'other';
  avatarVariant: 1 | 2 | 3;
  variant: AffiliateOverviewCardVariant;
  statusAction?: AffiliateOverviewStatusAction | null;
  infoTags: AffiliateOverviewInfoTag[];
  identifiers: AffiliateOverviewIdentifier[];
  primaryAction?: AffiliateOverviewPrimaryAction | null;
  loading: boolean;
}

@Component({
  selector: 'pds-affiliate-overview-card-copy-demo',
  standalone: true,
  imports: [AffiliateOverviewCardComponent, Toast],
  providers: [MessageService],
  template: `
    <p-toast />
    <pds-affiliate-overview-card
      [title]="title()"
      [avatarInitials]="avatarInitials()"
      [avatarGender]="avatarGender()"
      [avatarVariant]="avatarVariant()"
      [variant]="variant()"
      [statusAction]="statusAction()"
      [infoTags]="infoTags()"
      [identifiers]="identifiers()"
      [primaryAction]="primaryAction()"
      [loading]="loading()"
      (identifierCopy)="onIdentifierCopy($event)"
    />
  `,
})
class AffiliateOverviewCardCopyDemoComponent {
  private readonly messageService = inject(MessageService);

  readonly title = input.required<string>();
  readonly avatarInitials = input<string>('');
  readonly avatarGender = input<'female' | 'male' | 'other'>('female');
  readonly avatarVariant = input<1 | 2 | 3>(1);
  readonly variant = input<AffiliateOverviewCardVariant>('default');
  readonly statusAction = input<AffiliateOverviewStatusAction | null>(null);
  readonly infoTags = input<AffiliateOverviewInfoTag[]>([]);
  readonly identifiers = input<AffiliateOverviewIdentifier[]>([]);
  readonly primaryAction = input<AffiliateOverviewPrimaryAction | null>(null);
  readonly loading = input<boolean>(false);

  onIdentifierCopy(identifier: AffiliateOverviewIdentifier): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
      life: 2000,
    });
  }
}

const plectrumIconProviders = [
  {
    provide: IconRegistry,
    useFactory: () => {
      const registry = new IconRegistry();
      registerPlectrumIcons(registry);
      return registry;
    },
  },
];

const meta: Meta<AffiliateOverviewCardStoryArgs> = {
  title: 'UI/Affiliate Overview Card',
  component: AffiliateOverviewCardComponent,
  tags: ['!dev'],
  decorators: [
    moduleMetadata({
      imports: [AffiliateOverviewCardComponent],
      providers: plectrumIconProviders,
    }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 56rem">${story}</div>`,
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'in-order', 'warning', 'danger'],
      description:
        'Fallback card treatment when statusAction is absent. Overridden by statusAction.severity when set.',
    },
    title: {
      control: 'text',
      description: 'Affiliate display name (card heading).',
    },
    avatarInitials: {
      control: 'text',
      description:
        'Initials rendered in the Plectrum avatar (small variant fallback).',
    },
    avatarGender: {
      control: 'select',
      options: ['female', 'male', 'other'],
      description: 'Illustrated avatar gender passed to pds-plectrum-avatar.',
    },
    avatarVariant: {
      control: 'select',
      options: [1, 2, 3],
      description: 'Illustrated avatar variant passed to pds-plectrum-avatar.',
    },
    statusAction: {
      control: 'object',
      description:
        'Outlined status button with severity (success | warn | danger). Drives card gradient when set.',
    },
    infoTags: {
      control: 'object',
      description:
        'Header info tags. Filterable tags (filterKey set) render as a single p-selectbutton group bound to the active filter; display-only tags render as non-interactive pButton chips.',
    },
    identifiers: {
      control: 'object',
      description:
        'Copyable identifier chips with 10.5px copy icon in the metadata row.',
    },
    primaryAction: {
      control: 'object',
      description:
        'Secondary header button with optional keyboard shortcut badge.',
    },
    loading: {
      control: 'boolean',
      description:
        'Skeleton placeholder with large avatar (56px) and disabled actions.',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <pds-affiliate-overview-card
        [title]="title"
        [avatarInitials]="avatarInitials"
        [avatarGender]="avatarGender"
        [avatarVariant]="avatarVariant"
        [variant]="variant"
        [statusAction]="statusAction"
        [infoTags]="infoTags"
        [identifiers]="identifiers"
        [primaryAction]="primaryAction"
        [loading]="loading"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<AffiliateOverviewCardStoryArgs>;

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Dupont, Marie',
    avatarInitials: 'DM',
    avatarGender: 'female',
    avatarVariant: 1,
    infoTags: DEFAULT_INFO_TAGS,
    identifiers: DEFAULT_IDENTIFIERS,
    primaryAction: DEFAULT_PRIMARY_ACTION,
    loading: false,
  },
};

export const InOrder: Story = {
  args: {
    variant: 'in-order',
    title: 'Dupont, Marie',
    avatarInitials: 'DM',
    avatarGender: 'female',
    avatarVariant: 1,
    infoTags: [
      {
        label: 'Dernière action:',
        value: 'Validation 01/06/2026',
        filterKey: 'last-action',
      },
      { label: 'Documents actifs:', value: '1', filterKey: 'active-documents' },
      {
        label: 'Documents clôturés:',
        value: '0',
        filterKey: 'closed-documents',
      },
    ],
    identifiers: DEFAULT_IDENTIFIERS,
    primaryAction: DEFAULT_PRIMARY_ACTION,
    loading: false,
  },
};

export const Warning: Story = {
  args: {
    variant: 'default',
    title: 'Eva Martinez',
    avatarInitials: 'EM',
    avatarGender: 'female',
    avatarVariant: 1,
    statusAction: {
      label: 'C4 non reçu',
      tagValue: 'C4',
      icon: 'bi bi-exclamation-triangle-fill',
      severity: 'warn',
      ariaLabel: 'Voir le détail — C4 non reçu',
    },
    infoTags: [
      {
        label: 'Dernière action:',
        value: 'Document reçu 12/04/2026',
        filterKey: 'last-action',
      },
      {
        label: 'Documents actifs:',
        value: '3',
        filterKey: 'active-documents',
        active: true,
      },
      {
        label: 'Documents clôturés:',
        value: '3',
        filterKey: 'closed-documents',
      },
    ],
    identifiers: FIGMA_IDENTIFIERS,
    primaryAction: {
      label: 'Voir carte affilié',
      icon: 'bi bi-eye',
      shortcut: 'ALT + A',
    },
    loading: false,
  },
};

export const MultipleStatusActions: Story = {
  args: {
    ...Warning.args,
    statusAction: {
      label: 'Actions à réaliser',
      icon: 'bi bi-exclamation-triangle-fill',
      severity: 'warn',
      menuItems: [
        { label: 'C4 non reçu' },
        { label: 'Paiement non versé' },
        { label: 'Document manquant' },
      ],
    },
  },
};

export const Danger: Story = {
  args: {
    variant: 'default',
    title: 'Lambert, Sophie',
    avatarInitials: 'LS',
    avatarGender: 'female',
    avatarVariant: 1,
    statusAction: {
      label: 'Critique',
      icon: 'bi bi-exclamation-octagon-fill',
      severity: 'danger',
    },
    infoTags: [
      {
        label: 'Dernière action:',
        value: 'Incohérence détectée 28/05/2026',
        filterKey: 'last-action',
      },
      { label: 'Documents actifs:', value: '0', filterKey: 'active-documents' },
      {
        label: 'Documents clôturés:',
        value: '2',
        filterKey: 'closed-documents',
      },
    ],
    identifiers: [
      { label: 'NISS', value: '92.08.22-789.01' },
      { label: 'NSI', value: '—' },
      { label: 'Mutuelle', value: 'Solidaris Hainaut' },
      { label: 'Statut affilié', value: 'En attente de validation' },
    ],
    primaryAction: DEFAULT_PRIMARY_ACTION,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    variant: 'default',
    title: 'Dupont, Marie',
    avatarInitials: 'DM',
    avatarGender: 'female',
    avatarVariant: 1,
    infoTags: DEFAULT_INFO_TAGS,
    identifiers: DEFAULT_IDENTIFIERS,
    primaryAction: DEFAULT_PRIMARY_ACTION,
    loading: true,
  },
};

@Component({
  selector: 'pds-affiliate-overview-card-simulated-loading-demo',
  standalone: true,
  imports: [AffiliateOverviewCardComponent],
  template: `
    <pds-affiliate-overview-card
      [loading]="loading()"
      variant="warning"
      title="Dupont, Marie"
      avatarInitials="DM"
      avatarGender="female"
      [avatarVariant]="1"
      [statusAction]="statusAction"
      [infoTags]="infoTags"
      [identifiers]="identifiers"
      [primaryAction]="primaryAction"
    />
  `,
})
class AffiliateOverviewCardSimulatedLoadingDemoComponent {
  readonly loading = signal(true);
  readonly statusAction: AffiliateOverviewStatusAction = {
    label: 'C4 non reçu',
    tagValue: 'C4',
    icon: 'bi bi-exclamation-triangle-fill',
    severity: 'warn',
    ariaLabel: 'Voir le détail — C4 non reçu',
  };
  readonly infoTags = DEFAULT_INFO_TAGS;
  readonly identifiers = DEFAULT_IDENTIFIERS;
  readonly primaryAction = DEFAULT_PRIMARY_ACTION;

  constructor() {
    setTimeout(() => this.loading.set(false), SIMULATED_LOADING_MS);
  }
}

export const SimulatedLoading: Story = {
  decorators: [
    moduleMetadata({
      imports: [AffiliateOverviewCardSimulatedLoadingDemoComponent],
      providers: plectrumIconProviders,
    }),
  ],
  render: () => ({
    template: '<pds-affiliate-overview-card-simulated-loading-demo />',
  }),
};

export const WrappedLayout: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div class="sb-demo-wrapper" style="max-width: 24rem">${story}</div>`,
    ),
  ],
  args: {
    variant: 'default',
    title:
      'Eva Martinez avec un nom très long pour forcer le retour à la ligne',
    avatarInitials: 'EM',
    avatarGender: 'female',
    avatarVariant: 1,
    statusAction: {
      label: 'C4 non reçu',
      tagValue: 'C4',
      icon: 'bi bi-exclamation-triangle-fill',
      severity: 'warn',
      ariaLabel: 'Voir le détail — C4 non reçu',
    },
    infoTags: [
      {
        label: 'Dernière action:',
        value: 'Document reçu 12/04/2026',
        filterKey: 'last-action',
      },
      { label: 'Documents actifs:', value: '3', filterKey: 'active-documents' },
      {
        label: 'Documents clôturés:',
        value: '3',
        filterKey: 'closed-documents',
      },
    ],
    identifiers: FIGMA_IDENTIFIERS,
    primaryAction: DEFAULT_PRIMARY_ACTION,
    loading: false,
  },
};

export const CopyWithToast: Story = {
  decorators: [
    moduleMetadata({ imports: [AffiliateOverviewCardCopyDemoComponent] }),
    componentWrapperDecorator(
      (story) =>
        `<div class="sb-demo-wrapper" style="max-width: 56rem">${story}</div>`,
    ),
  ],
  render: (args) => ({
    props: args,
    template: `
      <pds-affiliate-overview-card-copy-demo
        [title]="title"
        [avatarInitials]="avatarInitials"
        [avatarGender]="avatarGender"
        [avatarVariant]="avatarVariant"
        [variant]="variant"
        [statusAction]="statusAction"
        [infoTags]="infoTags"
        [identifiers]="identifiers"
        [primaryAction]="primaryAction"
        [loading]="loading"
      />
    `,
  }),
  args: {
    variant: 'default',
    title: 'Dupont, Marie',
    avatarInitials: 'DM',
    avatarGender: 'female',
    avatarVariant: 1,
    infoTags: DEFAULT_INFO_TAGS,
    identifiers: DEFAULT_IDENTIFIERS,
    primaryAction: DEFAULT_PRIMARY_ACTION,
    loading: false,
  },
};
