import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import type { MenuItem } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EmptyStateComponent, NavItem, NavShellComponent, TopNavComponent } from '@solidaris/ui';

interface SearchType {
  label: string;
  value: string;
}

interface OfficeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectButtonModule,
    EmptyStateComponent,
    NavShellComponent,
    TopNavComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly navItems: NavItem[] = [
    { id: 'icrm', label: 'iCRM', icon: 'logo-icrm', iconSource: 'svg' },
    { id: 'ishare', label: 'iShare', icon: 'logo-ishare', iconSource: 'svg' },
  ];

  readonly homeBreadcrumb: MenuItem = {
    icon: 'bi bi-house',
    routerLink: '/home',
  };

  readonly breadcrumbs: MenuItem[] = [{ label: 'iShare' }, { label: 'Recherche d\'affilié' }];

  readonly searchTypes: SearchType[] = [
    { label: 'NISS', value: 'niss' },
    { label: 'Nom', value: 'name' },
    { label: 'Dossier', value: 'file' },
  ];

  readonly officeOptions: OfficeOption[] = [
    { label: '319', value: '319' },
    { label: '412', value: '412' },
    { label: '507', value: '507' },
  ];

  selectedOffice: OfficeOption | null = this.officeOptions[0];
  officeSuggestions: OfficeOption[] = [...this.officeOptions];
  selectedSearchType = this.searchTypes[0].value;
  searchIdentifier = '';

  filterOffices(event: { query: string }): void {
    const query = event.query.trim().toLowerCase();

    this.officeSuggestions = query
      ? this.officeOptions.filter((option) => option.label.toLowerCase().includes(query) || option.value.includes(query))
      : [...this.officeOptions];
  }

  submitSearch(): void {
    // The first iShare page is a shell; the search action is wired for the next iteration.
  }
}