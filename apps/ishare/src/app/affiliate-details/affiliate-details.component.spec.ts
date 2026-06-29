import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  flushMicrotasks,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { of } from 'rxjs';
import type {
  ListDocumentItem,
  ListDocumentTag,
  ListDocumentTagTarget,
} from '@solidaris/ui';
import { AffiliateHeaderService } from '../layout/affiliate-header.service';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import {
  AffiliateDetailsComponent,
  deriveDocumentTags,
} from './affiliate-details.component';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail/affiliate-document-detail.component';
import {
  EVA_MARTINEZ_NISS,
  JACK_MOTA_NISS,
  QUINTEN_MOTA_NISS,
  SHILOH_MOTA_NISS,
} from './affiliate-mock.constants';

function expandJourneyGroup(
  component: AffiliateDetailsComponent,
  fixture: ComponentFixture<AffiliateDetailsComponent>,
  groupId: string,
): void {
  component.onExpandedGroupIdsChange([groupId]);
  fixture.detectChanges();
}

function openDocumentFiltersToolbar(
  component: AffiliateDetailsComponent,
  fixture: ComponentFixture<AffiliateDetailsComponent>,
): void {
  component.documentFiltersToolbarVisible.set(true);
  fixture.detectChanges();
}

describe('AffiliateDetailsComponent', () => {
  let component: AffiliateDetailsComponent;
  let fixture: ComponentFixture<AffiliateDetailsComponent>;
  let breadcrumbService: BreadcrumbService;
  let affiliateHeaderService: AffiliateHeaderService;
  let messageService: MessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateDetailsComponent, FormsModule],
      providers: [
        BreadcrumbService,
        AffiliateHeaderService,
        MessageService,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: EVA_MARTINEZ_NISS })),
            snapshot: {
              paramMap: convertToParamMap({ id: EVA_MARTINEZ_NISS }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateDetailsComponent);
    component = fixture.componentInstance;
    breadcrumbService = TestBed.inject(BreadcrumbService);
    affiliateHeaderService = TestBed.inject(AffiliateHeaderService);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide documents filter toolbar by default', () => {
    expect(component.documentFiltersToolbarVisible()).toBe(false);

    const shell = fixture.nativeElement.querySelector(
      '.c-affiliate-documents-toolbar-shell',
    );

    expect(shell).toBeTruthy();
    expect(shell.classList.contains('is-visible')).toBe(false);
    expect(shell.getAttribute('aria-hidden')).toBe('true');
  });

  it('should open documents filter toolbar when the header Filtres trigger is clicked', () => {
    const trigger = fixture.nativeElement.querySelector(
      '[data-telemetry-id="documents-filters-toggle"]',
    ) as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    expect(component.documentFiltersToolbarVisible()).toBe(true);
    expect(
      fixture.nativeElement
        .querySelector('.c-affiliate-documents-toolbar-shell')
        ?.classList.contains('is-visible'),
    ).toBe(true);
    expect(trigger.getAttribute('aria-pressed')).toBe('true');
  });

  it('should close documents filter toolbar when the chevron close button is clicked', () => {
    openDocumentFiltersToolbar(component, fixture);

    const closeButton = fixture.nativeElement.querySelector(
      '[data-telemetry-id="documents-filter-toolbar-close"]',
    ) as HTMLButtonElement;

    closeButton.click();
    fixture.detectChanges();

    expect(component.documentFiltersToolbarVisible()).toBe(false);
    expect(
      fixture.nativeElement
        .querySelector('.c-affiliate-documents-toolbar-shell')
        ?.classList.contains('is-visible'),
    ).toBe(false);
  });

  it('should render the documents search input and Filtres trigger in the card header', () => {
    const searchInput = fixture.nativeElement.querySelector(
      '#document-search',
    ) as HTMLInputElement;
    const trigger = fixture.nativeElement.querySelector(
      '[data-telemetry-id="documents-filters-toggle"]',
    ) as HTMLElement;

    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('role')).toBe('searchbox');
    expect(searchInput.placeholder).toBe('Rechercher document...');
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Filtres');
    expect(trigger.classList.contains('p-togglebutton')).toBe(true);
    expect(trigger.querySelector('.bi-funnel')).toBeTruthy();
    expect(trigger.getAttribute('aria-pressed')).toBe('false');
    expect(trigger.querySelector('.p-togglebutton-label')?.textContent).toContain(
      'Filtres',
    );
    const defaultFilterBadge = trigger.querySelector(
      '[data-telemetry-id="documents-filters-count"]',
    );
    expect(defaultFilterBadge).toBeTruthy();
    expect(defaultFilterBadge?.textContent).toContain('1');
  });

  it('should initialize document filter state from Figma defaults', () => {
    expect(component.documentSearch()).toBe('');
    expect(component.selectedSector()).toBeNull();
    expect(component.expandedGroupIds()).toEqual(['parcours-demande-primaire']);
    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(component.selectedSort()).toEqual({
      label: 'Date de réception',
      value: 'date-reception',
    });
    expect(component.openCategories()).toEqual(['parcours', 'isoles']);
    expect(component.activeCategory()).toBe('parcours');
  });

  it('should render three toolbar filter controls with expected labels', () => {
    openDocumentFiltersToolbar(component, fixture);

    const labels = [
      ...fixture.nativeElement.querySelectorAll('.c-form-field__label-text'),
    ].map((label) => (label as Element).textContent?.trim());

    expect(labels).toEqual(['Secteur', 'Trier par', 'Filtrer par date']);
  });

  it('should associate labels with controls via matching input ids', () => {
    openDocumentFiltersToolbar(component, fixture);

    const associations: Array<{
      labelFor: string | null;
      controlId: string | null;
    }> = [
      { labelFor: 'document-sector', controlId: 'document-sector' },
      { labelFor: 'document-sort', controlId: 'document-sort' },
      { labelFor: 'document-date-range', controlId: 'document-date-range' },
    ];

    associations.forEach(({ labelFor, controlId }) => {
      const label = fixture.nativeElement.querySelector(
        `label.c-form-field__label[for="${labelFor}"]`,
      );
      const control = fixture.nativeElement.querySelector(`#${controlId}`);

      expect(label).withContext(`label for="${labelFor}"`).toBeTruthy();
      expect(control).withContext(`control id="${controlId}"`).toBeTruthy();
    });
  });

  it('should not render journey-view or archived-only toolbar toggles', () => {
    openDocumentFiltersToolbar(component, fixture);

    expect(fixture.nativeElement.querySelector('#journey-view')).toBeNull();
    expect(fixture.nativeElement.querySelector('#archived-only')).toBeNull();
  });

  it('should mark the header search icon as decorative', () => {
    const searchIcon = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-search .bi-search',
    );

    expect(searchIcon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render header search input as a clearable text searchbox', () => {
    const searchInput = fixture.nativeElement.querySelector(
      '#document-search',
    ) as HTMLInputElement;

    expect(searchInput.type).toBe('text');
    expect(searchInput.getAttribute('role')).toBe('searchbox');
    expect(searchInput.placeholder).toBe('Rechercher document...');
    expect(searchInput.value).toBe('');
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__documents-search pds-input-clear',
      ),
    ).toBeTruthy();
  });

  it('should enable showClear on sector and sort autocompletes', () => {
    openDocumentFiltersToolbar(component, fixture);

    const autocompletes = fixture.debugElement.queryAll(
      By.directive(AutoComplete),
    );

    expect(autocompletes.length).toBe(2);
    autocompletes.forEach((autocomplete) => {
      expect(autocomplete.componentInstance.showClear).toBe(true);
      expect(
        autocomplete.nativeElement.classList.contains(
          'p-autocomplete-clearable',
        ),
      ).toBe(true);
    });
  });

  it('should render placeholders on sector and sort autocompletes', () => {
    openDocumentFiltersToolbar(component, fixture);

    const sectorInput = fixture.nativeElement.querySelector(
      '#document-sector',
    ) as HTMLInputElement;
    const sortInput = fixture.nativeElement.querySelector(
      '#document-sort',
    ) as HTMLInputElement;

    expect(sectorInput.placeholder).toBe('Sélectionnez un secteur');
    expect(sortInput.placeholder).toBe('Sélectionnez un tri');
  });

  it('should clear sector autocomplete via showClear', () => {
    openDocumentFiltersToolbar(component, fixture);

    component.selectedSector.set({
      label: 'indémnités',
      value: 'indemnites',
    });
    fixture.detectChanges();

    const sectorAutocomplete = fixture.debugElement
      .queryAll(By.directive(AutoComplete))
      .find((autocomplete) =>
        autocomplete.nativeElement.querySelector('#document-sector'),
      );

    sectorAutocomplete?.componentInstance.clear();
    fixture.detectChanges();

    expect(component.selectedSector()).toBeNull();
  });

  it('should clear sort autocomplete via showClear', () => {
    openDocumentFiltersToolbar(component, fixture);

    const sortAutocomplete = fixture.debugElement
      .queryAll(By.directive(AutoComplete))
      .find((autocomplete) =>
        autocomplete.nativeElement.querySelector('#document-sort'),
      );

    sortAutocomplete?.componentInstance.clear();
    fixture.detectChanges();

    expect(component.selectedSort()).toBeNull();
  });

  it('should clear document search via pds-input-clear in the card header', () => {
    component.documentSearch.set('rechute');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-search pds-input-clear button',
    ) as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(component.documentSearch()).toBe('');
    expect(
      (
        fixture.nativeElement.querySelector(
          '#document-search',
        ) as HTMLInputElement
      ).value,
    ).toBe('');
  });

  it('should show an active filter count badge when toolbar filters are applied', () => {
    component.onSectorChange({ label: 'médical', value: 'medical' });
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector(
      '[data-telemetry-id="documents-filters-toggle"] [data-telemetry-id="documents-filters-count"]',
    );

    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain('2');
    expect(component.activeToolbarFilterCount()).toBe(2);
  });

  it('should count date range and default sort as two active toolbar filters', () => {
    component.documentFilterDateRange.set([
      new Date(2026, 5, 3),
      new Date(2026, 5, 11),
    ]);
    fixture.detectChanges();

    expect(component.activeToolbarFilterCount()).toBe(2);
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="documents-filters-toggle"] [data-telemetry-id="documents-filters-count"]',
      )?.textContent,
    ).toContain('2');
  });

  it('should count default sort alone as an active toolbar filter', () => {
    expect(component.activeToolbarFilterCount()).toBe(1);
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="documents-filters-toggle"] [data-telemetry-id="documents-filters-count"]',
      )?.textContent,
    ).toContain('1');
  });

  it('should clear toolbar filters when the filters clear icon is clicked', () => {
    openDocumentFiltersToolbar(component, fixture);

    component.onSectorChange({ label: 'médical', value: 'medical' });
    component.onSortChange({ label: 'Nom du document', value: 'nom-document' });
    component.documentFilterDateRange.set([
      new Date(2026, 5, 1),
      new Date(2026, 5, 10),
    ]);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      '[data-telemetry-id="documents-filters-clear"]',
    ) as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(component.selectedSector()).toBeNull();
    expect(component.selectedSort()).toBeNull();
    expect(component.documentFilterDateRange()).toBeNull();
    expect(component.activeToolbarFilterCount()).toBe(0);
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="documents-filters-toggle"] [data-telemetry-id="documents-filters-count"]',
      ),
    ).toBeNull();

    const sectorInput = fixture.nativeElement.querySelector(
      '#document-sector',
    ) as HTMLInputElement;
    const dateInput = fixture.nativeElement.querySelector(
      '#document-date-range',
    ) as HTMLInputElement;

    expect(sectorInput.value).toBe('');
    expect(dateInput.value).toBe('');
    expect(component.selectedSort()).toBeNull();
  });

  it('should filter sector suggestions by query', () => {
    component.filterSectors({ query: 'med' });

    expect(component.sectorSuggestions).toEqual([
      { label: 'médical', value: 'medical' },
    ]);
  });

  it('should reset sector suggestions when query is empty', () => {
    component.filterSectors({ query: 'med' });
    component.filterSectors({ query: '   ' });

    expect(component.sectorSuggestions).toEqual(component.sectorOptions);
  });

  it('should filter sort suggestions by query', () => {
    component.filterSortOptions({ query: 'date' });

    expect(component.sortSuggestions).toEqual([
      { label: 'Date de réception', value: 'date-reception' },
    ]);
  });

  it('should reset sort suggestions when query is empty', () => {
    component.filterSortOptions({ query: 'nom' });
    component.filterSortOptions({ query: '' });

    expect(component.sortSuggestions).toEqual(component.sortOptions);
  });

  it('should set breadcrumbs for the affiliate details page', () => {
    expect(breadcrumbService.breadcrumbs()).toEqual([
      { label: 'iShare' },
      { label: "Recherche d'affilié", routerLink: '/home' },
      { label: 'Eva Martinez' },
    ]);
  });

  it('should set affiliate header data on init', () => {
    const header = affiliateHeaderService.header();

    expect(header?.title).toBe('Eva Martinez');
    expect(header?.variant).toBe('default');
    expect(header?.identifiers?.find((id) => id.label === 'NISS')?.value).toBe(
      '63092814612',
    );
    expect(header?.infoTags).toEqual([
      jasmine.objectContaining({
        label: 'Dernière action:',
        value: '09/06/2026',
        filterKey: 'last-action',
      }),
      jasmine.objectContaining({
        label: 'Documents actifs:',
        value: '6',
        filterKey: 'active-documents',
      }),
      jasmine.objectContaining({
        label: 'Documents clôturés:',
        value: '1',
        filterKey: 'closed-documents',
      }),
    ]);
    expect(
      header?.infoTags.some((tag) => tag.filterKey === 'closed-documents'),
    ).toBe(true);
    expect(header?.onInfoTagClick).toEqual(jasmine.any(Function));
    expect(header?.onPrimaryActionClick).toEqual(jasmine.any(Function));
    expect(header?.onStatusActionClick).toEqual(jasmine.any(Function));
    expect(header?.statusAction).toEqual(
      jasmine.objectContaining({
        label: 'C4 non reçu',
        tagValue: 'C4',
        severity: 'warn',
        ariaLabel: 'Voir le détail — C4 non reçu',
      }),
    );
  });

  it('should open affiliate detail drawer when primary action callback runs', () => {
    expect(component.affiliateDetailDrawerVisible()).toBe(false);

    affiliateHeaderService.header()?.onPrimaryActionClick?.();
    fixture.detectChanges();

    expect(component.affiliateDetailDrawerVisible()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('pds-affiliate-detail-drawer'),
    ).toBeTruthy();
  });

  it('should deep-link to demande primaire calcul panel when status action callback runs', () => {
    component.selectedDocumentId.set('doc-incapacite');
    component.documentFocus.set(null);
    component.expandedGroupIds.set([]);

    affiliateHeaderService.header()?.onStatusActionClick?.();
    fixture.detectChanges();

    expect(component.openCategories()).toContain('parcours');
    expect(component.activeCategory()).toBe('parcours');
    expect(component.expandedGroupIds()).toContain('parcours-demande-primaire');
    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(component.documentFocus()).toEqual({
      stepValue: 3,
      panelId: 'calcul',
    });

    const detail = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).componentInstance as AffiliateDocumentDetailComponent;

    expect(detail.activeStep()).toBe(3);
    expect(detail.certPanelValue()).toBe('calcul');
  });

  it('should hide the Notes section in the affiliate detail drawer', () => {
    component.affiliateDetailDrawerVisible.set(true);
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector(
      'pds-affiliate-detail-drawer',
    );
    expect(drawer).toBeTruthy();

    const sectionTitles = [
      ...fixture.nativeElement.querySelectorAll('.c-drawer__section-title'),
    ].map((title) => (title as Element).textContent?.trim());

    expect(sectionTitles).not.toContain('Notes');
    expect(
      fixture.nativeElement.querySelector('.c-drawer__affiliate-detail-notes'),
    ).toBeNull();
  });

  it('should show a success toast when a drawer identifier is copied', () => {
    const addSpy = spyOn(messageService, 'add');

    component.onDrawerIdentifierCopy({ label: 'Territoire', value: '319' });

    expect(addSpy).toHaveBeenCalledOnceWith({
      severity: 'success',
      summary: 'Copié !',
      detail: 'Territoire: 319',
    });
  });

  it('should show an info toast for drawer placeholder actions', () => {
    const addSpy = spyOn(messageService, 'add');
    const expectedToast = {
      severity: 'info',
      summary: 'Bientôt disponible',
      detail: 'Cette fonctionnalité sera disponible prochainement.',
    };

    component.onDrawerMenuClick();
    component.onDrawerQuickActionsClick();
    component.onDrawerCallClick();
    component.onDrawerEmailClick();
    component.onDrawerViewChange('documents');

    expect(addSpy).toHaveBeenCalledTimes(5);
    for (let i = 0; i < 5; i++) {
      expect(addSpy.calls.argsFor(i)[0]).toEqual(expectedToast);
    }
  });

  it('should not show a toast when the drawer Détails view is selected', () => {
    const addSpy = spyOn(messageService, 'add');

    component.onDrawerViewChange('details');

    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should clear affiliate header on destroy', () => {
    fixture.destroy();

    expect(affiliateHeaderService.header()).toBeNull();
  });

  it('should expose category counts Parcours 4 / Isolés 2 / Archivés 1', () => {
    const byId = Object.fromEntries(
      component.categories().map((category) => [category.id, category.count]),
    );

    expect(byId['parcours']).toBe(4);
    expect(byId['isoles']).toBe(2);
    expect(byId['archives']).toBe(1);
    expect(component.documentCount()).toBe(7);
  });

  it('should render category tabs with badges in the documents card header', () => {
    const tabs = fixture.nativeElement.querySelectorAll(
      '.c-affiliate-details__category-tab',
    );

    expect(tabs.length).toBe(3);
    tabs.forEach((tab: Element) => {
      expect(tab.querySelector('p-badge')).toBeTruthy();
    });
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="category-tab-isoles"]',
      ),
    ).toBeTruthy();
  });

  it('should keep all category tabs visible and disable empty ones for active-documents filter', () => {
    component.activeCategory.set('archives');
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '6',
      filterKey: 'active-documents',
    });
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll(
      '.c-affiliate-details__category-tab',
    );
    expect(tabs.length).toBe(3);

    const archivesTab = fixture.nativeElement.querySelector(
      '[data-telemetry-id="category-tab-archives"]',
    ) as HTMLElement;
    expect(
      archivesTab.classList.contains(
        'c-affiliate-details__category-tab--disabled',
      ),
    ).toBe(true);
    expect(archivesTab.getAttribute('aria-disabled')).toBe('true');
    expect(component.activeCategory()).toBe('parcours');
    expect(component.selectedCategoryTab()).toBe('parcours');
  });

  it('should not select a disabled category tab when clicked', () => {
    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '1',
      filterKey: 'closed-documents',
    });
    fixture.detectChanges();

    expect(component.activeCategory()).toBe('archives');

    component.onCategoryTabChange('isoles');
    fixture.detectChanges();

    expect(component.activeCategory()).toBe('archives');
  });

  it('should collapse disabled category accordion panels when the filter changes', () => {
    expect(component.openCategories()).toEqual(['parcours', 'isoles']);

    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '1',
      filterKey: 'closed-documents',
    });
    fixture.detectChanges();

    expect(component.openCategories()).not.toContain('parcours');
    expect(component.openCategories()).not.toContain('isoles');
    expect(component.openCategories()).toContain('archives');
  });

  it('should show an explicit empty-filter message in a disabled accordion panel', () => {
    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '1',
      filterKey: 'closed-documents',
    });
    fixture.detectChanges();

    component.onAccordionValueChange(['parcours', 'archives']);
    fixture.detectChanges();

    const parcoursPanel = fixture.nativeElement.querySelector(
      '#category-panel-parcours',
    );
    const emptyMessage = parcoursPanel?.querySelector(
      '.c-affiliate-details__category-empty-filter',
    );

    expect(emptyMessage?.textContent?.trim()).toBe(
      'Aucun document ne correspond à ce filtre.',
    );
    expect(parcoursPanel?.querySelector('pds-list')).toBeNull();
  });

  it('should render p-badge counts in accordion panel headers', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '.c-affiliate-details__category-panel-header',
    );

    expect(headers.length).toBe(3);
    headers.forEach((header: Element) => {
      expect(header.querySelector('p-badge')).toBeTruthy();
    });

    const parcoursHeader = fixture.nativeElement.querySelector(
      '#category-panel-parcours .c-affiliate-details__category-panel-header',
    );
    expect(
      parcoursHeader
        ?.querySelector('.c-affiliate-details__category-panel-count-label')
        ?.textContent?.trim(),
    ).toBe('documents');
    expect(
      fixture.nativeElement.querySelector(
        '#category-panel-isoles .c-affiliate-details__category-panel-count-label',
      ),
    ).toBeNull();
  });

  it('should render parcours journey list inside the parcours accordion panel', () => {
    const parcoursList = fixture.nativeElement.querySelector(
      '#category-panel-parcours pds-list',
    );

    expect(parcoursList).toBeTruthy();
    expect(parcoursList.classList.contains('c-list--journey')).toBe(true);
    expect(
      fixture.nativeElement.querySelectorAll(
        '#category-panel-parcours .c-list__item--group',
      ).length,
    ).toBe(3);
  });

  it('should render flat lists for isolés and archivés accordion panels', () => {
    const isolesList = fixture.nativeElement.querySelector(
      '#category-panel-isoles pds-list',
    );
    const archivesList = fixture.nativeElement.querySelector(
      '#category-panel-archives pds-list',
    );

    expect(isolesList?.classList.contains('c-list--flat')).toBe(true);
    expect(archivesList?.classList.contains('c-list--flat')).toBe(true);
    expect(
      fixture.nativeElement.querySelectorAll(
        '#category-panel-isoles .c-list__item--document',
      ).length,
    ).toBe(2);
    expect(
      fixture.nativeElement.querySelectorAll(
        '#category-panel-archives .c-list__item--document',
      ).length,
    ).toBe(1);
  });

  it('should collapse a category when the eye toggle is clicked', () => {
    const eyeToggle = fixture.nativeElement.querySelector(
      '[data-telemetry-id="category-toggle-isoles"]',
    ) as HTMLButtonElement;

    expect(eyeToggle.querySelector('.bi-eye')).toBeTruthy();
    expect(component.openCategories()).toContain('isoles');

    eyeToggle.click();
    fixture.detectChanges();

    expect(component.openCategories()).not.toContain('isoles');
    expect(eyeToggle.querySelector('.bi-eye-slash')).toBeTruthy();
  });

  it('should hide archivés by default and show eye-slash on the archives tab', () => {
    expect(component.openCategories()).not.toContain('archives');

    const archivesEyeToggle = fixture.nativeElement.querySelector(
      '[data-telemetry-id="category-toggle-archives"]',
    ) as HTMLButtonElement;

    expect(archivesEyeToggle.querySelector('.bi-eye-slash')).toBeTruthy();
    expect(archivesEyeToggle.querySelector('.bi-eye')).toBeFalsy();
  });

  it('should add archives to openCategories when the archives eye toggle is clicked', () => {
    const archivesEyeToggle = fixture.nativeElement.querySelector(
      '[data-telemetry-id="category-toggle-archives"]',
    ) as HTMLButtonElement;

    archivesEyeToggle.click();
    fixture.detectChanges();

    expect(component.openCategories()).toContain('archives');
    expect(archivesEyeToggle.querySelector('.bi-eye')).toBeTruthy();
    expect(archivesEyeToggle.querySelector('.bi-eye-slash')).toBeFalsy();
  });

  it('should set activeCategory and scroll when a category tab is clicked', fakeAsync(() => {
    const scrollToCategorySpy = spyOn(
      component,
      'scrollToCategory',
    ).and.callThrough();

    component.onCategoryTabChange('isoles');
    flushMicrotasks();

    expect(component.activeCategory()).toBe('isoles');
    expect(component.openCategories()).toContain('isoles');
    expect(scrollToCategorySpy).toHaveBeenCalledWith('isoles');
  }));

  it('should show closed-documents info tag when archived documents exist', () => {
    const closedTag = component
      .infoTags()
      .find((tag) => tag.filterKey === 'closed-documents');

    expect(closedTag).toEqual(
      jasmine.objectContaining({
        label: 'Documents clôturés:',
        value: '1',
        filterKey: 'closed-documents',
      }),
    );
  });

  it('should filter to archived documents when closed-documents info tag is active', () => {
    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '1',
      filterKey: 'closed-documents',
    });
    fixture.detectChanges();

    expect(component.categories().map((category) => category.id)).toEqual([
      'parcours',
      'isoles',
      'archives',
    ]);
    expect(
      component.categories().find((category) => category.id === 'parcours')
        ?.enabled,
    ).toBe(false);
    expect(
      component.categories().find((category) => category.id === 'isoles')
        ?.enabled,
    ).toBe(false);
    expect(
      component.categories().find((category) => category.id === 'archives')
        ?.enabled,
    ).toBe(true);
    expect(component.activeCategory()).toBe('archives');
    expect(component.openCategories()).toContain('archives');
    expect(component.archivesItems()[0].id).toBe(
      'doc-archive-changement-adresse',
    );
  });

  it('should filter documents by search query across categories', () => {
    component.documentSearch.set('rechute');
    fixture.detectChanges();

    expect(component.categories().map((category) => category.id)).toEqual([
      'parcours',
      'isoles',
      'archives',
    ]);
    expect(
      component.categories().find((category) => category.id === 'parcours')
        ?.count,
    ).toBe(1);
    expect(
      component.categories().find((category) => category.id === 'isoles')
        ?.enabled,
    ).toBe(false);
    expect(component.openCategories()).toContain('parcours');
    expect(component.parcoursGroups()[0].documents[0].id).toBe('doc-rechute');
  });

  it('should place toolbar shell at page level outside documents column', () => {
    openDocumentFiltersToolbar(component, fixture);

    const shell = fixture.nativeElement.querySelector(
      '.c-affiliate-details > .c-affiliate-documents-toolbar-shell',
    );
    const toolbarInDocuments = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents .c-affiliate-documents-toolbar-shell',
    );

    expect(shell).toBeTruthy();
    expect(
      shell?.querySelector('pds-toolbar.c-affiliate-documents-toolbar'),
    ).toBeTruthy();
    expect(toolbarInDocuments).toBeNull();
  });

  it('should render two-column affiliate details shell', () => {
    const shell = fixture.nativeElement.querySelector('.c-affiliate-details');
    const columnsRow = fixture.nativeElement.querySelector(
      '.c-affiliate-details__columns',
    );
    const documentsColumn = fixture.nativeElement.querySelector(
      '.c-affiliate-details__columns .c-affiliate-details__documents',
    );
    const detailPanel = fixture.nativeElement.querySelector(
      '.c-affiliate-details__detail app-affiliate-document-detail',
    );

    expect(shell).toBeTruthy();
    expect(columnsRow).toBeTruthy();
    expect(documentsColumn).toBeTruthy();
    expect(
      documentsColumn?.querySelector(
        'pds-list, pds-empty-state, .c-affiliate-details__category-accordion',
      ),
    ).toBeTruthy();
    expect(detailPanel).toBeTruthy();
  });

  it('should not render a separate journey sort button in the documents card header', () => {
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__documents-sort',
      ),
    ).toBeNull();
  });

  it('should select the first document when a journey group is expanded', () => {
    component.selectedDocumentId.set('nonexistent-document');
    expandJourneyGroup(component, fixture, 'parcours-clotures');

    expect(component.selectedDocumentId()).toBe('doc-cloture-primaire');
    expect(
      fixture.nativeElement.querySelector('app-affiliate-document-detail'),
    ).toBeTruthy();
  });

  it('should expose seven visible documents sorted by oldest reception date by default', () => {
    expect(component.visibleDocuments().length).toBe(7);
    expect(component.visibleDocuments()[0].id).toBe(
      'doc-archive-changement-adresse',
    );
    expect(component.visibleDocuments().at(-1)?.id).toBe(
      'doc-attestation-pedicure',
    );
  });

  it('should sort isolés items by newest reception date when isolés tab is active', () => {
    component.activeCategory.set('isoles');
    fixture.detectChanges();

    expect(component.isolesItems()[0].id).toBe('doc-attestation-pedicure');
    expect(component.isolesItems().at(-1)?.id).toBe('doc-c4');
  });

  it('should filter documents when an info tag filter is applied', () => {
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '6',
      filterKey: 'active-documents',
    });
    fixture.detectChanges();

    expect(component.documentInfoFilter()).toBe('active-documents');
    expect(component.visibleDocuments().length).toBe(6);
  });

  it('should clear info tag filter when the same tag is clicked again', () => {
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '6',
      filterKey: 'active-documents',
    });
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '6',
      filterKey: 'active-documents',
    });

    expect(component.documentInfoFilter()).toBeNull();
  });

  it('should restore scroll to the selected document when an info tag filter is cleared', fakeAsync(() => {
    component.selectedDocumentId.set('doc-attestation-pedicure');
    component.activeCategory.set('isoles');
    fixture.detectChanges();

    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();
    flushMicrotasks();
    flush();

    const scrollSpy = spyOn(
      HTMLElement.prototype,
      'scrollIntoView',
    ).and.callThrough();
    const scrollBySpy = spyOn(
      HTMLElement.prototype,
      'scrollBy',
    ).and.callThrough();

    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();
    flushMicrotasks();
    flush();

    expect(component.documentInfoFilter()).toBeNull();
    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');
    expect(scrollSpy.calls.any() || scrollBySpy.calls.any()).toBe(true);
  }));

  it('should update header info tag active state when filter changes', () => {
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '6',
      filterKey: 'active-documents',
    });
    fixture.detectChanges();

    const activeTag = affiliateHeaderService
      .header()
      ?.infoTags.find((tag) => tag.filterKey === 'active-documents');

    expect(activeTag?.active).toBe(true);
  });

  it('should reset selected document when filters hide the current selection', () => {
    component.selectedDocumentId.set('doc-rechute');
    component.documentSearch.set('incapacité');
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBeNull();
  });

  it('should decode tag target id and set selectedDocumentId + documentFocus on tag target click', () => {
    const doc: ListDocumentItem = {
      id: 'doc-incapacite',
      title: 'Incapacité',
    };
    const target: ListDocumentTagTarget = {
      id: '2::compte-financier-liasse',
      label: 'Feuilles de renseignement - Compte financier - Liasse',
    };
    const tag: ListDocumentTag = {
      label: '1',
      severity: 'info',
      targets: [target],
    };

    component.onTagTargetClick({ doc, tag, target });
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
    expect(component.documentFocus()).toEqual({
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
  });

  it('should ignore a tag target whose id is not encoded as `${stepValue}::${panelId}`', () => {
    component.documentFocus.set(null);

    component.onTagTargetClick({
      doc: { id: 'doc-incapacite', title: 'Incapacité' },
      tag: { label: '1', severity: 'info' },
      target: { id: 'not-encoded', label: 'Cible invalide' },
    });

    expect(component.documentFocus()).toBeNull();
  });

  it('should clear documentFocus on a plain row click so an old focus is not re-applied', () => {
    component.documentFocus.set({
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });

    component.onDocumentClick({ id: 'doc-incapacite', title: 'Incapacité' });

    expect(component.documentFocus()).toBeNull();
    expect(component.selectedDocumentId()).toBe('doc-incapacite');
  });

  it('should derive count tags with deep-link targets from the detail mock for a known doc', () => {
    const tags = deriveDocumentTags('doc-demande-primaire');

    expect(tags.length).toBe(2);
    expect(tags).toContain(
      jasmine.objectContaining({
        label: '2',
        severity: 'secondary',
        icon: 'bi bi-chat-right-text-fill',
        ariaLabel: '2 commentaires',
        targets: [
          {
            id: '2::fdr-affilie-incapacite',
            label:
              'Feuilles de renseignement - F.D.R. affilié - Incapacité de travail',
          },
          {
            id: '2::compte-financier-liasse',
            label: 'Feuilles de renseignement - Compte financier - Liasse',
          },
        ],
      }),
    );
    expect(tags).toContain(
      jasmine.objectContaining({
        label: '1',
        severity: 'warn',
        icon: 'bi bi-exclamation-triangle-fill',
        ariaLabel: '1 avertissement',
        targets: [{ id: '3::calcul', label: 'Calcul - Calcul' }],
      }),
    );
  });

  it('should apply the derived tags to the visible documents', () => {
    const primaire = component
      .visibleDocuments()
      .find((document) => document.id === 'doc-demande-primaire');

    expect(primaire?.tags).toEqual(deriveDocumentTags('doc-demande-primaire'));
  });

  it('should return no derived tags for a document without panel comments', () => {
    expect(deriveDocumentTags('doc-cloture-primaire')).toEqual([]);
  });

  it('should return no derived tags for doc-incapacite disabled paiement panel', () => {
    expect(deriveDocumentTags('doc-incapacite')).toEqual([]);
  });

  it('should apply no comment tags to doc-incapacite in visible documents', () => {
    const incapacite = component
      .visibleDocuments()
      .find((document) => document.id === 'doc-incapacite');

    expect(incapacite).toBeTruthy();
    expect(incapacite?.tags).toBeUndefined();
  });

  it('should jump detail to Calcul when the single-target warn tag is clicked', () => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    const detail = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).componentInstance as AffiliateDocumentDetailComponent;

    expect(detail.activeStep()).toBe(1);

    const warnTagButton = fixture.nativeElement.querySelector(
      '.c-list__tags button[aria-label="1 avertissement"]',
    ) as HTMLButtonElement;
    expect(warnTagButton)
      .withContext('single-target warn tag button')
      .toBeTruthy();

    warnTagButton.click();
    fixture.detectChanges();

    expect(component.documentFocus()).toEqual({
      stepValue: 3,
      panelId: 'calcul',
    });
    expect(detail.activeStep()).toBe(3);
    expect(detail.certPanelValue()).toBe('calcul');
  });

  it('should open the popover and jump the detail when a multi-target count tag option is clicked', () => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    const detail = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).componentInstance as AffiliateDocumentDetailComponent;

    const infoTagButton = fixture.nativeElement.querySelector(
      '.c-list__tags button[aria-label="2 commentaires"]',
    ) as HTMLButtonElement;
    expect(infoTagButton)
      .withContext('multi-target info tag button')
      .toBeTruthy();

    infoTagButton.click();
    fixture.detectChanges();

    const options = document.body.querySelectorAll(
      '.p-autocomplete-option',
    ) as NodeListOf<HTMLElement>;
    expect(options.length).toBe(2);

    options[0].click();
    fixture.detectChanges();

    expect(component.documentFocus()).toEqual({
      stepValue: 2,
      panelId: 'fdr-affilie-incapacite',
    });
    expect(detail.activeStep()).toBe(2);
    expect(detail.certPanelValue()).toBe('fdr-affilie-incapacite');
  });

  it('should wire document detail navigation to selectedDocumentId', () => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-demande-primaire');
    fixture.detectChanges();

    component.goToNextDocument();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
  });

  it('should span prev/next navigation across parcours, isolés, and archivés', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    expect(
      component.navigableDocuments().map((document) => document.id),
    ).toEqual([
      'doc-demande-primaire',
      'doc-incapacite',
      'doc-rechute',
      'doc-cloture-primaire',
      'doc-attestation-pedicure',
      'doc-c4',
      'doc-archive-changement-adresse',
    ]);

    component.selectedDocumentId.set('doc-rechute');
    fixture.detectChanges();

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-cloture-primaire');
    expect(component.navigableDocuments().length).toBe(7);
    expect(
      component.navigableDocuments().map((document) => document.id),
    ).toEqual([
      'doc-demande-primaire',
      'doc-incapacite',
      'doc-rechute',
      'doc-cloture-primaire',
      'doc-attestation-pedicure',
      'doc-c4',
      'doc-archive-changement-adresse',
    ]);

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-c4');

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe(
      'doc-archive-changement-adresse',
    );
    expect(component.openCategories()).toContain('archives');
    expect(component.activeCategory()).toBe('archives');
  }));

  it('should select archived document from the archivés list', () => {
    component.onDocumentClick({
      id: 'doc-archive-changement-adresse',
      title: "Changement d'adresse",
    });
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe(
      'doc-archive-changement-adresse',
    );
    expect(component.openCategories()).toContain('archives');
    expect(component.activeCategory()).toBe('archives');
    expect(
      fixture.nativeElement.querySelector('app-affiliate-document-detail'),
    ).toBeTruthy();
  });

  it('should expand collapsed parcours group when navigating to a document in another group', () => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    component.goToNextDocument();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-rechute');
    expect(component.expandedGroupIds()).toContain('parcours-rechute');

    const selectedInTree = fixture.nativeElement.querySelector(
      '.c-list__item--document.c-list__item--selected',
    ) as HTMLElement | null;

    expect(selectedInTree?.textContent).toContain('Rechute');
  });

  it('should expand a collapsed category accordion when navigating to a document in that category', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.toggleCategoryVisibility('isoles');
    fixture.detectChanges();

    expect(component.openCategories()).toEqual(['parcours']);

    component.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe(
      'doc-archive-changement-adresse',
    );
    expect(component.openCategories()).toContain('archives');
    expect(component.activeCategory()).toBe('archives');
  }));

  it('should reopen isolés when prev/next navigates to an isolés document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.toggleCategoryVisibility('isoles');
    fixture.detectChanges();

    expect(component.openCategories()).not.toContain('isoles');

    component.selectedDocumentId.set('doc-cloture-primaire');
    fixture.detectChanges();

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');
    expect(component.openCategories()).toContain('isoles');
    expect(component.activeCategory()).toBe('isoles');
  }));

  it('should select and reveal the last parcours document when navigating back from isolés', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.toggleCategoryVisibility('isoles');
    fixture.detectChanges();

    component.selectedDocumentId.set('doc-attestation-pedicure');
    component.activeCategory.set('isoles');
    fixture.detectChanges();

    expect(component.expandedGroupIds()).not.toContain('parcours-clotures');

    component.goToPreviousDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-cloture-primaire');
    expect(component.activeCategory()).toBe('parcours');
    expect(component.expandedGroupIds()).toContain('parcours-clotures');

    const selectedInTree = fixture.nativeElement.querySelector(
      '.c-list__item--document.c-list__item--selected[data-telemetry-id="document-row-doc-cloture-primaire"]',
    ) as HTMLElement | null;

    expect(selectedInTree)
      .withContext('cloture row selected in parcours list')
      .toBeTruthy();
  }));

  it('should scroll the active document row into view when navigating with prev/next', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-demande-primaire');
    fixture.detectChanges();

    const scrollSpy = spyOn(
      HTMLElement.prototype,
      'scrollIntoView',
    ).and.callThrough();
    const scrollBySpy = spyOn(
      HTMLElement.prototype,
      'scrollBy',
    ).and.callThrough();

    component.goToNextDocument();
    flushMicrotasks();
    flush();

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
    expect(scrollSpy.calls.any() || scrollBySpy.calls.any()).toBe(true);
  }));

  it('should scroll the documents list to the top when navigating to the first document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    const scroller = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-scroll',
    ) as HTMLElement;
    scroller.scrollTop = 500;

    const scrollToSpy = spyOn(scroller, 'scrollTo').and.callThrough();

    component.goToPreviousDocument();
    flushMicrotasks();
    flush();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(scrollToSpy).toHaveBeenCalled();
    const topScrollCall = scrollToSpy.calls
      .allArgs()
      .map((args) => args[0] as ScrollToOptions)
      .find((options) => options.top === 0);
    expect(topScrollCall).toEqual(
      jasmine.objectContaining({ top: 0, behavior: 'smooth' }),
    );
  }));

  it('should scroll the documents list to the bottom when navigating to the last document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.toggleCategoryVisibility('isoles');
    component.toggleCategoryVisibility('archives');
    fixture.detectChanges();

    component.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    const scroller = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-scroll',
    ) as HTMLElement;

    component.goToNextDocument();
    flushMicrotasks();
    flush();
    tick(32 * 10);
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe(
      'doc-archive-changement-adresse',
    );

    const maxTop = scroller.scrollHeight - scroller.clientHeight;
    expect(scroller.scrollTop).toBe(maxTop);
  }));

  it('should preserve selectedDocumentId when expanding a group that already contains the selection', () => {
    component.selectedDocumentId.set('doc-rechute');
    component.onExpandedGroupIdsChange([
      'parcours-demande-primaire',
      'parcours-rechute',
    ]);

    expect(component.selectedDocumentId()).toBe('doc-rechute');
  });

  it('should not change selection when expanding a parcours group while an isolés document is selected', () => {
    component.selectedDocumentId.set('doc-attestation-pedicure');
    component.onExpandedGroupIdsChange(['parcours-demande-primaire']);

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');
  });

  it('should keep isolés selection when derniere action filter is toggled repeatedly', fakeAsync(() => {
    component.selectedDocumentId.set('doc-attestation-pedicure');
    component.activeCategory.set('isoles');
    fixture.detectChanges();

    const toggleLastAction = () => {
      component.onInfoTagClick({
        label: 'Dernière action:',
        value: '09/06/2026',
        filterKey: 'last-action',
      });
      fixture.detectChanges();
      tick(1500);
    };

    toggleLastAction();
    toggleLastAction();
    toggleLastAction();
    toggleLastAction();

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');
    expect(component.activeCategory()).toBe('isoles');
    expect(component.openCategories()).toEqual(['isoles']);
  }));

  it('should not re-expand parcours when derniere action filter is cleared', () => {
    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();

    expect(component.openCategories()).toEqual(['isoles']);

    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();

    expect(component.openCategories()).toEqual(['isoles']);
    expect(component.openCategories()).not.toContain('parcours');
    expect(component.openCategories()).not.toContain('archives');
  });

  it('should keep standalone documents in isolés but out of parcours groups', () => {
    const groupDocumentIds = component
      .parcoursGroups()
      .flatMap((group) => group.documents.map((document) => document.id));

    expect(groupDocumentIds).not.toContain('doc-c4');
    expect(groupDocumentIds).not.toContain('doc-attestation-pedicure');
    expect(component.isolesItems().map((document) => document.id)).toEqual([
      'doc-attestation-pedicure',
      'doc-c4',
    ]);
  });

  it('should find isolated C4 by search in isolés category (Scenario 2)', () => {
    component.documentSearch.set('c4');
    fixture.detectChanges();

    expect(component.categories().map((category) => category.id)).toEqual([
      'parcours',
      'isoles',
      'archives',
    ]);
    expect(
      component.categories().find((category) => category.id === 'isoles')
        ?.count,
    ).toBe(1);
    expect(component.isolesItems()[0].id).toBe('doc-c4');
  });

  it('should open Transactions CICS dialog when panel action emits', () => {
    expect(component.transactionsCicsDialogVisible()).toBe(false);

    component.onTransactionsCicsOpen();
    fixture.detectChanges();

    expect(component.transactionsCicsDialogVisible()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('pds-transactions-cics-modal'),
    ).toBeTruthy();
  });

  it('should derive no comment-count tags for standalone doc-c4 without worker comment', () => {
    const tags = deriveDocumentTags('doc-c4');

    expect(tags.length).toBe(0);
  });

  it('should filter documents by selected sector', () => {
    component.onSectorChange({
      label: 'front-office',
      value: 'front-office',
    });
    fixture.detectChanges();

    expect(component.visibleDocuments().length).toBe(1);
    expect(component.visibleDocuments()[0].id).toBe('doc-attestation-pedicure');
  });

  it('should resolve sector filter when autocomplete emits primitive value', () => {
    component.onSectorChange('front-office');
    fixture.detectChanges();

    expect(component.selectedSector()).toEqual({
      label: 'front-office',
      value: 'front-office',
    });
    expect(component.visibleDocuments().length).toBe(1);
  });

  it('should keep Tous selected when autocomplete emits tous primitive', () => {
    component.onSectorChange('indemnites');
    component.onSectorChange('tous');
    fixture.detectChanges();

    expect(component.selectedSector()).toEqual({
      label: 'Tous',
      value: 'tous',
    });
    expect(component.visibleDocuments().length).toBe(7);
  });

  it('should resolve sort when autocomplete emits primitive value', () => {
    component.activeCategory.set('isoles');
    component.onSortChange('nom-document');
    fixture.detectChanges();

    expect(component.selectedSort()).toEqual({
      label: 'Nom du document',
      value: 'nom-document',
    });
    expect(component.isolesItems()[0].title).toBe('Attestation C4');
  });

  it('should show only isolés when front-office sector is selected', () => {
    component.onSectorChange({
      label: 'front-office',
      value: 'front-office',
    });
    fixture.detectChanges();

    expect(component.categories().map((category) => category.id)).toEqual([
      'parcours',
      'isoles',
      'archives',
    ]);
    expect(
      component.categories().find((category) => category.id === 'isoles')
        ?.enabled,
    ).toBe(true);
    expect(component.isolesItems().map((document) => document.id)).toEqual([
      'doc-attestation-pedicure',
    ]);
    expect(component.documentCount()).toBe(1);
  });

  it('should keep parcours groups when indemnites sector is selected', () => {
    component.onSectorChange({
      label: 'indémnités',
      value: 'indemnites',
    });
    fixture.detectChanges();

    expect(component.parcoursGroups().length).toBeGreaterThan(0);
    expect(component.documentCount()).toBe(5);
    expect(component.isolesItems().map((document) => document.id)).toEqual([
      'doc-c4',
    ]);
    expect(component.archivesItems().length).toBe(0);
  });

  it('should reset sector filter when Tous is selected', () => {
    component.onSectorChange({
      label: 'indémnités',
      value: 'indemnites',
    });
    component.onSectorChange({ label: 'Tous', value: 'tous' });
    fixture.detectChanges();

    expect(component.selectedSector()).toEqual({
      label: 'Tous',
      value: 'tous',
    });
    expect(component.visibleDocuments().length).toBe(7);
  });

  it('should sort isolés items by document name when nom-document sort is selected', () => {
    component.activeCategory.set('isoles');
    component.onSortChange({
      label: 'Nom du document',
      value: 'nom-document',
    });
    fixture.detectChanges();

    const titles = component.isolesItems().map((document) => document.title);
    expect(titles).toEqual(
      [...titles].sort((left, right) => left.localeCompare(right)),
    );
    expect(component.isolesItems()[0].title).toBe('Attestation C4');
  });

  it('should reorder parcours groups when nom-document sort is selected', () => {
    component.onSortChange('nom-document');
    fixture.detectChanges();

    expect(component.parcoursGroups().map((group) => group.id)).toEqual([
      'parcours-demande-primaire',
      'parcours-clotures',
      'parcours-rechute',
    ]);
  });

  it('should reorder parcours groups when actions-en-cours sort is selected', () => {
    component.onSortChange('actions-en-cours');
    fixture.detectChanges();

    expect(component.parcoursGroups().map((group) => group.id)).toEqual([
      'parcours-demande-primaire',
      'parcours-clotures',
      'parcours-rechute',
    ]);
  });

  describe('family member navigation', () => {
    it('should navigate to the selected family member dossier by NISS', () => {
      component.onFamilyMemberSelect({
        id: JACK_MOTA_NISS,
        initials: 'J',
        name: 'Jack Mota',
        relationship: 'enfant à charge',
      });

      expect(router.navigate).toHaveBeenCalledOnceWith([
        '/affiliate',
        JACK_MOTA_NISS,
      ]);
      expect(component.affiliateDetailDrawerVisible()).toBe(false);
    });

    it('should navigate to Quinten and Shiloh dossiers', () => {
      component.onFamilyMemberSelect({
        id: QUINTEN_MOTA_NISS,
        initials: 'Q',
        name: 'Quinten Mota',
        relationship: 'partenaire',
      });
      component.onFamilyMemberSelect({
        id: SHILOH_MOTA_NISS,
        initials: 'S',
        name: 'Shiloh Mota',
        relationship: 'enfant à charge',
      });

      expect(router.navigate).toHaveBeenCalledWith([
        '/affiliate',
        QUINTEN_MOTA_NISS,
      ]);
      expect(router.navigate).toHaveBeenCalledWith([
        '/affiliate',
        SHILOH_MOTA_NISS,
      ]);
    });

    it('should list all family members except self in Eva drawer data', () => {
      const family = component.affiliateDetailDrawerData().family;

      expect(family.map((member) => member.name)).toEqual([
        'Quinten Mota',
        'Shiloh Mota',
        'Jack Mota',
      ]);
      expect(family.every((member) => member.id)).toBe(true);
    });
  });
});

describe('AffiliateDetailsComponent — family dossiers', () => {
  async function createFixtureForAffiliate(
    affiliateId: string,
  ): Promise<ComponentFixture<AffiliateDetailsComponent>> {
    await TestBed.configureTestingModule({
      imports: [AffiliateDetailsComponent, FormsModule],
      providers: [
        BreadcrumbService,
        AffiliateHeaderService,
        MessageService,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: affiliateId })),
            snapshot: { paramMap: convertToParamMap({ id: affiliateId }) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AffiliateDetailsComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should not expose incapacity payment status action for non-Eva dossiers', async () => {
    const fixture = await createFixtureForAffiliate(JACK_MOTA_NISS);
    const header = TestBed.inject(AffiliateHeaderService).header();

    expect(fixture.componentInstance.statusAction()).toBeNull();
    expect(header?.statusAction).toBeNull();
  });

  it('should show Jack Mota minimal document dossier (Scenario 3)', async () => {
    const fixture = await createFixtureForAffiliate(JACK_MOTA_NISS);
    const component = fixture.componentInstance;

    expect(component.affiliateName()).toBe('Jack Mota');
    expect(component.visibleDocuments().length).toBe(1);
    expect(component.visibleDocuments()[0].id).toBe('doc-jack-certificat');
    expect(component.hasListResults()).toBe(true);
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__documents pds-empty-state',
      ),
    ).toBeFalsy();
  });

  it('should show affiliate-specific empty state for dossiers without documents', async () => {
    const fixture = await createFixtureForAffiliate(QUINTEN_MOTA_NISS);
    const component = fixture.componentInstance;

    expect(component.emptyListTitle()).toBe(
      'Aucun document actif pour cet affilié',
    );
    expect(
      fixture.nativeElement.querySelector('pds-empty-state')?.textContent,
    ).toContain('Aucun document actif pour cet affilié');
  });

  it('should show other family members in Jack drawer (excluding self)', async () => {
    const fixture = await createFixtureForAffiliate(JACK_MOTA_NISS);
    const component = fixture.componentInstance;

    expect(
      component.affiliateDetailDrawerData().family.map((m) => m.name),
    ).toEqual(['Eva Martinez', 'Quinten Mota', 'Shiloh Mota']);
  });

  it('should show parent and sibling labels in Jack drawer', async () => {
    const fixture = await createFixtureForAffiliate(JACK_MOTA_NISS);
    const family = fixture.componentInstance.affiliateDetailDrawerData().family;
    const byName = Object.fromEntries(
      family.map((member) => [member.name, member.relationship]),
    );

    expect(byName['Eva Martinez']).toBe('mère');
    expect(byName['Quinten Mota']).toBe('père');
    expect(byName['Shiloh Mota']).toBe('sœur');
  });

  it('should show parent and sibling labels in Shiloh drawer', async () => {
    const fixture = await createFixtureForAffiliate(SHILOH_MOTA_NISS);
    const family = fixture.componentInstance.affiliateDetailDrawerData().family;
    const byName = Object.fromEntries(
      family.map((member) => [member.name, member.relationship]),
    );

    expect(byName['Eva Martinez']).toBe('mère');
    expect(byName['Quinten Mota']).toBe('père');
    expect(byName['Jack Mota']).toBe('frère');
  });

  it('should keep Eva Martinez full mock documents on her dossier', async () => {
    const fixture = await createFixtureForAffiliate(EVA_MARTINEZ_NISS);
    const component = fixture.componentInstance;

    expect(component.visibleDocuments().length).toBe(7);
    expect(component.isEvaDossier()).toBe(true);
  });
});
