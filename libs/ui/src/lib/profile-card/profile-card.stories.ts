import { Component, inject, input, signal } from '@angular/core';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular-vite';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import {
  ProfileCardComponent,
  type ProfileCardVariant,
  type ProfileCardIdentifier,
  type ProfileCardInfoTag,
  type ProfileCardPrimaryAction,
  type ProfileCardStatusAction,
} from './profile-card.component';
import { ProfileCardMetadata } from './profile-card.metadata';
import { SIMULATED_LOADING_MS } from '../../storybook/simulated-loading';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { assertTextVisible } from '../../storybook/story-tests';

// =============================================================================
// Affiliate Overview Card
// Design ref: Figma node 507:7910 / 507:7915 / 507:8227 (iSHARE-Audit)
// =============================================================================

const FIGMA_IDENTIFIERS: ProfileCardIdentifier[] = [
  { label: 'Territoire', value: '319' },
  { label: 'NSI', value: '00004212182' },
  { label: 'N° de contrat', value: '1241786-19630928-2' },
  { label: 'NISS', value: '63092814612' },
];

const DEFAULT_IDENTIFIERS: ProfileCardIdentifier[] = [
  { label: 'NISS', value: '85.12.30-123.45' },
  { label: 'NSI', value: '12345678901' },
  { label: 'Mutuelle', value: 'Solidaris Liège' },
  { label: 'Statut affilié', value: 'Actif' },
];

// Filterable tags (filterKey set) render as a single p-selectbutton group bound to the active filter;
// display-only tags (no filterKey) render as non-interactive pButton chips.
const DEFAULT_INFO_TAGS: ProfileCardInfoTag[] = [
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

const DEFAULT_PRIMARY_ACTION: ProfileCardPrimaryAction = {
  label: 'Voir carte affilié',
  icon: 'bi bi-eye',
  shortcut: 'ALT + A',
};

interface ProfileCardCardStoryArgs {
  title: string;
  avatarInitials: string;
  avatarGender: 'female' | 'male' | 'other';
  avatarVariant: 1 | 2 | 3;
  variant: ProfileCardVariant;
  statusAction?: ProfileCardStatusAction | null;
  infoTags: ProfileCardInfoTag[];
  identifiers: ProfileCardIdentifier[];
  primaryAction?: ProfileCardPrimaryAction | null;
  loading: boolean;
}

@Component({
  selector: 'pds-profile-card-copy-demo',
  standalone: true,
  imports: [ProfileCardComponent, Toast],
  providers: [MessageService],
  template: `
    <p-toast />
    <pds-profile-card
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
class ProfileCardCardCopyDemoComponent {
  private readonly messageService = inject(MessageService);

  readonly title = input.required<string>();
  readonly avatarInitials = input<string>('');
  readonly avatarGender = input<'female' | 'male' | 'other'>('female');
  readonly avatarVariant = input<1 | 2 | 3>(1);
  readonly variant = input<ProfileCardVariant>('default');
  readonly statusAction = input<ProfileCardStatusAction | null>(null);
  readonly infoTags = input<ProfileCardInfoTag[]>([]);
  readonly identifiers = input<ProfileCardIdentifier[]>([]);
  readonly primaryAction = input<ProfileCardPrimaryAction | null>(null);
  readonly loading = input<boolean>(false);

  onIdentifierCopy(identifier: ProfileCardIdentifier): void {
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

const meta: Meta<ProfileCardCardStoryArgs> = {
  title: 'Custom components/Profile Card',
  component: ProfileCardComponent,
  decorators: [
    moduleMetadata({
      imports: [ProfileCardComponent],
      providers: plectrumIconProviders,
    }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 56rem">${story}</div>`,
    ),
  ],
  parameters: {
    layout: 'padded',
    ...storyDesign(ProfileCardMetadata.component.figmaUrl),
  },
  argTypes: argTypesFromProps(ProfileCardMetadata.props ?? [], {
    variant: { control: 'select', options: ['default', 'in-order', 'warning', 'danger'] },
    avatarGender: { control: 'select', options: ['female', 'male', 'other'] },
    avatarVariant: { control: 'select', options: [1, 2, 3] },
  }),
  render: (args) => ({
    props: args,
    template: `
      <pds-profile-card
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

type Story = StoryObj<ProfileCardCardStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from profile-card.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(ProfileCardMetadata.governance, ProfileCardMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(ProfileCardMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(ProfileCardMetadata, 'anatomy') };
export const Variants = { tags: ['!dev'], ...contractStory(ProfileCardMetadata, 'variants') };
export const Composition = { tags: ['!dev'], ...contractStory(ProfileCardMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(ProfileCardMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(ProfileCardMetadata, 'accessibility') };

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
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Dupont, Marie');
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
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Dupont, Marie');
    await assertTextVisible(canvasElement, 'Validation 01/06/2026');
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

export const Dutch: Story = {
  globals: { locale: 'nl' },
  args: {
    ...Warning.args,
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Uit te voeren acties:');
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
  selector: 'pds-profile-card-simulated-loading-demo',
  standalone: true,
  imports: [ProfileCardComponent],
  template: `
    <pds-profile-card
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
class ProfileCardCardSimulatedLoadingDemoComponent {
  readonly loading = signal(true);
  readonly statusAction: ProfileCardStatusAction = {
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
      imports: [ProfileCardCardSimulatedLoadingDemoComponent],
      providers: plectrumIconProviders,
    }),
  ],
  render: () => ({
    template: '<pds-profile-card-simulated-loading-demo />',
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
    moduleMetadata({ imports: [ProfileCardCardCopyDemoComponent] }),
    componentWrapperDecorator(
      (story) =>
        `<div class="sb-demo-wrapper" style="max-width: 56rem">${story}</div>`,
    ),
  ],
  render: (args) => ({
    props: args,
    template: `
      <pds-profile-card-copy-demo
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
