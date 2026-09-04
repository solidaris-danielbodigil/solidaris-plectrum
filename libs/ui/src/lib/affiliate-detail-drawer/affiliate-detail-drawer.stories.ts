import { Component, input, signal } from '@angular/core';
import {
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { showStorybookToast } from '../../storybook/storybook-toast';
import {
  AffiliateDetailDrawerComponent,
  type AffiliateDetailDrawerData,
  type AffiliateDetailDrawerIdentifier,
  type AffiliateDetailDrawerView,
} from './affiliate-detail-drawer.component';

// =============================================================================
// Affiliate Detail Drawer
// Design ref: Figma node 7:1012 (iSHARE-Audit) — Carte affilié
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=7-1012
// =============================================================================

const EVA_MARTINEZ: AffiliateDetailDrawerData = {
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
  generalInfo: [
    { label: 'NSI', value: '00004212182' },
    { label: 'Date de naissance', value: '14/08/1989 (36 ans)' },
    { label: 'Nationalité', value: 'Espagnol (ES)' },
    { label: 'Langue de contact', value: 'Espagnol (ES)' },
  ],
  contactInfo: [
    { label: 'Adresse officielle', value: 'Solidariteitsstraat 5, 2500 Lier' },
    { label: 'E-mail', value: 'lies.verhoeven@gmail.com' },
    { label: 'Numéro de téléphone', value: '+32 89 123 004' },
    { label: 'Numéro de portable', value: '+32 472 987 567' },
  ],
  family: [
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
  selector: 'pds-affiliate-detail-drawer-demo',
  standalone: true,
  imports: [AffiliateDetailDrawerComponent, ButtonModule],
  template: `
    <button
      pButton
      type="button"
      label="Ouvrir la carte affilié"
      icon="bi bi-person-vcard"
      (click)="open.set(true)"
    ></button>

    <pds-affiliate-detail-drawer
      [(visible)]="open"
      [data]="data()"
      [view]="activeView()"
      [showNotes]="showNotes()"
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
class AffiliateDetailDrawerDemoComponent {
  readonly data = input.required<AffiliateDetailDrawerData>();
  readonly showNotes = input<boolean>(true);

  readonly open = signal(false);
  readonly activeView = signal<AffiliateDetailDrawerView>('details');

  onIdentifierCopy(identifier: AffiliateDetailDrawerIdentifier): void {
    showStorybookToast({
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
    });
  }

  onViewChange(view: AffiliateDetailDrawerView): void {
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

interface AffiliateDetailDrawerStoryArgs {
  data: AffiliateDetailDrawerData;
  showNotes: boolean;
}

const meta: Meta<AffiliateDetailDrawerStoryArgs> = {
  title: 'Custom components/Affiliate Detail Drawer',
  component: AffiliateDetailDrawerComponent,
  tags: ['!dev'],
  decorators: [
    moduleMetadata({
      imports: [AffiliateDetailDrawerDemoComponent],
      providers: plectrumIconProviders,
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    props: args,
    template: `
      <pds-affiliate-detail-drawer-demo
        [data]="data"
        [showNotes]="showNotes"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<AffiliateDetailDrawerStoryArgs>;

export const Default: Story = {
  args: {
    data: EVA_MARTINEZ,
    showNotes: true,
  },
};

export const WithoutNotes: Story = {
  args: {
    data: EVA_MARTINEZ,
    showNotes: false,
  },
};
