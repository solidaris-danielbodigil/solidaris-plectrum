import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
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

describe('AffiliateDetailsComponent', () => {
  let component: AffiliateDetailsComponent;
  let fixture: ComponentFixture<AffiliateDetailsComponent>;
  let breadcrumbService: BreadcrumbService;
  let affiliateHeaderService: AffiliateHeaderService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateDetailsComponent, FormsModule],
      providers: [
        BreadcrumbService,
        AffiliateHeaderService,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '63092814612' })),
            snapshot: { paramMap: convertToParamMap({ id: '63092814612' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateDetailsComponent);
    component = fixture.componentInstance;
    breadcrumbService = TestBed.inject(BreadcrumbService);
    affiliateHeaderService = TestBed.inject(AffiliateHeaderService);
    messageService = TestBed.inject(MessageService);
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
    expect(component.selectedSector).toEqual({ label: '319', value: '319' });
    expect(component.selectedSort()).toEqual({
      label: 'Actions en cours',
      value: 'actions-en-cours',
    });
    expect(component.journeyView).toBe(true);
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
    const sectorAutocomplete = fixture.debugElement
      .queryAll(By.directive(AutoComplete))
      .find((autocomplete) =>
        autocomplete.nativeElement.querySelector('#document-sector'),
      );

    sectorAutocomplete?.componentInstance.clear();
    fixture.detectChanges();

    expect(component.selectedSector).toBeNull();
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
    component.filterSectors({ query: '41' });

    expect(component.sectorSuggestions).toEqual([
      { label: '412', value: '412' },
    ]);
  });

  it('should reset sector suggestions when query is empty', () => {
    component.filterSectors({ query: '41' });
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
    expect(header?.variant).toBe('warning');
    expect(header?.identifiers?.find((id) => id.label === 'NISS')?.value).toBe(
      '63092814612',
    );
    expect(header?.infoTags).toEqual([
      jasmine.objectContaining({
        label: 'Dernière action:',
        value: 'Document reçu 12/04/2026',
        filterKey: 'last-action',
      }),
      jasmine.objectContaining({
        label: 'Documents actifs:',
        value: '3',
        filterKey: 'active-documents',
      }),
      jasmine.objectContaining({
        label: 'Documents clôturés:',
        value: '3',
        filterKey: 'closed-documents',
      }),
    ]);
    expect(header?.onInfoTagClick).toEqual(jasmine.any(Function));
    expect(header?.onPrimaryActionClick).toEqual(jasmine.any(Function));
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
    component.journeyView = true;
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
    component.journeyView = false;
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
    ).toBe(3);
    expect(
      fixture.nativeElement.querySelector('app-affiliate-document-detail'),
    ).toBeTruthy();
  });

  it('should filter documents by search query in flat mode', () => {
    component.journeyView = false;
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
    const detailColumn = fixture.nativeElement.querySelector(
      '.c-affiliate-details__detail app-affiliate-document-detail',
    );

    expect(shell).toBeTruthy();
    expect(columnsRow).toBeTruthy();
    expect(documentsColumn).toBeTruthy();
    expect(
      documentsColumn?.querySelector('sds-list, sds-empty-state'),
    ).toBeTruthy();
    expect(detailColumn).toBeTruthy();
  });

  it('should expose six visible documents by default', () => {
    expect(component.visibleDocuments().length).toBe(6);
    expect(component.visibleDocuments()[0].id).toBe('doc-demande-primaire');
  });

  it('should filter documents when an info tag filter is applied', () => {
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '3',
      filterKey: 'active-documents',
    });
    fixture.detectChanges();

    expect(component.documentInfoFilter()).toBe('active-documents');
    expect(component.visibleDocuments().length).toBe(3);
    expect(
      component.visibleDocuments().every((document) => document.status?.label !== 'Clôturé'),
    ).toBe(true);
  });

  it('should clear info tag filter when the same tag is clicked again', () => {
    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '3',
      filterKey: 'closed-documents',
    });
    component.onInfoTagClick({
      label: 'Documents clôturés:',
      value: '3',
      filterKey: 'closed-documents',
    });

    expect(component.documentInfoFilter()).toBeNull();
  });

  it('should update header info tag active state when filter changes', () => {
    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '3',
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

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
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

    expect(tags).toEqual([
      jasmine.objectContaining({
        label: '2',
        severity: 'info',
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
      jasmine.objectContaining({
        label: '1',
        severity: 'warn',
        icon: 'bi bi-exclamation-triangle-fill',
        ariaLabel: '1 avertissement',
        targets: [{ id: '3::calcul', label: 'Calcul - Calcul' }],
      }),
    ]);
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

  it('should jump detail to tag target step when a single-target count tag button is clicked', () => {
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

  it('should open the popover and jump the detail when a multi-target count tag jump link is clicked', () => {
    const detail = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).componentInstance as AffiliateDocumentDetailComponent;

    const infoTagButton = fixture.nativeElement.querySelector(
      '.c-list__tags button[aria-label="2 commentaires"]',
    ) as HTMLButtonElement;
    expect(infoTagButton).withContext('multi-target info tag button').toBeTruthy();

    infoTagButton.click();
    fixture.detectChanges();

    const jumpLinks = document.body.querySelectorAll(
      '.c-list__tag-target',
    ) as NodeListOf<HTMLButtonElement>;
    expect(jumpLinks.length).toBe(2);

    jumpLinks[0].click();
    fixture.detectChanges();

    expect(component.documentFocus()).toEqual({
      stepValue: 2,
      panelId: 'fdr-affilie-incapacite',
    });
    expect(detail.activeStep()).toBe(2);
    expect(detail.certPanelValue()).toBe('fdr-affilie-incapacite');
  });

  it('should wire document detail navigation to selectedDocumentId', () => {
    const detail = fixture.nativeElement.querySelector(
      'app-affiliate-document-detail',
    );
    expect(detail).toBeTruthy();

    const nextButton = fixture.nativeElement.querySelector(
      'button[aria-label="Document suivant"]',
    ) as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();

    expect(component.selectedDocumentId()).toBe('doc-incapacite');
  });
});
