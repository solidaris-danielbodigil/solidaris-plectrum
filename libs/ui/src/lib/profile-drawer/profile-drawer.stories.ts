import { Component, input, signal } from '@angular/core';
import {
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular-vite';
import { ButtonModule } from 'primeng/button';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { showStorybookToast } from '../../storybook/storybook-toast';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { expect, expectFocus, pressEscape, tabTo, userEvent, waitFor, waitForText, within } from '../../storybook/story-tests';
import {
  ProfileDrawerComponent,
  type ProfileDrawerData,
  type ProfileDrawerIdentifier,
  type ProfileDrawerView,
} from './profile-drawer.component';
import { ProfileDrawerMetadata } from './profile-drawer.metadata';

// =============================================================================
// Affiliate Detail Drawer
// Design ref: Figma node 7:1012 (iSHARE-Audit) — Carte affilié
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=7-1012
// =============================================================================

const EVA_MARTINEZ: ProfileDrawerData = {
  name: 'Eva Martinez',
  avatarInitials: 'EM',
  avatarGender: 'female',
  avatarVariant: 1,
  identifiers: [
    { label: 'Territoire', value: '315' },
    { label: 'NSI', value: '00004212182' },
    { label: 'N° de contrat', value: '1241786-19630928-2' },
    { label: 'NISS', value: '63092814612' },
  ],
  generalRows: [
    { label: 'NSI', value: '00004212182' },
    { label: 'Date de naissance', value: '14/08/1989 (36 ans)' },
    { label: 'Nationalité', value: 'Espagnol (ES)' },
    { label: 'Langue de contact', value: 'Espagnol (ES)' },
  ],
  contactRows: [
    { label: 'Adresse officielle', value: 'Solidariteitsstraat 5, 2500 Lier' },
    { label: 'E-mail', value: 'lies.verhoeven@gmail.com' },
    { label: 'Numéro de téléphone', value: '+32 89 123 004' },
    { label: 'Numéro de portable', value: '+32 472 987 567' },
  ],
  relatedMembers: [
    { initials: 'Q', name: 'Quinten Mota', relationship: 'partenaire', color: 'blue' },
    { initials: 'S', name: 'Shiloh Mota', relationship: 'enfant à charge', color: 'green' },
    { initials: 'J', name: 'Jack Mota', relationship: 'enfant à charge', color: 'yellow' },
  ],
  notes: [
    {
      author: 'Eva de Moyer',
      timestamp: '11/11/2022, 09:10',
      body: 'Personne agressive',
      tagLabel: 'Informations sensibles',
      severity: 'sensitive',
    },
    {
      author: 'Bert Luyckx',
      timestamp: '02/12/2023, 16:18',
      body: 'L’affilié est de langue étrangère.',
      tagLabel: 'Remarque libre',
      severity: 'neutral',
    },
    {
      author: 'Bert Luyckx',
      timestamp: '02/12/2023, 16:18',
      body: 'Lorem ipsum',
      tagLabel: 'Informations sensibles',
      severity: 'sensitive',
    },
  ],
};

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

@Component({
  selector: 'pds-profile-drawer-demo',
  standalone: true,
  imports: [ProfileDrawerComponent, ButtonModule],
  template: `
    <button
      pButton
      type="button"
      label="Ouvrir la carte affilié"
      icon="bi bi-person-vcard"
      (click)="open.set(true)"
    ></button>

    <pds-profile-drawer
      [(visible)]="open"
      [data]="data()"
      [view]="activeView()"
      [showNotes]="showNotes()"
      [disabledViews]="disabledViews()"
      [quickActionsDisabled]="quickActionsDisabled()"
      [callDisabled]="callDisabled()"
      [emailDisabled]="emailDisabled()"
      (identifierCopy)="onIdentifierCopy($event)"
      (viewChange)="onViewChange($event)"
      (quickActionsClick)="notify('Actions rapides')"
      (menuClick)="notify('Menu')"
      (callClick)="notify('Appeler l’affilié')"
      (emailClick)="notify('Envoyer un e-mail')"
      (familyMemberSelect)="notify('Membre : ' + $event.name)"
    />
  `,
})
class ProfileDrawerDemoComponent {
  readonly data = input.required<ProfileDrawerData>();
  readonly showNotes = input<boolean>(true);
  readonly disabledViews = input<ProfileDrawerView[]>([]);
  readonly quickActionsDisabled = input<boolean>(false);
  readonly callDisabled = input<boolean>(false);
  readonly emailDisabled = input<boolean>(false);

  readonly open = signal(false);
  readonly activeView = signal<ProfileDrawerView>('details');

  onIdentifierCopy(identifier: ProfileDrawerIdentifier): void {
    showStorybookToast({
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
    });
  }

  onViewChange(view: ProfileDrawerView): void {
    this.activeView.set(view);
    this.notify(`Vue : ${view}`);
  }

  notify(detail: string): void {
    showStorybookToast({
      severity: 'info',
      summary: 'Action',
      detail,
      life: 1500,
    });
  }
}

interface ProfileDrawerStoryArgs {
  data: ProfileDrawerData;
  showNotes: boolean;
  disabledViews: ProfileDrawerView[];
  quickActionsDisabled: boolean;
  callDisabled: boolean;
  emailDisabled: boolean;
}

// Promoted to core and reused across applications — catalogued with the Shell.
const meta: Meta<ProfileDrawerStoryArgs> = {
  title: 'Shell/Profile Drawer',
  component: ProfileDrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [ProfileDrawerDemoComponent],
      providers: plectrumIconProviders,
    }),
  ],
  parameters: {
    layout: 'padded',
    ...storyDesign(ProfileDrawerMetadata.component.figmaUrl),
  },
  args: {
    disabledViews: [],
    quickActionsDisabled: false,
    callDisabled: false,
    emailDisabled: false,
  },
  argTypes: argTypesFromProps(ProfileDrawerMetadata.props ?? [], {
    view: { control: 'select', options: ['details', 'documents'] },
    position: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
  }),
  render: (args) => ({
    props: args,
    template: `
      <pds-profile-drawer-demo
        [data]="data"
        [showNotes]="showNotes"
        [disabledViews]="disabledViews"
        [quickActionsDisabled]="quickActionsDisabled"
        [callDisabled]="callDisabled"
        [emailDisabled]="emailDisabled"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<ProfileDrawerStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from profile-drawer.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(ProfileDrawerMetadata.governance, ProfileDrawerMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(ProfileDrawerMetadata, 'usage') };
export const Patterns = { tags: ['!dev'], ...contractStory(ProfileDrawerMetadata, 'patterns') };
export const Composition = { tags: ['!dev'], ...contractStory(ProfileDrawerMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(ProfileDrawerMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(ProfileDrawerMetadata, 'accessibility') };

export const Default: Story = {
  args: {
    data: EVA_MARTINEZ,
    showNotes: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /Ouvrir la carte affilié/ }),
    );
    await waitForText(canvasElement, 'Eva Martinez', { inDocument: true });
  },
};

export const Anatomy = { tags: ['!dev'], ...anatomyStory(ProfileDrawerMetadata, Default) };

export const Dutch: Story = {
  globals: { locale: 'nl' },
  args: {
    data: EVA_MARTINEZ,
    showNotes: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /Ouvrir la carte affilié/ }),
    );
    await waitForText(canvasElement, 'Algemene informatie', { inDocument: true });
  },
};

export const DisabledActions: Story = {
  args: {
    data: EVA_MARTINEZ,
    disabledViews: ['documents'],
    quickActionsDisabled: true,
    callDisabled: true,
    emailDisabled: true,
  },
  parameters: {
    // WCAG 1.4.3 exempts inactive components; axe still scores the disabled toggle label.
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /Ouvrir la carte affilié/ }),
    );
    await waitForText(canvasElement, 'Eva Martinez', { inDocument: true });
    const doc = canvasElement.ownerDocument;
    for (const selector of [
      '.c-drawer__profile-quick-actions',
      '.c-drawer__profile-contact-action',
    ]) {
      doc.querySelectorAll<HTMLButtonElement>(selector).forEach((button) => {
        expect(button.disabled).toBe(true);
      });
    }
  },
};

export const WithoutNotes: Story = {
  args: {
    data: EVA_MARTINEZ,
    showNotes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /Ouvrir la carte affilié/ }),
    );
    await waitForText(canvasElement, 'Eva Martinez', { inDocument: true });
  },
};

/**
 * Keyboard contract (profile-drawer.metadata.ts → accessibility.keyboardSupport):
 * opening from the keyboard moves focus onto the profile heading, and Escape
 * closes the drawer and returns focus to the button that opened it. The focus
 * trap itself belongs to p-drawer and is not re-tested.
 */
export const Keyboard: Story = {
  tags: ['keyboard'],
  args: {
    data: EVA_MARTINEZ,
    showNotes: true,
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Ouvrir la carte affilié/ });
    await tabTo(canvasElement, trigger);
    await userEvent.keyboard('{Enter}');
    await waitForText(canvasElement, 'Eva Martinez', { inDocument: true });
    const heading = within(canvasElement.ownerDocument.body).getByRole('heading', { name: /Eva Martinez/ });
    await expectFocus(heading);
    pressEscape(canvasElement);
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole('heading', { name: /Eva Martinez/ })).toBeNull());
    await expectFocus(trigger);
  },
};
