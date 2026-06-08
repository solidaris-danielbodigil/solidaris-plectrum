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



  it('should hide the section header when showHeader is false', () => {

    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);

    fixture.componentRef.setInput('showHeader', false);

    fixture.detectChanges();



    expect(fixture.nativeElement.querySelector('h2.c-list__title')).toBeNull();

    expect(fixture.nativeElement.querySelector('.c-list__count-badge')).toBeNull();

    expect(fixture.nativeElement.querySelector('.bi-sort-down')).toBeNull();

  });



  it('should render flat document nodes without group togglers', () => {

    fixture.componentRef.setInput('groups', null);

    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);

    fixture.detectChanges();



    expect(fixture.nativeElement.querySelectorAll('.c-list__item--document').length).toBe(

      FLAT_DOCUMENTS.length,

    );

    expect(fixture.nativeElement.querySelectorAll('.p-tree-node:not(.p-tree-node-leaf)').length).toBe(

      0,

    );

  });



  it('should render timeline gutters on journey document rows', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.c-list__timeline').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.c-list__timeline-img').length).toBe(2);
    expect(
      fixture.nativeElement.querySelector('.c-list__timeline-img')?.getAttribute('src'),
    ).toBe('assets/timeline.svg');
  });

  it('should hide PrimeNG toggler placeholders on journey leaf document nodes', () => {
    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);
    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));
    fixture.detectChanges();

    const leafTogglers = fixture.nativeElement.querySelectorAll(
      '.p-tree-node-leaf > .p-tree-node-content:has(.c-list__document-row) > .p-tree-node-toggle-button',
    );

    expect(leafTogglers.length).toBe(2);

    leafTogglers.forEach((toggle: HTMLElement) => {
      expect(getComputedStyle(toggle).display).toBe('none');
    });
  });

  it('should not render timeline gutters in flat mode', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.c-list__timeline')).toBeNull();
  });

  it('should stretch flat document rows to full tree width', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    const documentItems = fixture.nativeElement.querySelectorAll('.c-list__item--document');
    const treeLabels = fixture.nativeElement.querySelectorAll(
      '.p-tree-node-leaf > .p-tree-node-content > .p-tree-node-label',
    );

    expect(documentItems.length).toBe(FLAT_DOCUMENTS.length);
    expect(treeLabels.length).toBe(FLAT_DOCUMENTS.length);

    documentItems.forEach((item: HTMLElement) => {
      expect(getComputedStyle(item).width).not.toBe('auto');
      expect(item.classList.contains('o-flex__item--grow-1')).toBe(true);
    });

    treeLabels.forEach((label: HTMLElement) => {
      expect(getComputedStyle(label).flexGrow).toBe('1');
      expect(getComputedStyle(label).width).not.toBe('auto');
    });
  });

  it('should render journey groups with tree togglers and document children', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));

    fixture.detectChanges();



    expect(

      fixture.nativeElement.querySelectorAll(

        '.p-tree-node-content:has(.c-list__item--group) > .p-tree-node-toggle-button',

      ).length,

    ).toBe(2);

    expect(fixture.nativeElement.querySelectorAll('.c-list__item--group').length).toBe(2);

    expect(fixture.nativeElement.querySelectorAll('.c-list__item--document').length).toBe(2);

  });



  it('should hide child documents when group is collapsed', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', ['parcours-rechute']);

    fixture.detectChanges();



    expect(fixture.nativeElement.querySelectorAll('.c-list__item--document').length).toBe(1);

  });



  it('should emit expandedGroupIdsChange when a group toggler is clicked', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', ['parcours-demande-primaire']);

    fixture.detectChanges();



    const emitSpy = jasmine.createSpy('expandedGroupIdsChange');

    component.expandedGroupIdsChange.subscribe(emitSpy);



    const groupToggle = fixture.nativeElement.querySelector(

      '.p-tree-node-content:has(.c-list__item--group) > .p-tree-node-toggle-button',

    ) as HTMLElement;

    groupToggle.click();

    fixture.detectChanges();



    expect(emitSpy).toHaveBeenCalledWith([]);

  });



  it('should emit itemClick when a document node is clicked', () => {

    fixture.componentRef.setInput('groups', null);

    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);

    fixture.detectChanges();



    const emitSpy = jasmine.createSpy('itemClick');

    component.itemClick.subscribe(emitSpy);



    const documentNode = fixture.nativeElement.querySelector(

      '.c-list__item--document',

    ) as HTMLElement;

    documentNode.click();



    expect(emitSpy).toHaveBeenCalledWith(FLAT_DOCUMENTS[0]);

  });



  it('should apply selected modifier when selectedItemId matches a document', () => {

    fixture.componentRef.setInput('groups', null);

    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);

    fixture.componentRef.setInput('selectedItemId', 'doc-demande-primaire');

    fixture.detectChanges();



    const selectedNode = fixture.nativeElement.querySelector('.c-list__item--document.c-list__item--selected');

    expect(selectedNode).toBeTruthy();

    expect(selectedNode.getAttribute('aria-selected')).toBe('true');

  });



  it('should set aria-selected only on the selected document node', () => {

    fixture.componentRef.setInput('groups', null);

    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);

    fixture.componentRef.setInput('selectedItemId', 'doc-demande-primaire');

    fixture.detectChanges();



    const documentNodes = fixture.nativeElement.querySelectorAll('.c-list__item--document');



    expect(documentNodes.length).toBe(2);

    expect(documentNodes[0].getAttribute('aria-selected')).toBe('true');

    expect(documentNodes[1].getAttribute('aria-selected')).toBeNull();

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



    const documentNodes = fixture.nativeElement.querySelectorAll('.c-list__item--document');



    expect(documentNodes[0].classList.contains('c-list__item--selected')).toBe(false);

    expect(documentNodes[0].getAttribute('aria-selected')).toBeNull();

    expect(documentNodes[1].classList.contains('c-list__item--selected')).toBe(true);

    expect(documentNodes[1].getAttribute('aria-selected')).toBe('true');

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



    const documentNodes = fixture.nativeElement.querySelectorAll('.c-list__item--document');



    expect(documentNodes[0].classList.contains('c-list__item--selected')).toBe(true);

    expect(documentNodes[0].getAttribute('aria-selected')).toBe('true');

    expect(documentNodes[1].classList.contains('c-list__item--selected')).toBe(false);

    expect(documentNodes[1].getAttribute('aria-selected')).toBeNull();

  });



  it('should set aria-selected on journey mode document nodes', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));

    fixture.componentRef.setInput('selectedItemId', 'doc-demande-primaire');

    fixture.detectChanges();



    const documentNodes = fixture.nativeElement.querySelectorAll('.c-list__item--document');



    expect(documentNodes[0].getAttribute('aria-selected')).toBe('true');

    expect(documentNodes[1].getAttribute('aria-selected')).toBeNull();

  });



  it('should render loading skeleton rows', () => {

    fixture.componentRef.setInput('loading', true);

    fixture.detectChanges();



    expect(fixture.nativeElement.classList.contains('is-loading')).toBe(true);

    expect(fixture.nativeElement.querySelectorAll('.c-list__skeleton-line--title').length).toBe(3);

  });



  it('should mark decorative sort icon as aria-hidden', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', JOURNEY_GROUPS.map((g) => g.id));

    fixture.detectChanges();



    const sortIcon = fixture.nativeElement.querySelector('.bi-sort-down');

    expect(sortIcon?.getAttribute('aria-hidden')).toBe('true');

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



  it('should expose aria-expanded on journey group tree items', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', ['parcours-demande-primaire']);

    fixture.detectChanges();



    const groupTreeItems = fixture.nativeElement.querySelectorAll(

      '.p-tree-node:not(.p-tree-node-leaf)[role="treeitem"]',

    );



    expect(groupTreeItems[0].getAttribute('aria-expanded')).toBe('true');

    expect(groupTreeItems[1].getAttribute('aria-expanded')).toBe('false');

  });



  it('should toggle group expansion via keyboard ArrowRight', () => {

    fixture.componentRef.setInput('groups', JOURNEY_GROUPS);

    fixture.componentRef.setInput('expandedGroupIds', []);

    fixture.detectChanges();



    const emitSpy = jasmine.createSpy('expandedGroupIdsChange');

    component.expandedGroupIdsChange.subscribe(emitSpy);



    const groupTreeItem = fixture.nativeElement.querySelector(

      '.p-tree-node:not(.p-tree-node-leaf)[role="treeitem"]',

    ) as HTMLElement;

    groupTreeItem.dispatchEvent(

      new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }),

    );

    fixture.detectChanges();



    expect(emitSpy).toHaveBeenCalledWith(['parcours-demande-primaire']);

  });



  it('should emit itemClick when a document node is activated via keyboard Space', () => {

    fixture.componentRef.setInput('groups', null);

    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);

    fixture.detectChanges();



    const emitSpy = jasmine.createSpy('itemClick');

    component.itemClick.subscribe(emitSpy);



    const documentNode = fixture.nativeElement.querySelector(

      '.c-list__item--document',

    ) as HTMLElement;

    documentNode.dispatchEvent(

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



    component.onTreeNodeExpand({

      node: { key: 'parcours-demande-primaire', type: 'group' },

    });

    component.onDocumentClick(FLAT_DOCUMENTS[0]);



    expect(expandedSpy).not.toHaveBeenCalled();

    expect(itemSpy).not.toHaveBeenCalled();

  });



  it('should render PrimeNG tree for document nodes', () => {
    fixture.componentRef.setInput('groups', null);
    fixture.componentRef.setInput('items', FLAT_DOCUMENTS);
    fixture.detectChanges();

    const tree = fixture.nativeElement.querySelector('p-tree');
    const treeItems = fixture.nativeElement.querySelectorAll('.p-tree-node[role="treeitem"]');

    expect(tree).toBeTruthy();
    expect(treeItems.length).toBe(FLAT_DOCUMENTS.length);
  });

});

