import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import type { ListDocumentItem, ListGroup } from './list.types';

const JOURNEY_GROUPS: ListGroup[] = [
  {
    id: 'parcours-demande-primaire',
    title: 'Parcours Indemnités -',
    titleAccent: 'Demande primaire',
    startDate: '24/11/2025',
    endDate: '24/12/2025',
    documents: [
      {
        id: 'doc-demande-primaire',
        title: 'Demande primaire -',
        titleLine2: 'Régime général',
        selected: true,
        status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
        tags: [{ label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' }],
      },
    ],
  },
  {
    id: 'parcours-rechute',
    title: 'Parcours Indemnités -',
    titleAccent: 'Rechute',
    startDate: '01/01/2026',
    endDate: '15/01/2026',
    documents: [
      {
        id: 'doc-rechute',
        title: 'Rechute',
        status: { label: 'En traitement', severity: 'warn' },
      },
    ],
  },
];

const FLAT_DOCUMENTS: ListDocumentItem[] = JOURNEY_GROUPS.flatMap(
  (group) => group.documents,
);

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply vertical flex layout on host', () => {
    expect(fixture.nativeElement.classList.contains('o-flex')).toBe(true);
    expect(fixture.nativeElement.classList.contains('o-flex--y')).toBe(true);
  });

  it('should apply flat mode host classes by default', () => {
    expect(fixture.nativeElement.classList.contains('c-list--flat')).toBe(true);
    expect(fixture.nativeElement.classList.contains('c-list--journey')).toBe(false);
  });

  it('should apply journey mode host class when groups are provided', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('c-list--journey')).toBe(true);
    expect(fixture.nativeElement.classList.contains('c-list--flat')).toBe(false);
  });

  it('should render section title and document count badge', () => {
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2.c-list__title');
    const badge = fixture.nativeElement.querySelector('.c-list__count-badge');

    expect(title?.textContent?.trim()).toBe('Suivi des documents');
    expect(badge?.textContent?.trim()).toBe(String(FLAT_DOCUMENTS.length));
  });

  it('should render flat document rows without chevrons or timeline', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.c-list__item--document').length).toBe(
      FLAT_DOCUMENTS.length,
    );
    expect(fixture.nativeElement.querySelector('.c-list__chevron')).toBeNull();
    expect(fixture.nativeElement.querySelector('.c-list__timeline')).toBeNull();
  });

  it('should render journey groups with chevrons and timeline gutters', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.c-list__chevron').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.c-list__timeline').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.c-list__item--group').length).toBe(2);
  });

  it('should hide child documents when group is collapsed', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', ['parcours-rechute']);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.c-list__item--document').length).toBe(1);
    expect(
      fixture.nativeElement.querySelector('.c-list__group.is-collapsed'),
    ).toBeTruthy();
  });

  it('should emit expandedGroupIdsChange when a group header is toggled', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', ['parcours-demande-primaire']);
    fixture.detectChanges();

    const emitSpy = jasmine.createSpy('expandedGroupIdsChange');
    component.expandedGroupIdsChange.subscribe(emitSpy);

    const groupToggle = fixture.nativeElement.querySelector(
      '.c-list__item--group [role="button"]',
    ) as HTMLElement;
    groupToggle.click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith([]);
  });

  it('should emit itemClick when a document row is clicked', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    const emitSpy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(emitSpy);

    const documentRow = fixture.nativeElement.querySelector(
      '.c-list__item--document',
    ) as HTMLElement;
    documentRow.click();

    expect(emitSpy).toHaveBeenCalledWith(FLAT_DOCUMENTS[0]);
  });

  it('should apply selected modifier when selectedItemId matches a document', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.componentRef.setInput('selectedItemId', 'doc-demande-primaire');
    fixture.detectChanges();

    const selectedRow = fixture.nativeElement.querySelector('.c-list__item--selected');
    expect(selectedRow).toBeTruthy();
    expect(selectedRow.getAttribute('aria-selected')).toBe('true');
  });

  it('should set aria-selected only on the selected document row', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.componentRef.setInput('selectedItemId', 'doc-demande-primaire');
    fixture.detectChanges();

    const documentRows = fixture.nativeElement.querySelectorAll('.c-list__item--document');

    expect(documentRows.length).toBe(2);
    expect(documentRows[0].getAttribute('aria-selected')).toBe('true');
    expect(documentRows[1].getAttribute('aria-selected')).toBeNull();
  });

  it('should prefer selectedItemId over doc.selected', () => {
    const documentsWithStaleSelection: ListDocumentItem[] = [
      { ...FLAT_DOCUMENTS[0], selected: true },
      { ...FLAT_DOCUMENTS[1], selected: false },
    ];

    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', documentsWithStaleSelection);
    fixture.componentRef.setInput('selectedItemId', 'doc-rechute');
    fixture.detectChanges();

    const documentRows = fixture.nativeElement.querySelectorAll('.c-list__item--document');

    expect(documentRows[0].classList.contains('c-list__item--selected')).toBe(false);
    expect(documentRows[0].getAttribute('aria-selected')).toBeNull();
    expect(documentRows[1].classList.contains('c-list__item--selected')).toBe(true);
    expect(documentRows[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should fall back to doc.selected when selectedItemId is null', () => {
    const documentsWithSelection: ListDocumentItem[] = [
      { ...FLAT_DOCUMENTS[0], selected: true },
      { ...FLAT_DOCUMENTS[1], selected: false },
    ];

    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', documentsWithSelection);
    fixture.componentRef.setInput('selectedItemId', null);
    fixture.detectChanges();

    const documentRows = fixture.nativeElement.querySelectorAll('.c-list__item--document');

    expect(documentRows[0].classList.contains('c-list__item--selected')).toBe(true);
    expect(documentRows[0].getAttribute('aria-selected')).toBe('true');
    expect(documentRows[1].classList.contains('c-list__item--selected')).toBe(false);
    expect(documentRows[1].getAttribute('aria-selected')).toBeNull();
  });

  it('should set aria-selected on journey mode document rows', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));
    fixture.componentRef.setInput('selectedItemId', 'doc-demande-primaire');
    fixture.detectChanges();

    const documentRows = fixture.nativeElement.querySelectorAll('.c-list__item--document');

    expect(documentRows[0].getAttribute('aria-selected')).toBe('true');
    expect(documentRows[1].getAttribute('aria-selected')).toBeNull();
  });

  it('should render loading skeleton rows', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('is-loading')).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.c-list__skeleton-icon').length).toBe(3);
  });

  it('should mark decorative icons as aria-hidden', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll(
      '.c-list__chevron-icon, .c-list__icon, .bi-sort-down',
    );

    icons.forEach((icon: Element) => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should expose region semantics on host', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('region');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Suivi des documents');
  });

  it('should set aria-busy on host while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('aria-busy')).toBe('true');
  });

  it('should expose aria-expanded on journey group headers', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', ['parcours-demande-primaire']);
    fixture.detectChanges();

    const groupToggles = fixture.nativeElement.querySelectorAll(
      '.c-list__item--group [role="button"]',
    );

    expect(groupToggles[0].getAttribute('aria-expanded')).toBe('true');
    expect(groupToggles[1].getAttribute('aria-expanded')).toBe('false');
  });

  it('should apply chevron collapsed modifier when group is collapsed', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', []);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.c-list__chevron--collapsed'),
    ).toBeTruthy();
  });

  it('should toggle group expansion via keyboard Enter', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', []);
    fixture.detectChanges();

    const emitSpy = jasmine.createSpy('expandedGroupIdsChange');
    component.expandedGroupIdsChange.subscribe(emitSpy);

    const groupToggle = fixture.nativeElement.querySelector(
      '.c-list__item--group [role="button"]',
    ) as HTMLElement;
    groupToggle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );

    expect(emitSpy).toHaveBeenCalledWith(['parcours-demande-primaire']);
  });

  it('should emit itemClick when a document row is activated via keyboard Space', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    const emitSpy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(emitSpy);

    const documentRow = fixture.nativeElement.querySelector(
      '.c-list__item--document',
    ) as HTMLElement;
    documentRow.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );

    expect(emitSpy).toHaveBeenCalledWith(FLAT_DOCUMENTS[0]);
  });

  it('should not emit interactions while loading', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const expandedSpy = jasmine.createSpy('expandedGroupIdsChange');
    const itemSpy = jasmine.createSpy('itemClick');
    component.expandedGroupIdsChange.subscribe(expandedSpy);
    component.itemClick.subscribe(itemSpy);

    component.onGroupHeaderClick('parcours-demande-primaire');
    component.onDocumentClick(FLAT_DOCUMENTS[0]);

    expect(expandedSpy).not.toHaveBeenCalled();
    expect(itemSpy).not.toHaveBeenCalled();
  });

  it('should expose list semantics on document bodies', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    const listBody = fixture.nativeElement.querySelector('.c-list__body[role="list"]');
    const listItems = fixture.nativeElement.querySelectorAll('[role="listitem"]');

    expect(listBody).toBeTruthy();
    expect(listItems.length).toBe(FLAT_DOCUMENTS.length);
  });
});
