import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { ListDocumentItem } from '@solidaris/ui';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail.component';
import type { DocumentCertificatPanel } from './affiliate-document-detail.types';
import { DocumentMoreDetailsDrawerComponent } from './document-more-details-drawer/document-more-details-drawer.component';

const VISIBLE_DOCUMENTS: ListDocumentItem[] = [
  {
    id: 'doc-demande-primaire',
    title: 'Demande primaire -',
    titleLine2: 'Régime général',
    status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
  },
  {
    id: 'doc-incapacite',
    title: 'Incapacité',
    status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
  },
  {
    id: 'doc-rechute',
    title: 'Rechute',
    status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
  },
];

function findButtonByLabel(
  root: ParentNode,
  label: string,
): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    button.textContent?.includes(label),
  ) as HTMLButtonElement | undefined;
}

@Component({
  template: `
    <app-affiliate-document-detail
      [selectedDocumentId]="selectedDocumentId()"
      [visibleDocuments]="visibleDocuments"
      [focusTarget]="focusTarget()"
      (moreDetailsOpen)="onMoreDetailsOpen($event)"
    />
    <app-document-more-details-drawer
      [(visible)]="moreDetailsDrawerVisible"
      [panel]="moreDetailsPanel()"
    />
  `,
  imports: [AffiliateDocumentDetailComponent, DocumentMoreDetailsDrawerComponent],
})
class DocumentDetailDrawerTestHostComponent {
  readonly selectedDocumentId = signal('doc-demande-primaire');
  visibleDocuments: ListDocumentItem[] = VISIBLE_DOCUMENTS;
  readonly focusTarget = signal<{ stepValue: number; panelId: string } | null>(
    null,
  );
  readonly moreDetailsDrawerVisible = signal(false);
  readonly moreDetailsPanel = signal<DocumentCertificatPanel | null>(null);

  onMoreDetailsOpen(panel: DocumentCertificatPanel): void {
    this.moreDetailsPanel.set(panel);
    this.moreDetailsDrawerVisible.set(true);
  }
}

describe('AffiliateDocumentDetailComponent', () => {
  let fixture: ComponentFixture<DocumentDetailDrawerTestHostComponent>;
  let component: AffiliateDocumentDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDetailDrawerTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentDetailDrawerTestHostComponent);
    fixture.detectChanges();
    component = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply BEM host class', () => {
    const host = fixture.debugElement.query(
      By.directive(AffiliateDocumentDetailComponent),
    ).nativeElement as HTMLElement;

    expect(host.classList.contains('c-affiliate-document-detail')).toBe(true);
  });

  it('should expose the selected document title from mock data', () => {
    expect(component.documentTitle()).toBe(
      'Demande Primaire - Régime général',
    );
  });

  it('should disable previous document navigation on the first visible document', () => {
    expect(component.canGoToPreviousDocument()).toBe(false);
  });

  it('should enable next document navigation when another document is visible', () => {
    expect(component.canGoToNextDocument()).toBe(true);
  });

  it('should disable next document navigation on the last visible document', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-rechute');
    fixture.detectChanges();

    expect(component.canGoToNextDocument()).toBe(false);
  });

  it('should emit selectedDocumentIdChange when navigating to the next document', () => {
    const emitSpy = spyOn(component.selectedDocumentIdChange, 'emit');

    component.goToNextDocument();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('doc-incapacite');
  });

  it('should emit selectedDocumentIdChange when navigating to the previous document', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    const emitSpy = spyOn(component.selectedDocumentIdChange, 'emit');

    component.goToPreviousDocument();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('doc-demande-primaire');
  });

  it('should disable both document nav directions when selected document is not in visibleDocuments', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-rechute');
    fixture.componentInstance.visibleDocuments = [
      VISIBLE_DOCUMENTS[0],
      VISIBLE_DOCUMENTS[1],
    ];
    fixture.detectChanges();

    expect(component.canGoToPreviousDocument()).toBe(false);
    expect(component.canGoToNextDocument()).toBe(false);
  });

  it('should expose aria-label on certificate action buttons', () => {
    expect(fixture.nativeElement.querySelector('button[aria-label="Iris"]')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('button[aria-label="Transactions CICS"]'),
    ).toBeTruthy();
  });

  it('should render the Détails heading in the certificate panel body', () => {
    const heading = fixture.nativeElement.querySelector(
      '.c-affiliate-document-detail__details-heading',
    );

    expect(heading?.textContent?.trim()).toBe('Détails');
  });

  it('should render Certificat ITT panel with Accepté status for Eva Martinez demo doc', () => {
    const statusTag = fixture.nativeElement.querySelector(
      '.c-affiliate-document-detail__cert-header-meta p-tag',
    );

    expect(statusTag?.textContent).toContain('Accepté');
    expect(
      fixture.nativeElement.textContent,
    ).toContain('Certificat ITT');
  });

  it('should render the data-driven status icon on the certificate panel', () => {
    const statusTagIcon = fixture.nativeElement.querySelector(
      '.c-affiliate-document-detail__cert-header-meta p-tag .p-tag-icon',
    );

    expect(statusTagIcon?.classList.contains('bi-check-lg')).toBe(true);
  });

  it('should render step 2 Feuilles de renseignement panels from mock data', () => {
    component.goToNextStep();
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent ?? '';

    expect(content).toContain('F.D.R. employeur');
    expect(content).toContain('F.D.R. affilié - Incapacité de travail');
    expect(content).toContain('Compte financier - Liasse');
    expect(content).toContain('Clôturé');
    expect(content).toContain('Date du risque');
    expect(content).toContain('06/01/2026');
  });

  it('should render comment tag on panels with a worker comment', () => {
    component.activeStep.set(2);
    component.certPanelValue.set('fdr-affilie-incapacite');
    fixture.detectChanges();

    const fdrAffilieTag = fixture.nativeElement.querySelector(
      '[data-panel-id="fdr-affilie-incapacite"] .c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
    );
    expect(fdrAffilieTag?.textContent).toContain('1');

    component.certPanelValue.set('compte-financier-liasse');
    fixture.detectChanges();

    const liasseTag = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] .c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
    );
    expect(liasseTag?.textContent).toContain('1');
  });

  it('should render info worker comment on Compte financier - Liasse panel', () => {
    component.activeStep.set(2);
    component.certPanelValue.set('compte-financier-liasse');
    fixture.detectChanges();

    const workerComment = fixture.nativeElement.querySelector('p-message');

    expect(workerComment).toBeTruthy();
    expect(workerComment?.textContent).toContain('Commentaire du gestionnaire');
    expect(workerComment?.classList.contains('p-message-info')).toBe(true);
    expect(
      workerComment
        ?.querySelector('.p-message-icon')
        ?.classList.contains('bi-chat-right-text-fill'),
    ).toBe(true);
  });

  it('should render step 3 Calcul panel with warn message and En attente status', () => {
    component.activeStep.set(3);
    component.certPanelValue.set('calcul');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent ?? '';

    expect(content).toContain('Calcul');
    expect(content).toContain('En attente');
    expect(content).toContain('Veuillez nous faire parvenir une copie de votre C4');
    const workerComment = fixture.nativeElement.querySelector('p-message');
    expect(workerComment).toBeTruthy();
    expect(workerComment?.classList.contains('p-message-warn')).toBe(true);
    expect(
      workerComment
        ?.querySelector('.p-message-icon')
        ?.classList.contains('bi-exclamation-triangle-fill'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
      ),
    ).toBeTruthy();
  });

  it('should render certificate metadata rows from Figma mock data', () => {
    const content = fixture.nativeElement.textContent ?? '';

    expect(content).toContain('Date de réception');
    expect(content).toContain('24/11/2025');
    expect(content).toContain('Numéro de certificat');
    expect(content).toContain('25/1256332');
    expect(content).toContain('Période');
  });

  it('should apply inline detail-label modifier to period sub-labels Du and Au', () => {
    const inlineLabels = [
      ...fixture.nativeElement.querySelectorAll(
        '.c-affiliate-document-detail__detail-label--inline',
      ),
    ] as HTMLElement[];

    expect(inlineLabels.map((el) => el.textContent?.trim())).toEqual(['Du', 'Au']);
  });

  it('should always render both step navigation buttons in the footer', () => {
    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );
    const nextStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape suivante',
    );

    expect(previousStepButton).toBeTruthy();
    expect(nextStepButton).toBeTruthy();
  });

  it('should disable Etape précédente on the first step', () => {
    expect(component.previousDisabled()).toBe(true);

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );

    expect(previousStepButton?.disabled).toBe(true);
  });

  it('should enable Etape précédente when not on the first step', () => {
    component.activeStep.set(2);
    fixture.detectChanges();

    expect(component.previousDisabled()).toBe(false);

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );

    expect(previousStepButton?.disabled).toBe(false);
  });

  it('should disable Etape suivante on the last step', () => {
    component.activeStep.set(3);
    fixture.detectChanges();

    expect(component.nextDisabled()).toBe(true);

    const nextStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape suivante',
    );

    expect(nextStepButton?.disabled).toBe(true);
  });

  it('should advance to the next step when Etape suivante is clicked', () => {
    const nextStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape suivante',
    );

    nextStepButton?.click();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(2);
  });

  it('should return to the previous step when Etape précédente is clicked', () => {
    component.activeStep.set(2);
    fixture.detectChanges();

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );

    previousStepButton?.click();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(1);
  });

  it('should jump to the focusTarget step and panel instead of resetting to defaults', () => {
    fixture.componentInstance.focusTarget.set({
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
    fixture.detectChanges();

    expect(component.activeStep()).toBe(2);
    expect(component.certPanelValue()).toBe(
      'compte-financier-liasse',
    );
  });

  it('should open the more-details drawer with Certificat ITT timeline when Voir plus de details is clicked', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de details',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe('certificat-itt');

    expect(document.body.querySelector('.p-drawer-mask.p-overlay-mask')).toBeTruthy();

    const drawerTitle = document.body.querySelector(
      '.c-document-more-details-drawer__title',
    );
    expect(drawerTitle?.textContent?.trim()).toBe('Details - Certificat ITT');

    expect(document.body.querySelector('.p-timeline')).toBeTruthy();
    expect(
      document.body.querySelectorAll(
        '.c-document-more-details-drawer .c-audit-accordion p-accordion-panel',
      ).length,
    ).toBe(3);

    const tableHeaders = [
      ...document.body.querySelectorAll(
        '.c-document-more-details-drawer__table th',
      ),
    ].map((cell) => cell.textContent?.trim());

    expect(tableHeaders).toEqual(
      jasmine.arrayContaining(['Date', 'Description', 'Applications', 'Sources']),
    );
  });

  it('should hide the more-details drawer when the close button is clicked', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de details',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const closeButton = document.body.querySelector(
      '.c-document-more-details-drawer__close-button',
    ) as HTMLButtonElement | null;

    closeButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(false);
  });

  it('should show an empty state in the more-details drawer for panels without moreDetails', async () => {
    component.goToNextStep();
    fixture.detectChanges();

    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de details',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(
      document.body.querySelector('.c-document-more-details-drawer__empty'),
    ).toBeTruthy();
    expect(document.body.textContent).toContain('Aucun historique disponible');
    expect(document.body.querySelector('.p-timeline')).toBeFalsy();
  });

  it('should open the more-details drawer when Voir plus de details is clicked for Certificat ITT', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de details',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe('certificat-itt');

    const drawerTitle = document.querySelector(
      '.c-document-more-details-drawer__title',
    );
    expect(drawerTitle?.textContent?.trim()).toBe('Details - Certificat ITT');

    expect(document.querySelector('.p-timeline')).toBeTruthy();

    const accordions = document.querySelectorAll(
      '.c-document-more-details-drawer .c-audit-accordion',
    );
    expect(accordions.length).toBe(3);

    const tableHeaders = [
      ...document.querySelectorAll(
        '.c-document-more-details-drawer__table th',
      ),
    ].map((header) => header.textContent?.trim());
    expect(tableHeaders).toContain('Date');
    expect(tableHeaders).toContain('Description');
    expect(tableHeaders).toContain('Applications');
    expect(tableHeaders).toContain('Sources');
  });

  it('should hide the more-details drawer when the close button is clicked', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de details',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const closeButton = document.querySelector(
      '.c-document-more-details-drawer__close-button',
    ) as HTMLButtonElement | null;
    closeButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(false);
  });

  it('should show an empty state in the drawer for panels without moreDetails', async () => {
    component.goToNextStep();
    fixture.detectChanges();

    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de details',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe('fdr-employeur');
    expect(document.querySelector('sds-empty-state')).toBeTruthy();
    expect(document.querySelector('.p-timeline')).toBeFalsy();
  });

  it('should highlight the matching panel for a focusTarget and clear it after the timeout', fakeAsync(() => {
    fixture.componentInstance.focusTarget.set({
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] p-message',
    ) as HTMLElement | null;

    expect(component.highlightedPanelId()).toBe(
      'compte-financier-liasse',
    );
    expect(
      message?.classList.contains(
        'c-affiliate-document-detail__message--highlighted',
      ),
    ).toBe(true);

    tick(2000);
    fixture.detectChanges();

    expect(component.highlightedPanelId()).toBeNull();
    expect(
      message?.classList.contains(
        'c-affiliate-document-detail__message--highlighted',
      ),
    ).toBe(false);
  }));
});

