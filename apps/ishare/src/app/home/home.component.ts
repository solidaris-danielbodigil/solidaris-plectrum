import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import type { MenuItem } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  EmptyStateComponent,
  NavItem,
  NavShellComponent,
  TopNavComponent,
} from '@solidaris/ui';

interface SearchType {
  label: string;
  value: string;
  placeholder: string;
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
    IconFieldModule,
    InputGroupModule,
    InputIconModule,
    InputTextModule,
    MessageModule,
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

  readonly breadcrumbs: MenuItem[] = [
    { label: 'iShare' },
    { label: "Recherche d'affilié" },
  ];

  readonly searchTypes: SearchType[] = [
    { label: 'NISS', value: 'niss', placeholder: 'Numéro NISS' },
    { label: 'NSI', value: 'nsi', placeholder: 'Numéro NSI' },
    { label: 'Nom', value: 'nom', placeholder: 'Nom de l\'affilié' },
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

  clearSearchIdentifier(): void {
    this.searchIdentifier = '';
  }

  get searchIdentifierLabel(): string {
    return `Recherchez par ${this.selectedSearchTypeOption.label}`;
  }

  get searchIdentifierPlaceholder(): string {
    return this.selectedSearchTypeOption.placeholder;
  }

  private get selectedSearchTypeOption(): SearchType {
    return this.searchTypes.find((type) => type.value === this.selectedSearchType) ?? this.searchTypes[0];
  }

  filterOffices(event: { query: string }): void {
    const query = event.query.trim().toLowerCase();

    this.officeSuggestions = query
      ? this.officeOptions.filter(
          (option) =>
            option.label.toLowerCase().includes(query) ||
            option.value.includes(query),
        )
      : [...this.officeOptions];
  }

  submitSearch(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    // The first iShare page is a shell; the search action is wired for the next iteration.
  }
}
