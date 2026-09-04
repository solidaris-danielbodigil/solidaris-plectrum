import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { SubNavShellComponent } from './sub-nav-shell.component';
import { SubNavShellSection } from './sub-nav-shell.types';

// ---------------------------------------------------------------------------
// Fixture data — mirrors the three Figma app variants (node 1:1476)
// ---------------------------------------------------------------------------

const maatschappelijkWerkSections: SubNavShellSection[] = [
  {
    id: 'featured',
    label: '',
    items: [{ id: 'openstaand', label: 'Openstaand dossier', icon: 'bi-person-fill' }],
  },
  {
    id: 'dossiers',
    label: 'Dossiers',
    items: [
      { id: 'onvolledig', label: 'Onvolledig', count: 13, countSeverity: 'danger' },
      { id: 'recent-dos', label: 'Recent' },
    ],
  },
  {
    id: 'acties',
    label: 'Acties',
    items: [
      { id: 'gepland', label: 'Gepland', count: 8 },
      { id: 'recent-act', label: 'Recent' },
    ],
  },
  {
    id: 'begeleidingen',
    label: 'Begeleidingen',
    items: [
      { id: 'potentieel', label: 'Potentieel', count: 1 },
      { id: 'lopend', label: 'Lopend', count: 4 },
      { id: 'afsluitbaar', label: 'Afsluitbaar', count: 9 },
    ],
  },
  {
    id: 'configuratie',
    label: 'Configuratie',
    items: [{ id: 'beheermodule', label: 'Beheermodule' }],
  },
];

const processenSections: SubNavShellSection[] = [
  {
    id: 'workflows',
    label: 'Workflows',
    items: [{ id: 'alle', label: 'Alle' }],
  },
  {
    id: 'taken',
    label: 'Taken',
    items: [
      { id: 'toegewezen', label: 'Aan mij toegewezen', count: 8 },
      { id: 'recent-tak', label: 'Recent' },
    ],
  },
  {
    id: 'team',
    label: 'Je team beheren',
    items: [{ id: 'statistieken', label: 'Statistieken' }],
  },
];

const financieleControleSections: SubNavShellSection[] = [
  {
    id: 'sessies',
    label: 'Sessies',
    items: [
      { id: 'te-controleren', label: 'Te controleren', count: 13 },
      { id: 'in-opvolging', label: 'In opvolging', count: 8 },
      { id: 'afgewerkt', label: 'Afgewerkt', count: 13 },
    ],
  },
  {
    id: 'rapporten',
    label: 'Rapporten',
    items: [{ id: 'overzichten', label: 'Financiële overzichten' }],
  },
  {
    id: 'overig',
    label: 'Overig',
    items: [{ id: 'rechtzettingen', label: 'Rechtzettingen' }],
  },
];

// iCRM Audit — Figma node 20:1447 (iCRM-Audit file)
// Demonstrates interleaved standalone items between accordion sections.
const icrmSections: SubNavShellSection[] = [
  {
    id: 'section-featured',
    label: '',
    items: [
      { id: 'item-mon-compte', label: 'Mon compte', icon: 'bi-person-fill', routerLink: '/mon-compte' },
    ],
  },
  {
    id: 'section-creer-ticket',
    label: 'Créer Ticket',
    items: [
      { id: 'item-appel', label: 'Appel', routerLink: '/creer-ticket/appel' },
      { id: 'item-courrier', label: 'Courrier', routerLink: '/creer-ticket/courrier' },
      { id: 'item-email', label: 'Email', routerLink: '/creer-ticket/email' },
      { id: 'item-presentiel', label: 'Présentiel', routerLink: '/creer-ticket/presentiel' },
      { id: 'item-tache', label: 'Tache', routerLink: '/creer-ticket/tache' },
      { id: 'item-webrequest', label: 'Webrequest', routerLink: '/creer-ticket/webrequest' },
    ],
  },
  {
    id: 'section-journal-contact',
    label: '',
    items: [
      { id: 'item-journal-contact', label: 'Journal de contact', routerLink: '/journal-contact' },
    ],
  },
  {
    id: 'section-dispatcher',
    label: '',
    items: [
      { id: 'item-dispatcher', label: 'Dispatcher', routerLink: '/dispatcher', count: 117 },
    ],
  },
  {
    id: 'section-dispatcher-315',
    label: '',
    items: [
      { id: 'item-dispatcher-315', label: 'Dispatcher 315', routerLink: '/dispatcher-315' },
    ],
  },
  {
    id: 'section-files-traitement',
    label: 'Files de traitement',
    items: [
      { id: 'item-315-proactivite', label: '315 - Solidaris - Proactivité - Mutation sortante', routerLink: '/files-traitement/proactivite-mutation' },
      { id: 'item-315-soins-sante', label: '315 - Solidaris - soins de santé - Divers', routerLink: '/files-traitement/soins-sante-divers' },
    ],
  },
  {
    id: 'section-liens-utiles',
    label: 'Liens utiles',
    items: [
      { id: 'item-vue-360', label: 'Vue 360', routerLink: '/liens/vue-360' },
      { id: 'item-historique-crm', label: 'Historique CRM', routerLink: '/liens/historique-crm' },
      { id: 'item-d360', label: 'D360', routerLink: '/liens/d360' },
      { id: 'item-iged', label: 'iGED', routerLink: '/liens/iged' },
      { id: 'item-iris', label: 'IRIS', routerLink: '/liens/iris' },
      { id: 'item-irdv', label: 'iRDV', routerLink: '/liens/irdv' },
      { id: 'item-ishare', label: 'iShare', routerLink: '/liens/ishare' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<SubNavShellComponent> = {
  tags: ['!dev'],
  title: 'Shell/Navigation/SubNavShell',
  component: SubNavShellComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text', description: 'Module/app title in the header' },
    version: { control: 'text', description: 'Version string in the footer' },
    changelogUrl: { control: 'text', description: 'URL for the changelog link' },
    activeItemId: { control: 'text', description: 'ID of the currently active nav item' },
    sections: { control: 'object', description: 'Array of SubNavShellSection[]' },
  },
};

export default meta;
type Story = StoryObj<SubNavShellComponent>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const MaatschappelijkWerk: Story = {
  args: {
    title: 'Maatschappelijk Werk',
    sections: maatschappelijkWerkSections,
    activeItemId: 'lopend',
    version: '0.1.001',
    changelogUrl: '#',
  },
};

export const Processen: Story = {
  args: {
    title: 'Processen',
    sections: processenSections,
    activeItemId: 'toegewezen',
    version: '0.1.001',
    changelogUrl: '#',
  },
};

export const FinancieleControle: Story = {
  args: {
    title: 'Financiële Controle',
    sections: financieleControleSections,
    activeItemId: 'te-controleren',
    version: '0.1.001',
    changelogUrl: '#',
  },
};

export const WithCollapsedSection: Story = {
  args: {
    title: 'Maatschappelijk Werk',
    sections: maatschappelijkWerkSections.map(s =>
      s.id === 'dossiers' ? { ...s, collapsed: true } : s
    ),
    activeItemId: null,
    version: '0.1.001',
    changelogUrl: '#',
  },
};

export const WithDisabledItems: Story = {
  args: {
    title: 'Maatschappelijk Werk',
    sections: [
      {
        id: 'featured',
        label: '',
        items: [{ id: 'openstaand', label: 'Openstaand dossier', icon: 'bi-person-fill', disabled: true }],
      },
      {
        id: 'dossiers',
        label: 'Dossiers',
        items: [
          { id: 'onvolledig', label: 'Onvolledig', count: 13, countSeverity: 'danger' as const },
          { id: 'recent-dos', label: 'Recent', disabled: true },
        ],
      },
    ],
    activeItemId: null,
    version: '0.1.001',
    changelogUrl: '#',
  },
};

export const NoFooter: Story = {
  args: {
    title: 'Processen',
    sections: processenSections,
    activeItemId: null,
    version: '',
    changelogUrl: '#',
  },
};

export const Empty: Story = {
  args: {
    title: 'Empty module',
    sections: [],
    version: '0.1.001',
    changelogUrl: '#',
  },
};

export const ICRM: Story = {
  args: {
    title: 'iCRM',
    sections: icrmSections,
    activeItemId: 'item-mon-compte',
    version: '0.1.001',
    changelogUrl: '#',
  },
};
