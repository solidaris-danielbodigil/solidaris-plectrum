import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular-vite';
import type { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { OverlayBadge } from 'primeng/overlaybadge';
import { SelectButton } from 'primeng/selectbutton';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { SIMULATED_LOADING_MS } from '../../storybook/simulated-loading';
import { storyDesign } from '../../storybook/story-design';
import { showStorybookToast } from '../../storybook/storybook-toast';
import {
  assertTextVisible,
  expect,
  expectFocus,
  fn,
  pressEscape,
  stubClipboard,
  tabTo,
  userEvent,
  waitFor,
  waitForText,
  within,
} from '../../storybook/story-tests';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import type { PlectrumAvatarGender, PlectrumAvatarVariant } from '../plectrum-avatar/plectrum-avatar.types';
import { ProfileHeaderComponent } from './profile-header.component';
import { ProfileHeaderMetadata } from './profile-header.metadata';
import type {
  ProfileHeaderIdentifier,
  ProfileHeaderInfoTag,
  ProfileHeaderPrimaryAction,
  ProfileHeaderStatusAction,
  ProfileHeaderVariant,
} from './profile-header.types';

// =============================================================================
// Profile header — Figma IRkr21rHS0w7rI0bgrv1fZ node 2438:10587
// Anatomy 2587:997 · status splitbutton 2371:3075 · identifier chip 2443:4217
// =============================================================================

const IDENTIFIERS: ProfileHeaderIdentifier[] = [
  { label: 'Territoire', value: '319' },
  { label: 'NSI', value: '00004212182' },
  { label: 'N° de contrat', value: '1241786-19630928-2' },
  { label: 'NISS', value: '63092814612' },
];

// Filterable tags (filterKey) are toggle buttons; tags without filterKey are display-only.
const INFO_TAGS: ProfileHeaderInfoTag[] = [
  { label: 'Dernière action:', value: '09/06/2026', filterKey: 'last-action' },
  { label: 'Documents actifs:', value: '6', filterKey: 'active-documents', active: true },
  { label: 'Documents clôturés:', value: '1', filterKey: 'closed-documents' },
];

const PRIMARY_ACTION: ProfileHeaderPrimaryAction = {
  label: 'Voir carte affilié',
  shortcut: 'ALT + A',
};

// ariaLabel starts with the visible « Actions à réaliser: C4 » (WCAG 2.5.3 label in name).
const WARNING_STATUS: ProfileHeaderStatusAction = {
  label: 'C4 non reçu',
  tagValue: 'C4',
  severity: 'warn',
  ariaLabel: 'Actions à réaliser: C4 — voir le détail du C4 non reçu',
};
const WARNING_STATUS_NAME = 'Actions à réaliser: C4 — voir le détail du C4 non reçu';

const STATUS_MENU: MenuItem[] = [
  { id: 'c4', label: 'C4 non reçu' },
  { id: 'payment', label: 'Paiement non versé' },
  { id: 'placeholder', label: "Exemple d'autre action à réaliser", disabled: true },
];

interface ProfileHeaderStoryArgs {
  title: string;
  avatarInitials: string;
  avatarGender: PlectrumAvatarGender;
  avatarVariant: PlectrumAvatarVariant;
  variant: ProfileHeaderVariant;
  statusAction: ProfileHeaderStatusAction | null;
  infoTags: ProfileHeaderInfoTag[];
  identifiers: ProfileHeaderIdentifier[];
  primaryAction: ProfileHeaderPrimaryAction | null;
  loading: boolean;
  primaryActionClick: (value: void) => void;
  statusActionClick: (value: void) => void;
  infoTagClick: (tag: ProfileHeaderInfoTag) => void;
  identifierCopy: (identifier: ProfileHeaderIdentifier) => void;
  statusMenuSelect: (item: MenuItem) => void;
}

const BASE_ARGS: ProfileHeaderStoryArgs = {
  title: 'Eva Martinez',
  avatarInitials: 'EM',
  avatarGender: 'female',
  avatarVariant: 1,
  variant: 'default',
  statusAction: null,
  infoTags: INFO_TAGS,
  identifiers: IDENTIFIERS,
  primaryAction: PRIMARY_ACTION,
  loading: false,
  primaryActionClick: fn(),
  statusActionClick: fn(),
  infoTagClick: fn(),
  identifierCopy: fn(),
  statusMenuSelect: fn(),
};

const HEADER_BINDINGS = `
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
  (primaryActionClick)="primaryActionClick($event)"
  (statusActionClick)="statusActionClick($event)"
  (infoTagClick)="infoTagClick($event)"
  (identifierCopy)="identifierCopy($event)"
  (statusMenuSelect)="statusMenuSelect($event)"
`;

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

// Example slot content — the Figma icon actions, action buttons, A-valoir
// panel, tabs and view switch. The header lays it out; it owns no logic for it.
const SLOT_CONTENT = `
  <div slot="actions" class="o-flex o-flex--align-items-center o-layout o-layout--gap-2">
    <p-overlaybadge value="2" severity="warn">
      <p-button icon="bi bi-lightbulb" [text]="true" severity="secondary" ariaLabel="Suggestions" />
    </p-overlaybadge>
    <p-button icon="bi bi-envelope" [text]="true" severity="secondary" ariaLabel="Messages" />
    <p-button icon="bi bi-calendar" [text]="true" severity="secondary" ariaLabel="Agenda" />
    <p-overlaybadge value="2" severity="warn">
      <p-button icon="bi bi-journal-text" [text]="true" severity="secondary" ariaLabel="Notes" />
    </p-overlaybadge>
  </div>
  <div slot="actions" class="o-flex o-flex--align-items-center o-layout o-layout--gap-2">
    <p-button icon="bi bi-three-dots-vertical" [outlined]="true" ariaLabel="Plus d'actions" />
    <p-button label="D360" icon="bi bi-box-arrow-up-right" iconPos="right" [outlined]="true" />
    <p-button label="Nieuwe actie" icon="bi bi-plus-lg" iconPos="right" />
  </div>
  <p-card slot="aside" styleClass="sb-profile-header-aside-card">
    <div class="o-flex o-flex--y o-flex--align-items-center o-layout o-layout--gap-1">
      <span class="u-text-body-sm">A-valoir</span>
      <span class="u-text-display-md">€ 65.00</span>
    </div>
  </p-card>
  <p-tabs slot="nav" value="dossier">
    <p-tablist>
      <p-tab value="dossier">Dossier</p-tab>
      <p-tab value="documents">Documents</p-tab>
      <p-tab value="paiements">Paiements</p-tab>
      <p-tab value="historique">Historique</p-tab>
    </p-tablist>
    <!-- The shell renders each view below the header; the panels keep tab ↔ tabpanel ARIA valid. -->
    <p-tabpanels>
      <p-tabpanel value="dossier" />
      <p-tabpanel value="documents" />
      <p-tabpanel value="paiements" />
      <p-tabpanel value="historique" />
    </p-tabpanels>
  </p-tabs>
  <p-selectbutton slot="nav-end" [options]="views" [(ngModel)]="view" [allowEmpty]="false" aria-label="Vue" />
`;

const meta: Meta<ProfileHeaderStoryArgs> = {
  title: 'Shell/Profile Header',
  component: ProfileHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [ProfileHeaderComponent],
      providers: plectrumIconProviders,
    }),
  ],
  parameters: {
    layout: 'padded',
    ...storyDesign(ProfileHeaderMetadata.component.figmaUrl),
  },
  args: BASE_ARGS,
  argTypes: argTypesFromProps(ProfileHeaderMetadata.props ?? [], {
    variant: { control: 'select', options: ['default', 'in-order', 'warning', 'danger'] },
    avatarGender: { control: 'select', options: ['female', 'male', 'other'] },
    avatarVariant: { control: 'select', options: [1, 2, 3] },
  }),
  render: (args) => ({
    props: args,
    template: `<pds-profile-header ${HEADER_BINDINGS} />`,
  }),
};

export default meta;

type Story = StoryObj<ProfileHeaderStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from profile-header.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(ProfileHeaderMetadata.governance, ProfileHeaderMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'usage') };
export const Patterns = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'patterns') };
export const Examples = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'examples') };
export const Variants = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'variants') };
export const Composition = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(ProfileHeaderMetadata, 'accessibility') };

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Eva Martinez — Voir carte affilié' }),
    ).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Filtres rapides' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Copier NISS' })).toBeVisible();
  },
};

/** Title only — no primaryAction, tags or identifiers: the name is plain h2 text. */
export const Minimal: Story = {
  args: {
    primaryAction: null,
    infoTags: [],
    identifiers: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Eva Martinez' })).toBeVisible();
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
    await expect(canvas.queryByRole('group')).toBeNull();
  },
};

export const WithSlots: Story = {
  decorators: [
    moduleMetadata({
      imports: [ButtonModule, Card, FormsModule, OverlayBadge, SelectButton, Tab, TabList, TabPanel, TabPanels, Tabs],
    }),
  ],
  args: {
    statusAction: { label: 'Actions à réaliser', severity: 'success', menuItems: STATUS_MENU },
  },
  render: (args) => ({
    props: { ...args, views: ['Vue 360', 'Dispatcher'], view: 'Vue 360' },
    template: `<pds-profile-header ${HEADER_BINDINGS}>${SLOT_CONTENT}</pds-profile-header>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Dossier' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Nieuwe actie' })).toBeVisible();
    await assertTextVisible(canvasElement, '€ 65.00');

    // The header's Card bridges stay on its own p-card: a Card in [slot=aside]
    // keeps the theme background, radius and shadow.
    const headerCard = canvasElement.querySelector<HTMLElement>('.c-profile-header__card')!;
    const asideCard = canvasElement.querySelector<HTMLElement>('.sb-profile-header-aside-card')!;
    const header = getComputedStyle(headerCard);
    const aside = getComputedStyle(asideCard);
    await expect(header.backgroundImage).toContain('gradient');
    await expect(aside.backgroundImage).toBe('none');
    await expect(aside.boxShadow).not.toBe('none');
    await expect(aside.borderTopLeftRadius).not.toBe('0px');

    // Tabs in [slot=nav]: the tablist border is the bottom edge, the card drops its own.
    await expect(header.borderBottomWidth).toBe('0px');
  },
};

export const Anatomy = { tags: ['!dev'], ...anatomyStory(ProfileHeaderMetadata, WithSlots) };

export const InOrder: Story = {
  args: {
    statusAction: { label: 'En ordre', severity: 'success' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'En ordre' })).toBeVisible();
    await expect(canvasElement.querySelector('.c-profile-header--in-order')).not.toBeNull();
  },
};

export const Warning: Story = {
  args: {
    statusAction: WARNING_STATUS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: WARNING_STATUS_NAME })).toBeVisible();
    await assertTextVisible(canvasElement, 'Actions à réaliser:');
    await expect(canvasElement.querySelector('.c-profile-header--warning')).not.toBeNull();
  },
};

export const Danger: Story = {
  args: {
    title: 'Sophie Lambert',
    avatarInitials: 'SL',
    statusAction: { label: 'Critique', severity: 'danger' },
    infoTags: [
      { label: 'Dernière action:', value: '28/05/2026', filterKey: 'last-action' },
      { label: 'Documents actifs:', value: '0', filterKey: 'active-documents' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Critique' })).toBeVisible();
    await expect(canvasElement.querySelector('.c-profile-header--danger')).not.toBeNull();
  },
};

/** No statusAction: `variant` alone picks the gradient (here warning) — no status button. */
export const VariantFallback: Story = {
  args: {
    variant: 'warning',
    statusAction: null,
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.c-profile-header--warning')).not.toBeNull();
    await expect(canvasElement.querySelector('.c-profile-header__status-action')).toBeNull();
  },
};

/** One menuItems entry: the plain Button stands for it — its command runs and statusMenuSelect reports it. */
export const SingleStatusMenuItem: Story = {
  args: {
    statusAction: { label: 'C4 non reçu', severity: 'warn', menuItems: [STATUS_MENU[0]] },
    statusMenuSelect: fn(),
    statusActionClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('p-splitbutton')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'C4 non reçu' }));
    await expect(args.statusMenuSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'c4' }),
    );
    await expect(args.statusActionClick).not.toHaveBeenCalled();
  },
};

export const MultipleStatusActions: Story = {
  args: {
    statusAction: { label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU },
    statusMenuSelect: fn(),
    statusActionClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole('button', { name: 'Actions à réaliser (3)' });
    await expect(main).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(main);
    await waitForText(canvasElement, 'Paiement non versé', { inDocument: true });
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(body.getByText('Paiement non versé'));
    await waitFor(() =>
      expect(args.statusMenuSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'payment' }),
      ),
    );
    await expect(args.statusActionClick).not.toHaveBeenCalled();
  },
};

export const DisabledStatus: Story = {
  args: {
    statusAction: { ...WARNING_STATUS, disabled: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: WARNING_STATUS_NAME })).toBeDisabled();
  },
};

export const DisabledStatusActions: Story = {
  args: {
    statusAction: { label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU, disabled: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Actions à réaliser (3)' })).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Afficher le menu pour Actions à réaliser' }),
    ).toBeDisabled();
  },
};

export const InfoTagFilters: Story = {
  args: {
    infoTags: [
      ...INFO_TAGS,
      { label: 'Mutuelle:', value: 'Solidaris Liège' },
    ],
    infoTagClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Filterable tags are PrimeNG ToggleButtons — named by their visible text.
    const closed = canvas.getByRole('button', { name: 'Documents clôturés: 1' });
    const active = canvas.getByRole('button', { name: 'Documents actifs: 6' });
    await expect(active).toHaveAttribute('aria-pressed', 'true');
    // Pressed is not colour alone: a check icon marks it.
    await expect(active.querySelector('.bi-check-lg')).not.toBeNull();
    await userEvent.click(closed);
    await waitFor(() => expect(closed).toHaveAttribute('aria-pressed', 'true'));
    await waitFor(() => expect(active).toHaveAttribute('aria-pressed', 'false'));
    await expect(active.querySelector('.bi-check-lg')).toBeNull();
    await expect(args.infoTagClick).toHaveBeenCalledWith(
      expect.objectContaining({ filterKey: 'closed-documents' }),
    );
    await userEvent.click(closed);
    await waitFor(() => expect(closed).toHaveAttribute('aria-pressed', 'false'));
    // Display-only tag: plain Tag, not a button.
    await assertTextVisible(canvasElement, 'Solidaris Liège');
    await expect(canvas.queryByRole('button', { name: /Mutuelle/ })).toBeNull();
  },
};

export const Loading: Story = {
  args: {
    statusAction: WARNING_STATUS,
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const article = canvasElement.querySelector('article');
    await expect(article).toHaveAttribute('aria-busy', 'true');
    await expect(article).toHaveAttribute('aria-label', 'Eva Martinez');
  },
};

@Component({
  selector: 'pds-profile-header-simulated-loading-demo',
  standalone: true,
  imports: [ProfileHeaderComponent],
  template: `
    <pds-profile-header
      [loading]="loading()"
      title="Eva Martinez"
      avatarInitials="EM"
      [statusAction]="statusAction"
      [infoTags]="infoTags"
      [identifiers]="identifiers"
      [primaryAction]="primaryAction"
    />
  `,
})
class ProfileHeaderSimulatedLoadingDemoComponent {
  readonly loading = signal(true);
  readonly statusAction = WARNING_STATUS;
  readonly infoTags = INFO_TAGS;
  readonly identifiers = IDENTIFIERS;
  readonly primaryAction = PRIMARY_ACTION;

  constructor() {
    setTimeout(() => this.loading.set(false), SIMULATED_LOADING_MS);
  }
}

export const SimulatedLoading: Story = {
  decorators: [
    moduleMetadata({ imports: [ProfileHeaderSimulatedLoadingDemoComponent] }),
  ],
  render: () => ({
    template: '<pds-profile-header-simulated-loading-demo />',
  }),
  play: async ({ canvasElement }) => {
    await waitFor(
      () =>
        expect(
          within(canvasElement).getByRole('button', {
            name: 'Eva Martinez — Voir carte affilié',
          }),
        ).toBeVisible(),
      { timeout: SIMULATED_LOADING_MS + 2000 },
    );
  },
};

export const WrappedLayout: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div class="sb-demo-wrapper" style="max-width: 28rem">${story}</div>`,
    ),
  ],
  args: {
    title: 'Eva Martinez avec un nom très long pour forcer le retour à la ligne',
    statusAction: WARNING_STATUS,
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(
      canvasElement,
      'Eva Martinez avec un nom très long pour forcer le retour à la ligne',
    );
  },
};

export const Dutch: Story = {
  globals: { locale: 'nl' },
  args: {
    statusAction: WARNING_STATUS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await assertTextVisible(canvasElement, 'Uit te voeren acties:');
    await expect(canvas.getByRole('group', { name: 'Snelfilters' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'NISS kopiëren' })).toBeVisible();
  },
};

export const CopyWithToast: Story = {
  render: (args) => ({
    props: {
      ...args,
      identifierCopy: (identifier: ProfileHeaderIdentifier) => {
        args.identifierCopy(identifier);
        showStorybookToast({
          summary: 'Copié !',
          detail: `${identifier.label}: ${identifier.value}`,
        });
      },
    },
    template: `<pds-profile-header ${HEADER_BINDINGS} />`,
  }),
  args: {
    identifierCopy: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const clipboard = stubClipboard(canvasElement);
    try {
      await userEvent.click(
        within(canvasElement).getByRole('button', { name: 'Copier NSI' }),
      );
      await waitFor(() => expect(clipboard.writes).toEqual(['00004212182']));
      await expect(args.identifierCopy).toHaveBeenCalledWith({
        label: 'NSI',
        value: '00004212182',
      });
    } finally {
      clipboard.restore();
    }
  },
};

/**
 * Keyboard contract (profile-header.metadata.ts → accessibility.keyboardSupport):
 * Alt+A activates the name button outside editable fields, the status main
 * button opens the menu with Enter, Escape closes it and focus returns to the
 * main button, and Space toggles a filterable tag.
 */
export const Keyboard: Story = {
  tags: ['keyboard'],
  args: {
    statusAction: { label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU },
    primaryActionClick: fn(),
    infoTagClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole('button', { name: 'Eva Martinez — Voir carte affilié' });
    await expect(name).toHaveAttribute('aria-keyshortcuts', 'Alt+A');

    await tabTo(canvasElement, name);
    await userEvent.keyboard('{Alt>}a{/Alt}');
    await expect(args.primaryActionClick).toHaveBeenCalledTimes(1);

    const main = canvas.getByRole('button', { name: 'Actions à réaliser (3)' });
    await userEvent.tab();
    await expectFocus(main);
    await userEvent.keyboard('{Enter}');
    await waitForText(canvasElement, 'Paiement non versé', { inDocument: true });
    // TieredMenu moves focus into the menu once it has opened; Escape closes it from there.
    await waitFor(() =>
      expect(canvasElement.ownerDocument.activeElement?.closest('.p-tieredmenu')).not.toBeNull(),
    );
    pressEscape(canvasElement);
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).queryByText('Paiement non versé'),
      ).toBeNull(),
    );
    // Focus returns to the button that opened the menu (WCAG 2.4.3), not to <body>.
    await expectFocus(main);
    await expect(main).toHaveAttribute('aria-expanded', 'false');

    const lastAction = canvas.getByRole('button', { name: 'Dernière action: 09/06/2026' });
    await tabTo(canvasElement, lastAction);
    await userEvent.keyboard(' ');
    await expect(lastAction).toHaveAttribute('aria-pressed', 'true');
    await expect(args.infoTagClick).toHaveBeenCalledWith(
      expect.objectContaining({ filterKey: 'last-action' }),
    );
  },
};
