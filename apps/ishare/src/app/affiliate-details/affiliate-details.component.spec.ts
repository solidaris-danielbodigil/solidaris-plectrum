import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { of } from 'rxjs';
import type { ListDocumentItem, ListDocumentTag, ListDocumentTagTarget } from '@solidaris/ui';
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

  it('should render sticky affiliate documents toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector(
      'sds-toolbar.c-affiliate-documents-toolbar',
    );

    expect(toolbar).toBeTruthy();
    expect(toolbar.classList.contains('c-toolbar--sticky')).toBe(true);
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
    expect(component.journeyView()).toBe(true);
    expect(component.archivedOnly()).toBe(false);
  });

  it('should render five filter controls with expected labels', () => {
    const labels = [
      ...fixture.nativeElement.querySelectorAll('.c-form-field__label-text'),
    ].map((label) => (label as Element).textContent?.trim());

    expect(labels).toEqual([
      'Rechercher',
      'Secteur',
      'Trier par',
      'Vue parcours',
      'Documents archivés seulement',
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
      { labelFor: 'journey-view', controlId: 'journey-view' },
      { labelFor: 'archived-only', controlId: 'archived-only' },
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

  it('should mark the search icon as decorative', () => {
    const searchIcon = fixture.nativeElement.querySelector(
      '.c-affiliate-documents-toolbar__field .bi-search',
    );

    expect(searchIcon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render search input as a clearable text searchbox', () => {
    const searchInput = fixture.nativeElement.querySelector(
      '#document-search',
    ) as HTMLInputElement;

    expect(searchInput.type).toBe('text');
    expect(searchInput.getAttribute('role')).toBe('searchbox');
    expect(searchInput.placeholder).toBe('Rechercher document...');
    expect(searchInput.value).toBe('');
    expect(fixture.nativeElement.querySelector('sds-input-clear')).toBeTruthy();
  });

  it('should enable showClear on sector and sort autocompletes', () => {
    const autocompletes = fixture.debugElement.queryAll(By.directive(AutoComplete));

    expect(autocompletes.length).toBe(2);
    autocompletes.forEach((autocomplete) => {
      expect(autocomplete.componentInstance.showClear).toBe(true);
      expect(
        autocomplete.nativeElement.classList.contains('p-autocomplete-clearable'),
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

    expect(component.selectedSort()).toEqual({
      label: 'Date de réception',
      value: 'date-reception',
    });
  });

  it('should clear document search via sds-input-clear', () => {
    component.documentSearch.set('rechute');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      'sds-input-clear button',
    ) as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(component.documentSearch()).toBe('');
    expect(
      (fixture.nativeElement.querySelector('#document-search') as HTMLInputElement)
        .value,
    ).toBe('');
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
    ]);
    expect(
      header?.infoTags.some((tag) => tag.filterKey === 'closed-documents'),
    ).toBe(false);
    expect(header?.onInfoTagClick).toEqual(jasmine.any(Function));
    expect(header?.onPrimaryActionClick).toEqual(jasmine.any(Function));
    expect(header?.onStatusActionClick).toEqual(jasmine.any(Function));
    expect(header?.statusAction).toEqual(
      jasmine.objectContaining({
        label: 'C4 non reçu',
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
      fixture.nativeElement.querySelector('sds-affiliate-detail-drawer'),
    ).toBeTruthy();
  });

  it('should deep-link to demande primaire calcul panel when status action callback runs', () => {
    component.selectedDocumentId.set('doc-incapacite');
    component.documentFocus.set(null);
    component.expandedGroupIds.set([]);

    affiliateHeaderService.header()?.onStatusActionClick?.();
    fixture.detectChanges();

    expect(component.journeyView()).toBe(true);
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
      'sds-affiliate-detail-drawer',
    );
    expect(drawer).toBeTruthy();

    const sectionTitles = [
      ...fixture.nativeElement.querySelectorAll(
        '.c-affiliate-detail-drawer__section-title',
      ),
    ].map((title) => (title as Element).textContent?.trim());

    expect(sectionTitles).not.toContain('Notes');
    expect(
      fixture.nativeElement.querySelector('.c-affiliate-detail-drawer__notes'),
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

  it('should clear affiliate header on destroy', () => {
    fixture.destroy();

    expect(affiliateHeaderService.header()).toBeNull();
  });

  it('should render sds-list with journey groups when journey view is enabled', () => {
    component.journeyView.set(true);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('sds-list');
    expect(list).toBeTruthy();
    expect(list.classList.contains('c-list--journey')).toBe(true);
    expect(
      fixture.nativeElement.querySelectorAll('.c-list__item--group').length,
    ).toBe(3);
    expect(
      fixture.nativeElement.querySelector(
        '.p-tree-node-content:has(.c-list__item--group) > .p-tree-node-toggle-button',
      ),
    ).toBeTruthy();
  });

  it('should render flat sds-list without group togglers when journey view is disabled', () => {
    component.journeyView.set(false);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('sds-list');
    expect(list).toBeTruthy();
    expect(list.classList.contains('c-list--flat')).toBe(true);
    expect(
      fixture.nativeElement.querySelectorAll('.p-tree-node:not(.p-tree-node-leaf)').length,
    ).toBe(0);
    expect(
      fixture.nativeElement.querySelectorAll('.c-list__item--document').length,
    ).toBe(6);
  });

  it('should switch between grouped and flat list when journey view toggle changes', () => {
    const journeyToggle = fixture.nativeElement.querySelector(
      '#journey-view',
    ) as HTMLInputElement;
    expect(journeyToggle).toBeTruthy();

    expect(
      fixture.nativeElement.querySelector('sds-list.c-list--journey'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(
        '.p-tree-node-content:has(.c-list__item--group) > .p-tree-node-toggle-button',
      ),
    ).toBeTruthy();

    journeyToggle.click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('sds-list.c-list--flat'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelectorAll('.p-tree-node:not(.p-tree-node-leaf)').length,
    ).toBe(0);
    expect(
      fixture.nativeElement.querySelectorAll('.c-list__item--document').length,
    ).toBe(6);

    journeyToggle.click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('sds-list.c-list--journey'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelectorAll('.c-list__item--group').length,
    ).toBe(3);
  });

  it('should show only closed documents when archived-only filter is enabled', () => {
    component.archivedOnly.set(true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('.c-list__item--document').length,
    ).toBe(0);
    expect(
      fixture.nativeElement.querySelector('.c-affiliate-details__detail'),
    ).toBeNull();
  });

  it('should filter documents by search query in flat mode', () => {
    component.journeyView.set(false);
    component.documentSearch.set('rechute');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('.c-list__item--document').length,
    ).toBe(1);
  });

  it('should place toolbar at page level outside documents column', () => {
    const toolbar = fixture.nativeElement.querySelector(
      '.c-affiliate-details > sds-toolbar.c-affiliate-documents-toolbar',
    );
    const toolbarInDocuments = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents sds-toolbar',
    );

    expect(toolbar).toBeTruthy();
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
      documentsColumn?.querySelector('sds-list, sds-empty-state'),
    ).toBeTruthy();
    expect(detailPanel).toBeTruthy();
  });

  it('should render a text secondary sort button in the documents card header', () => {
    const sortButton = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-sort',
    ) as HTMLButtonElement;

    expect(sortButton).toBeTruthy();
    expect(sortButton.classList.contains('p-button-secondary')).toBe(true);
    expect(sortButton.getAttribute('aria-label')).toBe(
      'Trier du plus ancien au plus récent',
    );
    expect(sortButton.querySelector('.bi-sort-up')).toBeTruthy();
  });

  it('should toggle journey group order by start date when the sort button is clicked', () => {
    const initialGroupIds = (component.listGroups() ?? []).map((group) => group.id);

    const sortButton = fixture.nativeElement.querySelector(
      '.c-affiliate-details__documents-sort',
    ) as HTMLButtonElement;
    sortButton.click();
    fixture.detectChanges();

    const toggledGroupIds = (component.listGroups() ?? []).map((group) => group.id);

    expect(component.startDateSortAscending()).toBe(false);
    expect(toggledGroupIds).not.toEqual(initialGroupIds);
    expect(sortButton.getAttribute('aria-label')).toBe(
      'Trier du plus récent au plus ancien',
    );
    expect(sortButton.querySelector('.bi-sort-down')).toBeTruthy();
  });

  it('should select the first document when a journey group is expanded', () => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(
      fixture.nativeElement.querySelector('app-affiliate-document-detail'),
    ).toBeTruthy();
  });

  it('should expose six visible documents sorted by oldest reception date in journey mode', () => {
    expect(component.visibleDocuments().length).toBe(6);
    expect(component.visibleDocuments()[0].id).toBe('doc-demande-primaire');
    expect(component.visibleDocuments().at(-1)?.id).toBe(
      'doc-attestation-pedicure',
    );
  });

  it('should sort flat list by newest reception date by default', () => {
    component.journeyView.set(false);
    fixture.detectChanges();

    expect(component.listItems()[0].id).toBe('doc-attestation-pedicure');
    expect(component.listItems().at(-1)?.id).toMatch(
      /^doc-(demande-primaire|incapacite)$/,
    );
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
    expect(
      component.visibleDocuments().every((document) => document.status?.label !== 'Clôturé'),
    ).toBe(true);
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

  it('should omit closed-documents info tag when there are no closed documents', () => {
    const closedTag = component
      .infoTags()
      .find((tag) => tag.filterKey === 'closed-documents');

    expect(closedTag).toBeUndefined();
  });

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
    component.documentFocus.set({ stepValue: 2, panelId: 'compte-financier-liasse' });

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
            label: 'Feuilles de renseignement - F.D.R. affilié - Incapacité de travail',
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

  it('should derive warn count tag for doc-incapacite missing payment', () => {
    const tags = deriveDocumentTags('doc-incapacite');

    expect(tags).toEqual([
      {
        label: '1',
        severity: 'warn',
        icon: 'bi bi-exclamation-triangle-fill',
        ariaLabel: '1 avertissement',
        targets: [{ id: '1::paiement-incapacite', label: 'Paiement - Paiement' }],
      },
    ]);
  });

  it('should apply derived warn tag to doc-incapacite in visible documents', () => {
    const incapacite = component
      .visibleDocuments()
      .find((document) => document.id === 'doc-incapacite');

    expect(incapacite?.tags).toEqual(deriveDocumentTags('doc-incapacite'));
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
    expect(warnTagButton).withContext('single-target warn tag button').toBeTruthy();

    warnTagButton.click();
    fixture.detectChanges();

    expect(component.documentFocus()).toEqual({ stepValue: 3, panelId: 'calcul' });
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
    expect(infoTagButton).withContext('multi-target info tag button').toBeTruthy();

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

    component.goToNextDocument();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
  });

  it('should exclude standalone documents from journey-mode document navigation', () => {
    expandJourneyGroup(component, fixture, 'parcours-demande-primaire');

    expect(component.navigableDocuments().map((document) => document.id)).toEqual([
      'doc-demande-primaire',
      'doc-incapacite',
      'doc-rechute',
      'doc-cloture-primaire',
    ]);
    expect(component.navigableDocuments().map((document) => document.id)).not.toContain(
      'doc-c4',
    );

    component.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    component.goToNextDocument();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-rechute');
    expect(component.selectedDocumentId()).not.toBe('doc-c4');
  });

  it('should include standalone documents in flat-mode document navigation', () => {
    component.journeyView.set(false);
    fixture.detectChanges();

    expect(component.navigableDocuments().map((document) => document.id)).toContain(
      'doc-c4',
    );
    expect(component.navigableDocuments().map((document) => document.id)).toContain(
      'doc-attestation-pedicure',
    );

    component.selectedDocumentId.set('doc-rechute');
    fixture.detectChanges();

    component.goToNextDocument();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-c4');
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

  it('should preserve selectedDocumentId when expanding a group that already contains the selection', () => {
    component.selectedDocumentId.set('doc-rechute');
    component.onExpandedGroupIdsChange([
      'parcours-demande-primaire',
      'parcours-rechute',
    ]);

    expect(component.selectedDocumentId()).toBe('doc-rechute');
  });

  it('should exclude standalone documents from journey groups but include them in flat list items', () => {
    const groupDocumentIds = (component.listGroups() ?? []).flatMap((group) =>
      group.documents.map((document) => document.id),
    );

    expect(groupDocumentIds).not.toContain('doc-c4');
    expect(groupDocumentIds).not.toContain('doc-attestation-pedicure');

    component.journeyView.set(false);
    fixture.detectChanges();

    expect(component.listItems().map((document) => document.id)).toContain('doc-c4');
    expect(component.listItems().map((document) => document.id)).toContain(
      'doc-attestation-pedicure',
    );
  });

  it('should omit standalone hors-parcours documents from journey view list items', () => {
    component.journeyView.set(true);
    fixture.detectChanges();

    expect(component.listItems()).toEqual([]);

    const list = fixture.nativeElement.querySelector('sds-list');
    expect(list.textContent).not.toContain('Attestation C4');
    expect(list.textContent).not.toContain('Attestation de soin pédicure');
  });

  it('should find isolated C4 by search in flat mode (Scenario 2)', () => {
    component.journeyView.set(false);
    component.documentSearch.set('c4');
    fixture.detectChanges();

    expect(component.listItems().length).toBe(1);
    expect(component.listItems()[0].id).toBe('doc-c4');
  });

  it('should open Transactions CICS dialog when panel action emits', () => {
    expect(component.transactionsCicsDialogVisible()).toBe(false);

    component.onTransactionsCicsOpen();
    fixture.detectChanges();

    expect(component.transactionsCicsDialogVisible()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('sds-transactions-cics-modal'),
    ).toBeTruthy();
  });

  it('should derive no comment-count tags for standalone doc-c4 without worker comment', () => {
    const tags = deriveDocumentTags('doc-c4');

    expect(tags.length).toBe(0);
  });

  it('should show hors-parcours chip in documents card header when journey view is on', () => {
    component.journeyView.set(true);
    fixture.detectChanges();

    expect(component.horsParcoursChipLabel()).toBe('+ 2 hors parcours');
    expect(
      fixture.nativeElement.querySelector('.c-list__footnote'),
    ).toBeFalsy();
    const chip = fixture.nativeElement.querySelector(
      '.c-affiliate-details__hors-parcours-chip',
    );
    expect(chip).toBeTruthy();
    expect(chip.textContent).toContain('+ 2 hors parcours');
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-documents-toolbar__hors-parcours',
      ),
    ).toBeFalsy();
  });

  it('should disable journey view when hors-parcours chip is clicked', () => {
    component.journeyView.set(true);
    component.selectedDocumentId.set('doc-demande-primaire');
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector(
      '.c-affiliate-details__hors-parcours-chip',
    ) as HTMLButtonElement;
    chip.click();
    fixture.detectChanges();

    expect(component.journeyView()).toBe(false);
    expect(component.selectedDocumentId()).toBe(component.listItems()[0].id);
    expect(
      fixture.nativeElement.querySelector('sds-list.c-list--flat'),
    ).toBeTruthy();
  });

  it('should select first flat-list document when journey view is turned off', () => {
    component.journeyView.set(true);
    component.selectedDocumentId.set('doc-demande-primaire');
    fixture.detectChanges();

    component.onJourneyViewChange(false);

    expect(component.journeyView()).toBe(false);
    expect(component.selectedDocumentId()).toBe(component.listItems()[0].id);
  });

  it('should select first parcours document when journey view is turned back on', () => {
    component.journeyView.set(true);
    fixture.detectChanges();

    component.onJourneyViewChange(false);
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-attestation-pedicure');

    component.onJourneyViewChange(true);
    fixture.detectChanges();

    expect(component.journeyView()).toBe(true);
    expect(component.selectedDocumentId()).toBe('doc-demande-primaire');
    expect(component.expandedGroupIds()).toContain('parcours-demande-primaire');

    const detail = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).componentInstance as AffiliateDocumentDetailComponent;

    expect(detail.selectedDocumentId()).toBe('doc-demande-primaire');
  });

  it('should expose state-dependent journey view tooltip text', () => {
    component.journeyView.set(true);
    expect(component.journeyViewTooltip()).toBe(
      'Masque les documents hors parcours',
    );

    component.journeyView.set(false);
    expect(component.journeyViewTooltip()).toBe(
      'Affiche les documents par parcours',
    );
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

    expect(component.selectedSector()).toEqual({ label: 'Tous', value: 'tous' });
    expect(component.visibleDocuments().length).toBe(6);
  });

  it('should resolve sort when autocomplete emits primitive value', () => {
    component.journeyView.set(false);
    component.onSortChange('nom-document');
    fixture.detectChanges();

    expect(component.selectedSort()).toEqual({
      label: 'Nom du document',
      value: 'nom-document',
    });
    expect(component.listItems()[0].title).toBe('Attestation C4');
  });

  it('should show standalone pedicure in journey mode when front-office sector is selected', () => {
    component.journeyView.set(true);
    component.onSectorChange({
      label: 'front-office',
      value: 'front-office',
    });
    fixture.detectChanges();

    expect(component.shouldUseFlatListPresentation()).toBe(true);
    expect(component.hasListResults()).toBe(true);
    expect(component.listItems().map((document) => document.id)).toEqual([
      'doc-attestation-pedicure',
    ]);
    expect(component.documentCount()).toBe(1);
    expect(
      fixture.nativeElement.querySelector('sds-list')?.textContent,
    ).toContain('Attestation de soin pédicure');
  });

  it('should keep parcours groups when indemnites sector is selected in journey mode', () => {
    component.journeyView.set(true);
    component.onSectorChange({
      label: 'indémnités',
      value: 'indemnites',
    });
    fixture.detectChanges();

    expect(component.shouldUseFlatListPresentation()).toBe(false);
    expect(component.listGroups()?.length).toBeGreaterThan(0);
    expect(component.documentCount()).toBe(4);
    expect(component.listItems()).toEqual([]);
  });

  it('should reset sector filter when Tous is selected', () => {
    component.onSectorChange({
      label: 'indémnités',
      value: 'indemnites',
    });
    component.onSectorChange({ label: 'Tous', value: 'tous' });
    fixture.detectChanges();

    expect(component.selectedSector()).toEqual({ label: 'Tous', value: 'tous' });
    expect(component.visibleDocuments().length).toBe(6);
  });

  it('should sort flat list by document name when nom-document sort is selected', () => {
    component.journeyView.set(false);
    component.onSortChange({
      label: 'Nom du document',
      value: 'nom-document',
    });
    fixture.detectChanges();

    const titles = component.listItems().map((document) => document.title);
    expect(titles).toEqual([...titles].sort((left, right) => left.localeCompare(right)));
    expect(component.listItems()[0].title).toBe('Attestation C4');
  });

  it('should reorder journey groups when nom-document sort is selected', () => {
    component.journeyView.set(true);
    component.onSortChange('nom-document');
    fixture.detectChanges();

    expect(component.listGroups()?.map((group) => group.id)).toEqual([
      'parcours-demande-primaire',
      'parcours-clotures',
      'parcours-rechute',
    ]);
  });

  it('should reorder journey groups when actions-en-cours sort is selected', () => {
    component.journeyView.set(true);
    component.onSortChange('actions-en-cours');
    fixture.detectChanges();

    expect(component.listGroups()?.map((group) => group.id)).toEqual([
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
        '.c-affiliate-details__documents sds-empty-state',
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
      fixture.nativeElement.querySelector('sds-empty-state')?.textContent,
    ).toContain('Aucun document actif pour cet affilié');
  });

  it('should show other family members in Jack drawer (excluding self)', async () => {
    const fixture = await createFixtureForAffiliate(JACK_MOTA_NISS);
    const component = fixture.componentInstance;

    expect(component.affiliateDetailDrawerData().family.map((m) => m.name)).toEqual(
      ['Eva Martinez', 'Quinten Mota', 'Shiloh Mota'],
    );
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

    expect(component.visibleDocuments().length).toBe(6);
    expect(component.isEvaDossier()).toBe(true);
  });
});
