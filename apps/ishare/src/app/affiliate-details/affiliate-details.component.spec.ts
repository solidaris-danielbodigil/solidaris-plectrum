import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
  tick,
} from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { of } from 'rxjs';
import type {
  ListEntryItem,
  ListEntryTag,
  ListEntryTagTarget,
} from '@solidaris-danielbodigil/pds-ui';
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

function clickElement(host: HTMLElement): void {
  const target =
    host.closest('button') ??
    host.querySelector<HTMLElement>('button, [role="button"]') ??
    host;
  target.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true }),
  );
}

type CategoryId = 'parcours' | 'isoles' | 'archives';

function categoryTab(
  fixture: ComponentFixture<AffiliateDetailsComponent>,
  id: CategoryId,
): HTMLElement {
  return fixture.nativeElement.querySelector(
    `[data-telemetry-id="category-tab-${id}"]`,
  ) as HTMLElement;
}

/** The p-tabpanel the category tab controls (resolved through `aria-controls`). */
function categoryPanel(
  fixture: ComponentFixture<AffiliateDetailsComponent>,
  id: CategoryId,
): HTMLElement | null {
  const panelId = categoryTab(fixture, id).getAttribute('aria-controls');
  return fixture.nativeElement.querySelector(`[id="${panelId}"]`);
}

/** Ids of the categories whose tab panel is shown (not `hidden`). */
function shownCategoryPanels(
  fixture: ComponentFixture<AffiliateDetailsComponent>,
): CategoryId[] {
  return (['parcours', 'isoles', 'archives'] as const).filter(
    (id) => categoryPanel(fixture, id)?.hidden === false,
  );
}

/** Viewport helpers poll with setTimeout; advance far enough for a few retries. */
function flushViewportSettling(): void {
  tick(400);
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
          useValue: { navigate: vi.fn() },
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

  it('should render the documents filter toolbar by default', () => {
    const toolbar = fixture.nativeElement.querySelector(
      'pds-toolbar.c-affiliate-documents-toolbar',
    ) as HTMLElement;

    expect(toolbar).toBeTruthy();
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
    expect(toolbar.hasAttribute('inert')).toBe(false);
    expect(toolbar.closest('[aria-hidden="true"], [inert]')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.c-affiliate-documents-toolbar-shell'),
    ).toBeNull();
  });

  it('should not render a Filtres toggle or a collapse control', () => {
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="documents-filters-toggle"]',
      ),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="documents-filter-toolbar-close"]',
      ),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Masquer les filtres"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__card-header p-togglebutton',
      ),
    ).toBeNull();
  });

  it('should render the documents search as the first toolbar field', () => {
    const toolbar = fixture.nativeElement.querySelector(
      'pds-toolbar.c-affiliate-documents-toolbar',
    ) as HTMLElement;
    const firstField = toolbar.querySelector(
      '.c-affiliate-documents-toolbar__row > .c-affiliate-documents-toolbar__field',
    ) as HTMLElement;
    const searchInput = firstField.querySelector(
      '#document-search',
    ) as HTMLInputElement;

    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('role')).toBe('searchbox');
    expect(searchInput.placeholder).toBe('Rechercher document...');
    expect(searchInput.getAttribute('data-telemetry-id')).toBe('document-search');
    expect(
      firstField.querySelector('label.c-form-field__label[for="document-search"]')
        ?.textContent?.trim(),
    ).toBe('Rechercher un document');
  });

  it('should not render the documents search in the documents card header', () => {
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__card-header #document-search',
      ),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__documents-header-actions, .c-affiliate-details__documents-search',
      ),
    ).toBeNull();
  });

  it('should keep the documents search when the toolbar filters are cleared', () => {
    component.documentSearch.set('rechute');
    fixture.detectChanges();
    const searchBefore = fixture.nativeElement.querySelector('#document-search');

    component.clearToolbarFilters();
    fixture.detectChanges();

    expect(component.documentSearch()).toBe('rechute');
    // The search sits outside the remount block, so it keeps its element (and typing focus).
    expect(fixture.nativeElement.querySelector('#document-search')).toBe(
      searchBefore,
    );
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
    expect(component.activeCategory()).toBe('parcours');
    expect(component.selectedCategoryTab()).toBe('parcours');
  });

  it('should render the search and three filter controls with expected labels', () => {
    const labels = [
      ...fixture.nativeElement.querySelectorAll('.c-form-field__label-text'),
    ].map((label) => (label as Element).textContent?.trim());

    expect(labels).toEqual([
      'Rechercher un document',
      'Secteur',
      'Trier par',
      'Filtrer par date',
    ]);
  });

  it('should associate labels with controls via matching input ids', () => {
    const associations: Array<{
      labelFor: string | null;
      controlId: string | null;
    }> = [
      { labelFor: 'document-search', controlId: 'document-search' },
      { labelFor: 'document-sector', controlId: 'document-sector' },
      { labelFor: 'document-sort', controlId: 'document-sort' },
      { labelFor: 'document-date-range', controlId: 'document-date-range' },
    ];

    associations.forEach(({ labelFor, controlId }) => {
      const label = fixture.nativeElement.querySelector(
        `label.c-form-field__label[for="${labelFor}"]`,
      );
      const control = fixture.nativeElement.querySelector(`#${controlId}`);

      expect(label, `label for="${labelFor}"`).toBeTruthy();
      expect(control, `control id="${controlId}"`).toBeTruthy();
    });
  });

  it('should not render journey-view or archived-only toolbar toggles', () => {
    expect(fixture.nativeElement.querySelector('#journey-view')).toBeNull();
    expect(fixture.nativeElement.querySelector('#archived-only')).toBeNull();
  });

  it('should mark the toolbar search icon as decorative', () => {
    const searchIcon = fixture.nativeElement.querySelector(
      '.c-affiliate-documents-toolbar .bi-search',
    );

    expect(searchIcon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the toolbar search input as a clearable text searchbox', () => {
    const searchInput = fixture.nativeElement.querySelector(
      '#document-search',
    ) as HTMLInputElement;

    expect(searchInput.type).toBe('text');
    expect(searchInput.getAttribute('role')).toBe('searchbox');
    expect(searchInput.placeholder).toBe('Rechercher document...');
    expect(searchInput.value).toBe('');
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar pds-input-clear',
      ),
    ).toBeTruthy();
  });

  it('should enable showClear on sector and sort autocompletes', () => {
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
    const sortAutocomplete = fixture.debugElement
      .queryAll(By.directive(AutoComplete))
      .find((autocomplete) =>
        autocomplete.nativeElement.querySelector('#document-sort'),
      );

    sortAutocomplete?.componentInstance.clear();
    fixture.detectChanges();

    expect(component.selectedSort()).toBeNull();
  });

  it('should clear document search via pds-input-clear in the toolbar', () => {
    component.documentSearch.set('rechute');
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(
      By.css('.c-affiliate-documents-toolbar pds-input-clear button'),
    );
    clearButton.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.documentSearch()).toBe('');
  });

  it('should show an active filter count badge inside the toolbar clear action', () => {
    component.onSectorChange({ label: 'médical', value: 'medical' });
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-clear"]',
    ) as HTMLButtonElement;
    const badge = fixture.nativeElement.querySelector('.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-count"]');

    expect(clearButton).toBeTruthy();
    expect(clearButton.contains(badge)).toBe(true);
    expect(badge.textContent).toContain('2');
    expect(clearButton.getAttribute('aria-label')).toBe(
      'Effacer les filtres (2 actifs)',
    );
    expect(clearButton.textContent).toContain('Effacer les filtres');
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
        '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-count"]',
      )?.textContent,
    ).toContain('2');
  });

  it('should count default sort alone as an active toolbar filter', () => {
    expect(component.activeToolbarFilterCount()).toBe(1);
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-count"]',
      )?.textContent,
    ).toContain('1');
    // Singular agreement in the accessible name — "1 actif", not "1 actifs".
    expect(
      fixture.nativeElement
        .querySelector(
          '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-clear"]',
        )
        ?.getAttribute('aria-label'),
    ).toBe('Effacer les filtres (1 actif)');
  });

  it('should hide the clear action when no toolbar filter is active', () => {
    component.onSortChange(null);
    fixture.detectChanges();

    expect(component.activeToolbarFilterCount()).toBe(0);
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-clear"]',
      ),
    ).toBeNull();
  });

  it('should clear toolbar filters and focus the sector field when the clear action is clicked', () => {
    component.onSectorChange({ label: 'médical', value: 'medical' });
    component.onSortChange({ label: 'Nom du document', value: 'nom-document' });
    component.documentFilterDateRange.set([
      new Date(2026, 5, 1),
      new Date(2026, 5, 10),
    ]);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-clear"]',
    ) as HTMLButtonElement;
    clearButton.focus();
    clickElement(clearButton);
    // Full app tick (inside the zone, as in the running app) so the
    // afterNextRender focus hand-off runs.
    TestBed.inject(NgZone).run(() => TestBed.tick());

    expect(component.selectedSector()).toBeNull();
    expect(component.selectedSort()).toBeNull();
    expect(component.documentFilterDateRange()).toBeNull();
    expect(component.activeToolbarFilterCount()).toBe(0);
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-clear"]',
      ),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-count"]',
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
    expect(document.activeElement).toBe(sectorInput);
  });

  it('should announce the active filter count in a polite live region', () => {
    const status = (): HTMLElement =>
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar [role="status"]',
      ) as HTMLElement;

    // Default sort counts as one active filter.
    expect(status()).toBeTruthy();
    expect(status().getAttribute('aria-live')).toBe('polite');
    expect(status().classList.contains('u-sr-only')).toBe(true);
    expect(status().textContent?.trim()).toBe('1 filtre actif');

    component.onSectorChange({ label: 'médical', value: 'medical' });
    fixture.detectChanges();
    expect(status().textContent?.trim()).toBe('2 filtres actifs');

    // Clearing a field one by one down to zero leaves the region empty (still rendered).
    component.onSectorChange(null);
    component.onSortChange(null);
    fixture.detectChanges();
    expect(status()).toBeTruthy();
    expect(status().textContent?.trim()).toBe('');
  });

  it('should announce "Filtres effacés" after the clear action until a filter is set again', () => {
    const status = (): string | undefined =>
      (
        fixture.nativeElement.querySelector(
          '.c-affiliate-documents-toolbar [role="status"]',
        ) as HTMLElement
      ).textContent?.trim();

    clickElement(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar [data-telemetry-id="documents-filters-clear"]',
      ) as HTMLButtonElement,
    );
    TestBed.inject(NgZone).run(() => TestBed.tick());
    expect(status()).toBe('Filtres effacés');

    component.onSectorChange({ label: 'médical', value: 'medical' });
    fixture.detectChanges();
    expect(status()).toBe('1 filtre actif');

    component.onSectorChange(null);
    fixture.detectChanges();
    expect(status()).toBe('');
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
      expect.objectContaining({
        label: 'Dernière action:',
        value: '09/06/2026',
        filterKey: 'last-action',
      }),
      expect.objectContaining({
        label: 'Documents actifs:',
        value: '6',
        filterKey: 'active-documents',
      }),
      expect.objectContaining({
        label: 'Documents clôturés:',
        value: '1',
        filterKey: 'closed-documents',
      }),
    ]);
    expect(
      header?.infoTags.some((tag) => tag.filterKey === 'closed-documents'),
    ).toBe(true);
    expect(header?.onInfoTagClick).toEqual(expect.any(Function));
    expect(header?.onPrimaryActionClick).toEqual(expect.any(Function));
    expect(header?.onStatusActionClick).toEqual(expect.any(Function));
    expect(header?.onStatusMenuSelect).toEqual(expect.any(Function));
    expect(header?.statusAction).toEqual(
      expect.objectContaining({
        label: 'Actions à réaliser',
        severity: 'warn',
        menuItems: expect.arrayContaining([
          expect.objectContaining({ label: 'C4 non reçu' }),
          expect.objectContaining({
            label: "Exemple d'autre action à réaliser",
            disabled: true,
          }),
        ]),
      }),
    );
  });

  it('should open affiliate detail drawer when primary action callback runs', () => {
    expect(component.affiliateDetailDrawerVisible()).toBe(false);

    affiliateHeaderService.header()?.onPrimaryActionClick?.();
    fixture.detectChanges();

    expect(component.affiliateDetailDrawerVisible()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('pds-profile-drawer'),
    ).toBeTruthy();
  });

  it('should deep-link to demande primaire calcul panel when status action callback runs', () => {
    component.selectedDocumentId.set('doc-incapacite');
    component.documentFocus.set(null);
    component.expandedGroupIds.set([]);

    affiliateHeaderService.header()?.onStatusActionClick?.();
    fixture.detectChanges();

    expect(component.activeCategory()).toBe('parcours');
    expect(shownCategoryPanels(fixture)).toEqual(['parcours']);
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

  it('should ignore disabled status menu placeholder selection', () => {
    component.selectedDocumentId.set('doc-incapacite');
    component.documentFocus.set(null);
    fixture.detectChanges();

    affiliateHeaderService.header()?.onStatusMenuSelect?.({
      id: 'eva-status-action-placeholder',
      label: "Exemple d'autre action à réaliser",
      disabled: true,
    });
    fixture.detectChanges();

    expect(component.selectedCategoryTab()).toBe('parcours');
    expect(component.selectedDocumentId()).toBe('doc-incapacite');
    expect(component.documentFocus()).toBeNull();
  });

  it('should hide the Notes section in the affiliate detail drawer', () => {
    component.affiliateDetailDrawerVisible.set(true);
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('pds-profile-drawer');
    expect(drawer).toBeTruthy();

    const sectionTitles = [
      ...fixture.nativeElement.querySelectorAll('.c-drawer__section-title'),
    ].map((title) => (title as Element).textContent?.trim());

    expect(sectionTitles).not.toContain('Notes');
    expect(
      fixture.nativeElement.querySelector('.c-drawer__profile-notes'),
    ).toBeNull();
  });

  it('should show a success toast when a drawer identifier is copied', () => {
    const addSpy = vi.spyOn(messageService, 'add');

    component.onDrawerIdentifierCopy({ label: 'Territoire', value: '319' });

    expect(addSpy).toHaveBeenCalledTimes(1);

    expect(addSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Copié !',
      detail: 'Territoire: 319',
    });
  });

  it('should show an info toast for drawer placeholder actions', () => {
    const addSpy = vi.spyOn(messageService, 'add');
    const expectedToast = {
      severity: 'info',
      summary: 'Bientôt disponible',
      detail: 'Cette fonctionnalité sera disponible prochainement.',
    };

    component.onDrawerMenuClick();
    component.onDrawerQuickActionsClick();
    component.onDrawerCallClick();
    component.onDrawerEmailClick();
    component.onDelayPredictionMenuClick();
    component.onDrawerViewChange('documents');

    expect(addSpy).toHaveBeenCalledTimes(6);
    for (let i = 0; i < 6; i++) {
      expect(vi.mocked(addSpy).mock.calls[i][0]).toEqual(expectedToast);
    }
  });

  it('should not show a toast when the drawer Détails view is selected', () => {
    const addSpy = vi.spyOn(messageService, 'add');

    component.onDrawerViewChange('details');

    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should clear affiliate header on destroy', () => {
    fixture.destroy();

    expect(affiliateHeaderService.header()).toBeNull();
  });

  it('should expose category counts Parcours 4 / Documents 2 / Archivés 1', () => {
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
      expect(tab.querySelector('p-badge, .p-badge')).toBeTruthy();
    });
    expect(
      fixture.nativeElement.querySelector(
        '[data-telemetry-id="category-tab-isoles"]',
      ),
    ).toBeTruthy();
    const isolesLabel = fixture.nativeElement.querySelector(
      '[data-telemetry-id="category-tab-isoles"] .c-affiliate-details__category-tab-label',
    );
    expect(isolesLabel?.textContent?.trim()).toBe('Documents');
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
    expect(archivesTab.classList.contains('p-disabled')).toBe(true);
    expect(archivesTab.getAttribute('aria-disabled')).toBe('true');
    expect(archivesTab.getAttribute('tabindex')).toBe('-1');
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

  it('should fall back to the enabled tab and show its panel when the filter empties the selected tab', () => {
    expect(shownCategoryPanels(fixture)).toEqual(['parcours']);

    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '1',
      filterKey: 'closed-documents',
    });
    fixture.detectChanges();

    expect(component.selectedCategoryTab()).toBe('archives');
    expect(categoryTab(fixture, 'archives').getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
  });

  it('should disable empty category tabs and render no list in their panels', () => {
    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '1',
      filterKey: 'closed-documents',
    });
    fixture.detectChanges();

    for (const id of ['parcours', 'isoles'] as const) {
      const tab = categoryTab(fixture, id);
      expect(tab.getAttribute('aria-disabled')).toBe('true');
      expect(tab.getAttribute('tabindex')).toBe('-1');
      expect(categoryPanel(fixture, id)?.hidden).toBe(true);
      expect(categoryPanel(fixture, id)?.querySelector('pds-list')).toBeNull();
    }
    expect(
      categoryPanel(fixture, 'archives')?.querySelectorAll('.c-list__item--entry')
        .length,
    ).toBe(1);
  });

  it('should not render category accordions in the documents card', () => {
    const documentsCard = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents',
    ) as HTMLElement;

    expect(documentsCard.querySelector('p-accordion')).toBeNull();
    expect(documentsCard.querySelector('p-accordion-header')).toBeNull();
  });

  it('should render one tab panel per category, each labelled by the tab that controls it', () => {
    const tabs = [
      ...fixture.nativeElement.querySelectorAll(
        '.c-affiliate-details__category-tabs [role="tab"]',
      ),
    ] as HTMLElement[];
    const panels = [
      ...fixture.nativeElement.querySelectorAll(
        '.c-affiliate-details__category-tabs [role="tabpanel"]',
      ),
    ] as HTMLElement[];

    expect(tabs.length).toBe(3);
    expect(panels.length).toBe(3);

    tabs.forEach((tab) => {
      const controls = tab.getAttribute('aria-controls');
      const panel = panels.find((item) => item.id === controls);

      expect(controls).toBeTruthy();
      expect(panel, `${tab.id} controls an existing tabpanel`).toBeTruthy();
      expect(panel?.getAttribute('aria-labelledby')).toBe(tab.id);
    });
  });

  it('should show only the selected category panel', () => {
    expect(component.selectedCategoryTab()).toBe('parcours');
    expect(shownCategoryPanels(fixture)).toEqual(['parcours']);
    expect(categoryPanel(fixture, 'isoles')?.hidden).toBe(true);
    expect(categoryPanel(fixture, 'archives')?.hidden).toBe(true);
  });

  it('should render the parcours journey list inside the parcours tab panel', () => {
    const parcoursList = categoryPanel(fixture, 'parcours')?.querySelector(
      'pds-list',
    );

    expect(parcoursList).toBeTruthy();
    expect(parcoursList?.classList.contains('c-list--journey')).toBe(true);
    expect(
      categoryPanel(fixture, 'parcours')?.querySelectorAll(
        '.c-list__item--group',
      ).length,
    ).toBe(3);
  });

  it('should render flat lists inside the isolés and archivés tab panels', () => {
    const isolesList = categoryPanel(fixture, 'isoles')?.querySelector(
      'pds-list',
    );
    const archivesList = categoryPanel(fixture, 'archives')?.querySelector(
      'pds-list',
    );

    expect(isolesList?.classList.contains('c-list--flat')).toBe(true);
    expect(archivesList?.classList.contains('c-list--flat')).toBe(true);
    expect(
      categoryPanel(fixture, 'isoles')?.querySelectorAll('.c-list__item--entry')
        .length,
    ).toBe(2);
    expect(
      categoryPanel(fixture, 'archives')?.querySelectorAll(
        '.c-list__item--entry',
      ).length,
    ).toBe(1);
  });

  it('should not render category visibility toggles on the tabs', () => {
    expect(
      fixture.nativeElement.querySelector('[data-telemetry-id^="category-toggle-"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-details__category-tab .bi-eye, .c-affiliate-details__category-tab .bi-eye-slash',
      ),
    ).toBeNull();
  });

  it('should render three content-sized, left-aligned category tabs (PrimeNG default)', () => {
    const tabs = [
      ...fixture.nativeElement.querySelectorAll(
        '.c-affiliate-details__category-tab',
      ),
    ] as HTMLElement[];

    expect(tabs.length).toBe(3);
    tabs.forEach((tab) => {
      expect(tab.classList.contains('o-flex__item--4')).toBe(false);
      expect(tab.classList.contains('o-flex__item--grow-1')).toBe(false);
      expect(tab.classList.contains('o-flex__item--shrink-0')).toBe(false);
      expect(tab.classList.contains('o-flex--justify-content-center')).toBe(
        false,
      );
    });
  });

  it('should not render the stepper-view A/B toggle in the detail header', () => {
    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(
      fixture.nativeElement.querySelector(
        ".c-affiliate-details__detail p-selectbutton, [aria-label=\"Mode d'affichage du parcours\"]",
      ),
    ).toBeNull();
  });

  it('should name the category tab list', () => {
    const tablist = fixture.nativeElement.querySelector(
      '.c-affiliate-details__category-tabs [role="tablist"]',
    ) as HTMLElement;

    expect(tablist.getAttribute('aria-label')).toBe('Catégories de documents');
  });

  it('should fill the active tab count badge and keep inactive ones secondary', () => {
    const badgeFor = (id: string): HTMLElement =>
      fixture.nativeElement.querySelector(
        `[data-telemetry-id="category-tab-${id}"] .p-badge`,
      ) as HTMLElement;

    expect(component.selectedCategoryTab()).toBe('parcours');
    expect(badgeFor('parcours').classList.contains('p-badge-secondary')).toBe(
      false,
    );
    expect(badgeFor('isoles').classList.contains('p-badge-secondary')).toBe(
      true,
    );
    expect(badgeFor('archives').classList.contains('p-badge-secondary')).toBe(
      true,
    );
  });

  it('should show the Archivés panel when the Archivés tab is clicked', () => {
    expect(categoryPanel(fixture, 'archives')?.hidden).toBe(true);

    categoryTab(fixture, 'archives').click();
    fixture.detectChanges();

    expect(component.activeCategory()).toBe('archives');
    expect(categoryTab(fixture, 'archives').getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
    // Switching tabs does not change the document shown in the detail card.
    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
  });

  it('should show the other list when switching tab and start it at the top', () => {
    const scroller = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-scroll',
    ) as HTMLElement;
    scroller.scrollTop = 120;

    component.onCategoryTabChange('isoles');
    fixture.detectChanges();

    expect(component.activeCategory()).toBe('isoles');
    expect(scroller.scrollTop).toBe(0);
    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);
    expect(
      categoryPanel(fixture, 'isoles')?.querySelectorAll('.c-list__item--entry')
        .length,
    ).toBe(2);
  });

  it('should select a tab with Enter after moving focus with the arrow keys', () => {
    const parcoursTab = categoryTab(fixture, 'parcours');
    parcoursTab.focus();
    parcoursTab.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();

    const isolesTab = categoryTab(fixture, 'isoles');
    expect(document.activeElement).toBe(isolesTab);
    // Focus alone does not select (PrimeNG selectOnFocus is off).
    expect(shownCategoryPanels(fixture)).toEqual(['parcours']);

    isolesTab.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();

    expect(component.selectedCategoryTab()).toBe('isoles');
    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);
  });

  it('should switch the tab when a document of another category is selected programmatically', () => {
    categoryTab(fixture, 'archives').click();
    fixture.detectChanges();
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);

    component.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    expect(component.selectedCategoryTab()).toBe('isoles');
    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);
    expect(
      categoryPanel(fixture, 'isoles')?.querySelector(
        '.c-list__item--selected[data-telemetry-id="document-row-doc-c4"]',
      ),
    ).toBeTruthy();
  });

  it('should keep the selected tab when a filter change keeps the selection in another category', fakeAsync(() => {
    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    categoryTab(fixture, 'archives').click();
    fixture.detectChanges();

    component.documentSearch.set('a');
    fixture.detectChanges();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(component.selectedCategoryTab()).toBe('archives');
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
  }));

  it('should show closed-documents info tag when archived documents exist', () => {
    const closedTag = component
      .infoTags()
      .find((tag) => tag.filterKey === 'closed-documents');

    expect(closedTag).toEqual(
      expect.objectContaining({
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
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
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
    expect(component.selectedCategoryTab()).toBe('parcours');
    expect(component.parcoursGroups()[0].documents[0].id).toBe('doc-rechute');
  });

  it('should place the filter toolbar at page level outside documents column', () => {
    const toolbar = fixture.nativeElement.querySelector(
      '.c-affiliate-details > pds-toolbar.c-affiliate-documents-toolbar',
    );
    const toolbarInDocuments = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents .c-affiliate-documents-toolbar',
    );

    expect(toolbar).toBeTruthy();
    expect(toolbar?.classList.contains('o-layout--margin-block-end-2')).toBe(
      true,
    );
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
        'p-tabpanels pds-list, pds-empty-state',
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
    flushViewportSettling();

    const scrollSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    const scrollBySpy = vi.spyOn(HTMLElement.prototype, 'scrollBy');

    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();
    flushMicrotasks();
    flushViewportSettling();

    expect(component.documentInfoFilter()).toBeNull();
    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');
    expect(
      vi.mocked(scrollSpy).mock.calls.length > 0 ||
        vi.mocked(scrollBySpy).mock.calls.length > 0,
    ).toBe(true);
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
    const doc: ListEntryItem = {
      id: 'doc-incapacite',
      title: 'Incapacité',
    };
    const target: ListEntryTagTarget = {
      id: '2::compte-financier-liasse',
      label: 'Feuilles de renseignement - Compte financier - Liasse',
    };
    const tag: ListEntryTag = {
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
    expect(tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
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
        expect.objectContaining({
          label: '1',
          severity: 'warn',
          icon: 'bi bi-exclamation-triangle-fill',
          ariaLabel: '1 avertissement',
          targets: [{ id: '3::calcul', label: 'Calcul - Calcul' }],
        }),
      ]),
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

  it('should return no derived tags for doc-incapacite without panel comments', () => {
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
    expect(warnTagButton, 'single-target warn tag button').toBeTruthy();

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
    expect(infoTagButton, 'multi-target info tag button').toBeTruthy();

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
    flushViewportSettling();
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
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');

    component.goToNextDocument();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-c4');

    component.goToNextDocument();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe(
      'doc-archive-changement-adresse',
    );
    expect(component.activeCategory()).toBe('archives');
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
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
    expect(component.activeCategory()).toBe('archives');
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
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
      '.c-list__item--entry.c-list__item--selected',
    ) as HTMLElement | null;

    expect(selectedInTree?.textContent).toContain('Rechute');
  });

  it('should switch to the Archivés tab when next navigates from the last isolés document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);

    component.goToNextDocument();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe(
      'doc-archive-changement-adresse',
    );
    expect(component.activeCategory()).toBe('archives');
    expect(shownCategoryPanels(fixture)).toEqual(['archives']);
  }));

  it('should switch to the Documents tab when next navigates from the last parcours document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-cloture-primaire');
    fixture.detectChanges();

    expect(shownCategoryPanels(fixture)).toEqual(['parcours']);

    component.goToNextDocument();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');
    expect(component.activeCategory()).toBe('isoles');
    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);
  }));

  it('should select and reveal the last parcours document when navigating back from isolés', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    component.selectedDocumentId.set('doc-attestation-pedicure');
    component.activeCategory.set('isoles');
    fixture.detectChanges();

    expect(component.expandedGroupIds()).not.toContain('parcours-clotures');

    component.goToPreviousDocument();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-cloture-primaire');
    expect(component.activeCategory()).toBe('parcours');
    expect(shownCategoryPanels(fixture)).toEqual(['parcours']);
    expect(component.expandedGroupIds()).toContain('parcours-clotures');

    const selectedInTree = fixture.nativeElement.querySelector(
      '.c-list__item--entry.c-list__item--selected[data-telemetry-id="document-row-doc-cloture-primaire"]',
    ) as HTMLElement | null;

    expect(
      selectedInTree,
      'cloture row selected in parcours list',
    ).toBeTruthy();
  }));

  it('should scroll the active document row into view when navigating with prev/next', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-demande-primaire');
    fixture.detectChanges();

    const scrollSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    const scrollBySpy = vi.spyOn(HTMLElement.prototype, 'scrollBy');

    component.goToNextDocument();
    flushMicrotasks();
    flushViewportSettling();

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
    expect(
      vi.mocked(scrollSpy).mock.calls.length > 0 ||
        vi.mocked(scrollBySpy).mock.calls.length > 0,
    ).toBe(true);
  }));

  it('should scroll the documents list to the top when navigating to the first document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');
    component.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    const scroller = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-scroll',
    ) as HTMLElement;
    scroller.scrollTop = 500;

    const scrollToSpy = vi.spyOn(scroller, 'scrollTo');

    component.goToPreviousDocument();
    flushMicrotasks();
    flushViewportSettling();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(scrollToSpy).toHaveBeenCalled();
    const topScrollCall = vi
      .mocked(scrollToSpy)
      .mock.calls.map((args) => args[0] as ScrollToOptions)
      .find((options) => options.top === 0);
    expect(topScrollCall).toEqual(
      expect.objectContaining({ top: 0, behavior: 'smooth' }),
    );
  }));

  it('should scroll the documents list to the bottom when navigating to the last document', fakeAsync(() => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    component.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    const scroller = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-scroll',
    ) as HTMLElement;

    component.goToNextDocument();
    flushMicrotasks();
    flushViewportSettling();
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
    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);
  }));

  it('should stay on the isolés tab when derniere action filter is cleared', () => {
    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();

    expect(component.selectedCategoryTab()).toBe('isoles');

    component.onInfoTagClick({
      label: 'Dernière action:',
      value: '09/06/2026',
      filterKey: 'last-action',
    });
    fixture.detectChanges();

    expect(component.selectedCategoryTab()).toBe('isoles');
    expect(shownCategoryPanels(fixture)).toEqual(['isoles']);
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

      expect(router.navigate).toHaveBeenCalledTimes(1);

      expect(router.navigate).toHaveBeenCalledWith([
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
      const family = component.affiliateDetailDrawerData().relatedMembers;

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
          useValue: { navigate: vi.fn() },
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
      component.affiliateDetailDrawerData().relatedMembers.map((m) => m.name),
    ).toEqual(['Eva Martinez', 'Quinten Mota', 'Shiloh Mota']);
  });

  it('should show parent and sibling labels in Jack drawer', async () => {
    const fixture = await createFixtureForAffiliate(JACK_MOTA_NISS);
    const family =
      fixture.componentInstance.affiliateDetailDrawerData().relatedMembers;
    const byName = Object.fromEntries(
      family.map((member) => [member.name, member.relationship]),
    );

    expect(byName['Eva Martinez']).toBe('mère');
    expect(byName['Quinten Mota']).toBe('père');
    expect(byName['Shiloh Mota']).toBe('sœur');
  });

  it('should show parent and sibling labels in Shiloh drawer', async () => {
    const fixture = await createFixtureForAffiliate(SHILOH_MOTA_NISS);
    const family =
      fixture.componentInstance.affiliateDetailDrawerData().relatedMembers;
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
