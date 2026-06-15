import { Component, inject, input, signal, type OnInit } from '@angular/core';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { IconRegistry, registerPlectrumIcons } from '../icon';
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
  selector: 'sds-affiliate-detail-drawer-demo',
  standalone: true,
  imports: [AffiliateDetailDrawerComponent, ButtonModule, Toast],
  providers: [MessageService],
  template: `
    <p-toast />
    <button
      pButton
      type="button"
      label="Ouvrir la carte affilié"
      icon="bi bi-person-vcard"
      (click)="open.set(true)"
    ></button>

    <sds-affiliate-detail-drawer
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
class AffiliateDetailDrawerDemoComponent implements OnInit {
  private readonly messageService = inject(MessageService);

  readonly data = input.required<AffiliateDetailDrawerData>();
  readonly initiallyOpen = input<boolean>(false);
  readonly showNotes = input<boolean>(true);

  readonly open = signal(false);
  readonly activeView = signal<AffiliateDetailDrawerView>('details');

  ngOnInit(): void {
    this.open.set(this.initiallyOpen());
  }

  onIdentifierCopy(identifier: AffiliateDetailDrawerIdentifier): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
      life: 2000,
    });
  }

  onViewChange(view: AffiliateDetailDrawerView): void {
    this.activeView.set(view);
    this.notify(`Vue : ${view}`);
  }

  notify(detail: string): void {
    this.messageService.add({ severity: 'info', summary: 'Action', detail, life: 1500 });
  }
}

interface AffiliateDetailDrawerStoryArgs {
  data: AffiliateDetailDrawerData;
  initiallyOpen: boolean;
  showNotes: boolean;
}

const meta: Meta<AffiliateDetailDrawerStoryArgs> = {
  title: 'UI/Affiliate Detail Drawer',
  component: AffiliateDetailDrawerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AffiliateDetailDrawerDemoComponent],
      providers: plectrumIconProviders,
    }),
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
iSHARE "Carte affilié" detail drawer — a headless \`p-drawer\` wrapper.

- **Figma**: [iSHARE-Audit node 7:1012](https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=7-1012)
- **BEM block**: \`c-affiliate-detail-drawer\`
- **Reuse**: large illustrated \`sds-plectrum-avatar\`, the overview-card copyable identifier chips, and small coloured avatars (blue/green/yellow) for the Famille tiles
- **PrimeNG**: \`p-drawer\` (headless), \`p-selectButton\`, \`p-accordion\`, \`p-card\`, \`p-tag\`, \`p-button\`
- **Two-way**: \`[(visible)]\` controls open/close; \`viewChange\` reports the Détails/Documents tab
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <sds-affiliate-detail-drawer-demo
        [data]="data"
        [initiallyOpen]="initiallyOpen"
        [showNotes]="showNotes"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<AffiliateDetailDrawerStoryArgs>;

export const Closed: Story = {
  args: {
    data: EVA_MARTINEZ,
    initiallyOpen: false,
    showNotes: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the button to open the drawer. Copying an identifier shows a confirmation toast.',
      },
    },
  },
};

export const Open: Story = {
  args: {
    data: EVA_MARTINEZ,
    initiallyOpen: true,
    showNotes: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Drawer open by default showing the full Carte affilié: header, segmented control, sections, and the Famille (blue/green/yellow avatars) and Notes accordions.',
      },
    },
  },
};

export const WithoutNotes: Story = {
  args: {
    data: EVA_MARTINEZ,
    initiallyOpen: true,
    showNotes: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Notes section hidden via `[showNotes]="false"` — used by iSHARE while Storybook and other consumers keep the default.',
      },
    },
  },
};
