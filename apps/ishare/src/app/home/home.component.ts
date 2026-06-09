import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import type { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  EmptyStateComponent,
  FormFieldComponent,
  InputClearComponent,
} from '@solidaris/ui';
import { AffiliateHeaderService } from '../layout/affiliate-header.service';
import { BreadcrumbService } from '../layout/breadcrumb.service';

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
    SelectButtonModule,
    FormFieldComponent,
    InputClearComponent,
    EmptyStateComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: { class: 'o-flex o-flex--y o-flex__item--grow-1 o-layout--min-h-0 o-layout--min-w-0' },
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);

  ngOnInit(): void {
    this.affiliateHeaderService.clearHeader();
    this.breadcrumbService.setBreadcrumbs([
      { label: 'iShare' },
      { label: "Recherche d'affilié" },
    ]);
  }

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

  isFieldInvalid(form: NgForm, name: string): boolean {
    const control = form.controls[name] as AbstractControl | undefined;

    if (!control?.invalid) {
      return false;
    }

    // SelectButton marks ngModel dirty on click but not touched — include dirty so
    // label + control invalid styling matches other fields before submit.
    return control.touched || control.dirty || form.submitted;
  }

  submitSearch(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    // Navigate to the affiliate details page, passing the searched identifier as the
    // route param. Real lookup/resolution of the affiliate happens in a later iteration.
    const identifier = this.searchIdentifier.trim();

    if (!identifier) {
      return;
    }

    this.router.navigate(['/affiliate', identifier]);
  }
}
