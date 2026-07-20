import { Component, signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import type { DocumentCrossReference } from './affiliate-document-detail.types';
import type { ListDocumentItem } from '@solidaris/ui';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail.component';
import type { DocumentCertificatPanel } from './affiliate-document-detail.types';
import { DocumentMoreDetailsDrawerComponent } from './document-more-details-drawer/document-more-details-drawer.component';
import { TransactionsCicsModalComponent } from '@solidaris/ui';

const VISIBLE_DOCUMENTS: ListDocumentItem[] = [
  {
    id: 'doc-demande-primaire',
    title: 'Demande primaire -',
    titleLine2: 'Régime général',
    status: {
      label: 'En traitement',
      severity: 'warn',
      icon: 'bi bi-hourglass-split',
    },
  },
  {
    id: 'doc-incapacite',
    title: 'Incapacité',
    status: {
      label: 'En traitement',
      severity: 'warn',
      icon: 'bi bi-hourglass-split',
    },
  },
  {
    id: 'doc-rechute',
    title: 'Rechute',
    status: {
      label: 'En traitement',
      severity: 'warn',
      icon: 'bi bi-hourglass-split',
    },
  },
];

function findButtonByLabel(
  root: ParentNode,
  label: string,
): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find(
    (button) =>
      button.textContent?.includes(label) ||
      button.getAttribute('aria-label') === label,
  ) as HTMLButtonElement | undefined;
}

@Component({
  template: `
    <app-affiliate-document-detail
      [selectedDocumentId]="selectedDocumentId()"
      [navigableDocuments]="navigableDocuments"
      [focusTarget]="focusTarget()"
      [stepperView]="stepperView()"
      (moreDetailsOpen)="onMoreDetailsOpen($event)"
      (transactionsCicsOpen)="transactionsCicsDialogVisible.set(true)"
    />
    <app-document-more-details-drawer
      [(visible)]="moreDetailsDrawerVisible"
      [panel]="moreDetailsPanel()"
    />
    <pds-transactions-cics-modal [(visible)]="transactionsCicsDialogVisible" />
  `,
  imports: [
    AffiliateDocumentDetailComponent,
    DocumentMoreDetailsDrawerComponent,
    TransactionsCicsModalComponent,
  ],
})
class DocumentDetailDrawerTestHostComponent {
  readonly selectedDocumentId = signal('doc-demande-primaire');
  navigableDocuments: ListDocumentItem[] = VISIBLE_DOCUMENTS;
  readonly focusTarget = signal<{ stepValue: number; panelId: string } | null>(
    null,
  );
  readonly stepperView = signal<'horizontal' | 'vertical'>('horizontal');
  readonly moreDetailsDrawerVisible = signal(false);
  readonly moreDetailsPanel = signal<DocumentCertificatPanel | null>(null);
  readonly transactionsCicsDialogVisible = signal(false);

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
      providers: [MessageService],
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

  it('should render horizontal stepper chrome by default', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('p-step-list')).toBeTruthy();
    expect(root.querySelector('p-step-item')).toBeFalsy();
    expect(
      root.querySelector('.c-affiliate-document-detail__step-chrome'),
    ).toBeTruthy();
  });

  it('should render vertical step items when stepperView is vertical', () => {
    fixture.componentInstance.stepperView.set('vertical');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('p-step-list')).toBeFalsy();
    expect(root.querySelectorAll('p-step-item').length).toBe(3);
    expect(
      root.querySelector('.c-affiliate-document-detail__step-chrome'),
    ).toBeFalsy();
    expect(
      root.querySelector('.c-affiliate-document-detail__stepper--vertical'),
    ).toBeTruthy();
    expect(
      root.querySelector('.p-step .c-affiliate-document-detail__step-meta'),
    ).toBeTruthy();
    expect(root.querySelector('.p-accordion')).toBeTruthy();
  });

  it('should render labeled step navigation buttons inside the active vertical step panel', () => {
    fixture.componentInstance.stepperView.set('vertical');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const navRows = root.querySelectorAll(
      '.c-affiliate-document-detail__vertical-step-nav',
    );

    expect(navRows.length).toBe(1);

    const previousButton = findButtonByLabel(root, 'Précédent');
    const nextButton = findButtonByLabel(root, 'Suivant');

    expect(previousButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(previousButton?.disabled).toBe(true);
    expect(nextButton?.disabled).toBe(false);
  });

  it('should disable vertical Suivant on the last step', () => {
    fixture.componentInstance.stepperView.set('vertical');
    component.activeStep.set(3);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const nextButton = findButtonByLabel(root, 'Suivant');

    expect(nextButton?.disabled).toBe(true);
  });

  it('should advance to the next step when vertical Suivant is clicked', () => {
    fixture.componentInstance.stepperView.set('vertical');
    fixture.detectChanges();

    const nextButton = findButtonByLabel(
      fixture.nativeElement,
      'Suivant',
    );

    nextButton?.click();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(2);
  });

  it('should expose the selected document title from mock data', () => {
    expect(component.documentTitle()).toBe('Demande Primaire - Régime général');
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

  it('should disable both document nav directions when selected document is not in navigableDocuments', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-rechute');
    fixture.componentInstance.navigableDocuments = [
      VISIBLE_DOCUMENTS[0],
      VISIBLE_DOCUMENTS[1],
    ];
    fixture.detectChanges();

    expect(component.canGoToPreviousDocument()).toBe(false);
    expect(component.canGoToNextDocument()).toBe(false);
  });

  it('should expose aria-label on certificate action buttons', () => {
    expect(
      fixture.nativeElement.querySelector('button[aria-label="Iris"]'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(
        'button[aria-label="Transactions CICS"]',
      ),
    ).toBeTruthy();
  });

  it('should open Transactions CICS dialog when panel action is clicked', () => {
    const cicsButton = fixture.nativeElement.querySelector(
      'button[aria-label="Transactions CICS"]',
    ) as HTMLButtonElement;

    cicsButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.transactionsCicsDialogVisible()).toBe(
      true,
    );
  });

  it('should not toggle accordion when certificate header action buttons are clicked', () => {
    component.certPanelValue.set(['certificat-itt']);
    fixture.detectChanges();

    const irisButton = fixture.nativeElement.querySelector(
      'button[aria-label="Iris"]',
    ) as HTMLButtonElement;
    irisButton.click();
    fixture.detectChanges();

    expect(component.certPanelValue()).toEqual(['certificat-itt']);

    const cicsButton = fixture.nativeElement.querySelector(
      'button[aria-label="Transactions CICS"]',
    ) as HTMLButtonElement;
    cicsButton.click();
    fixture.detectChanges();

    expect(component.certPanelValue()).toEqual(['certificat-itt']);
    expect(fixture.componentInstance.transactionsCicsDialogVisible()).toBe(
      true,
    );
  });

  it('should still toggle accordion when certificate header title is clicked', () => {
    component.certPanelValue.set(['certificat-itt']);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector(
      '.c-affiliate-document-detail__cert-title',
    ) as HTMLSpanElement;
    title.click();
    fixture.detectChanges();

    expect(component.certPanelValue()).toEqual([]);
  });

  it('should show toast when Iris action is clicked', () => {
    const messageService = TestBed.inject(MessageService);
    const addSpy = spyOn(messageService, 'add').and.callThrough();

    const irisButton = fixture.nativeElement.querySelector(
      'button[aria-label="Iris"]',
    ) as HTMLButtonElement;
    irisButton.click();

    expect(addSpy).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Iris',
      detail: "Ouverture d'Iris…",
    });
  });

  it('should render incapacité paiement panel as disabled accordion with neutral hint', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    component.activeStep.set(1);
    component.certPanelValue.set('paiement-incapacite');
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector(
      '[data-panel-id="paiement-incapacite"]',
    ) as HTMLElement | null;

    expect(panel?.classList.contains('p-disabled')).toBe(true);

    const statusLabel =
      panel?.querySelector('.p-tag')?.textContent?.trim() ?? '';
    expect(statusLabel).toBe('Non démarré');

    expect(panel?.textContent).toContain(
      'Aucun paiement reçu pour le moment.',
    );
    expect(panel?.textContent).not.toContain('En attente');
    expect(panel?.textContent).not.toContain('28/12/2025 09:00');
    expect(panel?.textContent).not.toContain('Voir plus de détails');
    expect(
      panel?.querySelector('.c-affiliate-document-detail__cross-reference'),
    ).toBeNull();
    expect(
      panel?.querySelector('.c-affiliate-document-detail__plain-note'),
    ).toBeNull();
    expect(
      panel?.querySelector('.c-affiliate-document-detail__actions'),
    ).toBeNull();
    expect(panel?.querySelector('p-message')).toBeNull();
    expect(
      panel?.querySelector('.c-affiliate-document-detail__disabled-hint'),
    ).not.toBeNull();
  });

  it('should emit crossReferenceNavigate when cross-reference is clicked', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    const emitSpy = spyOn(component.crossReferenceNavigate, 'emit');
    const reference: DocumentCrossReference = {
      label: 'Calcul primaire bloqué — C4 manquant',
      documentId: 'doc-demande-primaire',
      stepValue: 3,
      panelId: 'calcul',
    };

    component.onCrossReferenceClick(reference);

    expect(emitSpy).toHaveBeenCalledWith(reference);
  });

  it('should render standalone doc-c4 as audit accordion without stepper footer', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    expect(component.isStandaloneLayout()).toBe(true);
    expect(fixture.nativeElement.querySelector('p-stepper')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('p-timeline')).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector('p-accordion.c-accordion--bordered'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[data-panel-id="c4-isolated"]'),
    ).toBeTruthy();
    const statusTag = fixture.nativeElement.querySelector(
      '[data-panel-id="c4-isolated"] .c-affiliate-document-detail__cert-header-meta p-tag',
    ) as HTMLElement | null;
    expect(statusTag?.textContent).toContain('Reçu');
    expect(statusTag?.classList.contains('p-tag-info')).toBe(true);
    expect(statusTag?.classList.contains('p-tag-success')).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('16/12/2025');
    expect(
      fixture.nativeElement.querySelector(
        '[data-panel-id="c4-isolated"] .c-affiliate-document-detail__banner',
      ),
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector(
        '.c-affiliate-document-detail__body > .c-affiliate-document-detail__banner',
      ),
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector(
        '[data-panel-id="c4-isolated"] p-message.p-message-info',
      ),
    ).toBeFalsy();
    expect(
      findButtonByLabel(fixture.nativeElement, 'Voir plus de détails'),
    ).toBeTruthy();
    expect(
      findButtonByLabel(fixture.nativeElement, 'Précédent'),
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector(
        'button[aria-label="Transactions CICS"]',
      ),
    ).toBeTruthy();
  });

  it('should render attestation pédicure in audit accordion with réception 09/06/2026 (Scenario 5)', () => {
    fixture.componentInstance.selectedDocumentId.set(
      'doc-attestation-pedicure',
    );
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('p-accordion.c-accordion--bordered'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(
        '[data-panel-id="attestation-pedicure"]',
      ),
    ).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('09/06/2026');
    expect(fixture.nativeElement.textContent).toContain('Remboursements AO/AC');
    expect(fixture.nativeElement.textContent).toContain('En traitement');
    expect(fixture.nativeElement.querySelector('p-timeline')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('p-stepper')).toBeFalsy();
    expect(
      findButtonByLabel(fixture.nativeElement, 'Voir plus de détails'),
    ).toBeTruthy();
  });

  it('should open the more-details drawer with audit timeline for standalone doc-c4', async () => {
    fixture.componentInstance.selectedDocumentId.set('doc-c4');
    fixture.detectChanges();

    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
      'c4-isolated',
    );

    const drawerTitle = document.body.querySelector(
      '.p-drawer h2',
    );
    expect(drawerTitle?.textContent?.trim()).toBe('Details - C4');

    expect(
      document.body.querySelectorAll(
        '.p-drawer .c-accordion--bordered p-accordion-panel',
      ).length,
    ).toBe(1);
  });

  it('should open the more-details drawer with two audit events for attestation pédicure', async () => {
    fixture.componentInstance.selectedDocumentId.set(
      'doc-attestation-pedicure',
    );
    fixture.detectChanges();

    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
      'attestation-pedicure',
    );

    expect(
      document.body.querySelectorAll(
        '.p-drawer .c-accordion--bordered p-accordion-panel',
      ).length,
    ).toBe(2);
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
    expect(fixture.nativeElement.textContent).toContain('Certificat ITT');
  });

  it('should render aggregated step status tags under step titles in the step list', () => {
    const stepMetas = [
      ...fixture.nativeElement.querySelectorAll(
        '.p-step .c-affiliate-document-detail__step-meta',
      ),
    ] as HTMLElement[];

    expect(stepMetas).toHaveSize(3);

    const stepOneTag = stepMetas[0].querySelector('p-tag');
    const stepTwoTag = stepMetas[1].querySelector('p-tag');
    const stepThreeTag = stepMetas[2].querySelector('p-tag');

    expect(stepOneTag?.textContent).toContain('Accepté');
    expect(stepOneTag?.classList.contains('p-tag-success')).toBe(true);

    expect(stepTwoTag?.textContent).toContain('Clôturé');
    expect(stepTwoTag?.classList.contains('p-tag-secondary')).toBe(true);

    expect(stepThreeTag?.textContent).toContain('En attente');
    expect(stepThreeTag?.classList.contains('p-tag-warn')).toBe(true);
  });

  it('should render step-level comment and warning count buttons aligned with document list tags', () => {
    const stepMetas = [
      ...fixture.nativeElement.querySelectorAll(
        '.p-step .c-affiliate-document-detail__step-meta',
      ),
    ] as HTMLElement[];

    const stepTwoButton = stepMetas[1].querySelector(
      'button.p-button',
    ) as HTMLButtonElement | null;
    expect(stepTwoButton?.textContent).toContain('2');
    expect(stepTwoButton?.classList.contains('p-button-secondary')).toBe(true);
    expect(stepTwoButton?.getAttribute('aria-label')).toBe('2 commentaires');
    expect(stepTwoButton?.getAttribute('data-telemetry-id')).toBe(
      'document-tag-doc-demande-primaire-2',
    );

    const stepThreeButton = stepMetas[2].querySelector(
      'button.p-button',
    ) as HTMLButtonElement | null;
    expect(stepThreeButton?.textContent).toContain('1');
    expect(stepThreeButton?.classList.contains('p-button-warn')).toBe(true);
    expect(stepThreeButton?.getAttribute('aria-label')).toBe('1 avertissement');
    expect(stepThreeButton?.getAttribute('data-telemetry-id')).toBe(
      'document-tag-doc-demande-primaire-1',
    );
  });

  it('should jump to the commented panel when a step warning tag is clicked', fakeAsync(() => {
    const warnButton = fixture.nativeElement.querySelector(
      '.p-step:nth-child(3) .c-affiliate-document-detail__step-meta button.p-button-warn',
    ) as HTMLButtonElement;

    warnButton.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(3);
    expect(component.certPanelValue()).toBe('calcul');
    expect(component.highlightedPanelId()).toBe('calcul');
  }));

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
    expect(content).toContain('24/11/2025');
  });

  it('should render info comment-count tag with secondary severity, aligned with the document list', () => {
    component.activeStep.set(2);
    component.certPanelValue.set('fdr-affilie-incapacite');
    fixture.detectChanges();

    const fdrAffilieTag = fixture.nativeElement.querySelector(
      '[data-panel-id="fdr-affilie-incapacite"] .c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
    ) as HTMLElement | null;
    expect(fdrAffilieTag?.textContent).toContain('1');
    expect(fdrAffilieTag?.classList.contains('p-tag-secondary')).toBe(true);
    expect(fdrAffilieTag?.classList.contains('p-tag-info')).toBe(false);

    component.certPanelValue.set('compte-financier-liasse');
    fixture.detectChanges();

    const liasseTag = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] .c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
    ) as HTMLElement | null;
    expect(liasseTag?.textContent).toContain('1');
    expect(liasseTag?.classList.contains('p-tag-secondary')).toBe(true);
    expect(liasseTag?.classList.contains('p-tag-info')).toBe(false);
  });

  it('should render info worker comment on Compte financier - Liasse panel', () => {
    component.activeStep.set(2);
    component.certPanelValue.set('compte-financier-liasse');
    fixture.detectChanges();

    const workerComment = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] p-message',
    );

    expect(workerComment).toBeTruthy();
    expect(workerComment?.textContent).toContain(
      'UOPV encodé en 9M à la réception - 10/12/2025 15:56',
    );
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
    expect(content).toContain(
      'Veuillez nous faire parvenir une copie de votre C4',
    );
    const statusTag = fixture.nativeElement.querySelector(
      '[data-panel-id="calcul"] .c-affiliate-document-detail__cert-header-meta p-tag:first-of-type',
    ) as HTMLElement | null;
    expect(statusTag?.classList.contains('p-tag-warn')).toBe(true);
    expect(statusTag?.classList.contains('p-tag-info')).toBe(false);
    const workerComment = fixture.nativeElement.querySelector('p-message');
    expect(workerComment).toBeTruthy();
    expect(workerComment?.classList.contains('p-message-warn')).toBe(true);
    expect(
      workerComment
        ?.querySelector('.p-message-icon')
        ?.classList.contains('bi-exclamation-triangle-fill'),
    ).toBe(true);
    const warnCommentTag = fixture.nativeElement.querySelector(
      '[data-panel-id="calcul"] .c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
    ) as HTMLElement | null;
    expect(warnCommentTag).toBeTruthy();
    expect(warnCommentTag?.classList.contains('p-tag-warn')).toBe(true);
    expect(warnCommentTag?.classList.contains('p-tag-info')).toBe(false);
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

    expect(inlineLabels.map((el) => el.textContent?.trim())).toEqual([
      'Du',
      'Au',
    ]);
  });

  it('should always render both step navigation buttons in the footer', () => {
    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Précédent',
    );
    const nextStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Suivant',
    );

    expect(previousStepButton).toBeTruthy();
    expect(nextStepButton).toBeTruthy();
  });

  it('should disable Etape précédente on the first step', () => {
    expect(component.previousDisabled()).toBe(true);

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Précédent',
    );

    expect(previousStepButton?.disabled).toBe(true);
  });

  it('should enable Etape précédente when not on the first step', () => {
    component.activeStep.set(2);
    fixture.detectChanges();

    expect(component.previousDisabled()).toBe(false);

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Précédent',
    );

    expect(previousStepButton?.disabled).toBe(false);
  });

  it('should disable Etape suivante on the last step', () => {
    component.activeStep.set(3);
    fixture.detectChanges();

    expect(component.nextDisabled()).toBe(true);

    const nextStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Suivant',
    );

    expect(nextStepButton?.disabled).toBe(true);
  });

  it('should advance to the next step when Etape suivante is clicked', () => {
    const nextStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Suivant',
    );

    nextStepButton?.click();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(2);
  });

  it('should keep disabled accordion panels collapsed by default on document load', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    expect(component.activeStep()).toBe(1);
    expect(component.certPanelValue()).toBeUndefined();
  });

  it('should open the first enabled panel when navigating to a step with disabled panels', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-incapacite');
    fixture.detectChanges();

    component.goToNextStep();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(2);
    expect(component.certPanelValue()).toBe('certificat-prolongation');
    const stepLabels = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.c-affiliate-document-detail__step-label',
      ),
      (el) => (el as HTMLElement).textContent?.trim() ?? '',
    );
    expect(stepLabels).toContain('Certificat de prolongation');
  });

  it('should leave all panels collapsed when every panel on a step is disabled', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-cloture-primaire');
    fixture.detectChanges();

    component.goToNextStep();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(2);
    expect(component.certPanelValue()).toBeUndefined();
  });

  it('should leave disabled Calcul panel collapsed when navigating to step 3 of doc-cloture-primaire', () => {
    fixture.componentInstance.selectedDocumentId.set('doc-cloture-primaire');
    fixture.detectChanges();

    component.goToNextStep();
    component.goToNextStep();
    fixture.detectChanges();

    expect(component.activeStep()).toBe(3);
    expect(component.certPanelValue()).toBeUndefined();
  });

  it('should still open the first enabled panel by default for enabled documents', () => {
    expect(component.certPanelValue()).toBe('certificat-itt');
  });

  it('should return to the previous step when Etape précédente is clicked', () => {
    component.activeStep.set(2);
    fixture.detectChanges();

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Précédent',
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
    expect(component.certPanelValue()).toBe('compte-financier-liasse');
  });

  it('should open the more-details drawer with Certificat ITT timeline when Voir plus de détails is clicked', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
      'certificat-itt',
    );

    expect(
      document.body.querySelector('.p-drawer-mask.p-overlay-mask'),
    ).toBeTruthy();

    const drawerTitle = document.body.querySelector(
      '.p-drawer h2',
    );
    expect(drawerTitle?.textContent?.trim()).toBe('Details - Certificat ITT');

    expect(document.body.querySelector('.p-timeline')).toBeTruthy();
    expect(
      document.body.querySelectorAll(
        '.p-drawer .c-accordion--bordered p-accordion-panel',
      ).length,
    ).toBe(3);

    const tableHeaders = [
      ...document.body.querySelectorAll(
        '.p-drawer .p-datatable th',
      ),
    ].map((cell) => cell.textContent?.trim());

    expect(tableHeaders).toEqual(
      jasmine.arrayContaining([
        'Date',
        'Description',
        'Applications',
        'Sources',
      ]),
    );
  });

  it('should hide the more-details drawer when the close button is clicked', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const closeButton = document.body.querySelector(
      '.p-drawer button[aria-label="Fermer"]',
    ) as HTMLButtonElement | null;

    closeButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(false);
  });

  it('should open the more-details drawer with audit timeline for FDR panels', async () => {
    component.goToNextStep();
    fixture.detectChanges();

    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
      'fdr-employeur',
    );
    expect(document.body.querySelector('.p-timeline')).toBeTruthy();
    expect(document.body.textContent).toContain('Reçu flux');
    expect(document.body.textContent).toContain('En traitement');
    expect(document.body.textContent).toContain('Clôturé');
    expect(document.body.textContent).toContain('IGED');
    expect(document.body.textContent).toContain(
      'Gestion de feuilles de renseignement',
    );

    const accordions = document.querySelectorAll(
      '.p-drawer .c-accordion--bordered',
    );
    expect(accordions.length).toBe(3);
  });

  it('should open the more-details drawer when Voir plus de détails is clicked for Certificat ITT', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(true);
    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
      'certificat-itt',
    );

    const drawerTitle = document.querySelector(
      '.p-drawer h2',
    );
    expect(drawerTitle?.textContent?.trim()).toBe('Details - Certificat ITT');

    expect(document.querySelector('.p-timeline')).toBeTruthy();

    const accordions = document.querySelectorAll(
      '.p-drawer .c-accordion--bordered',
    );
    expect(accordions.length).toBe(3);

    const tableHeaders = [
      ...document.querySelectorAll('.p-drawer .p-datatable th'),
    ].map((header) => header.textContent?.trim());
    expect(tableHeaders).toContain('Date');
    expect(tableHeaders).toContain('Description');
    expect(tableHeaders).toContain('Applications');
    expect(tableHeaders).toContain('Sources');
  });

  it('should hide the more-details drawer when the close button is clicked', async () => {
    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const closeButton = document.querySelector(
      '.p-drawer button[aria-label="Fermer"]',
    ) as HTMLButtonElement | null;
    closeButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsDrawerVisible()).toBe(false);
  });

  it('should open audit timeline in the drawer for FDR employeur panel', async () => {
    component.goToNextStep();
    fixture.detectChanges();

    const moreDetailsButton = findButtonByLabel(
      fixture.nativeElement,
      'Voir plus de détails',
    );

    moreDetailsButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
      'fdr-employeur',
    );
    expect(document.querySelector('.p-timeline')).toBeTruthy();
    expect(document.body.textContent).toContain('Reçu');
    expect(document.body.textContent).toContain('Reçu flux');
    expect(document.body.textContent).toContain('En traitement');
    expect(document.body.textContent).toContain('Clôturé');

    const accordions = document.querySelectorAll(
      '.p-drawer .c-accordion--bordered',
    );
    expect(accordions.length).toBe(3);
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

    expect(component.highlightedPanelId()).toBe('compte-financier-liasse');
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

  it('should run the deep-link pulse on the message ::after overlay, never on the p-message host', fakeAsync(() => {
    fixture.componentInstance.focusTarget.set({
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] p-message',
    ) as HTMLElement;
    expect(message).toBeTruthy();
    expect(
      message.classList.contains(
        'c-affiliate-document-detail__message--highlighted',
      ),
    ).toBe(true);

    // The pulse must live on the ::after overlay. If it set `animation` on the
    // host it would override PrimeNG's `p-message-enter-active` animation while
    // highlighted, and the enter keyframe would replay when the highlight clears.
    const pulseName = 'c-affiliate-document-detail-message-pulse';
    expect(getComputedStyle(message).animationName).not.toContain(pulseName);
    expect(getComputedStyle(message, '::after').animationName).toContain(
      pulseName,
    );

    tick(2000);
    fixture.detectChanges();
  }));

  it('should keep the same p-message element across the highlight lifecycle (no recreation)', fakeAsync(() => {
    fixture.componentInstance.focusTarget.set({
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    const messageDuringHighlight = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] p-message',
    );
    expect(messageDuringHighlight).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    const messageAfterHighlight = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"] p-message',
    );

    expect(messageAfterHighlight).toBe(messageDuringHighlight);
  }));

  describe('doc-rechute', () => {
    beforeEach(() => {
      fixture.componentInstance.selectedDocumentId.set('doc-rechute');
      fixture.detectChanges();
    });

    it('should render disabled Calcul panel on step 3 with FDR not-processed message', () => {
      component.activeStep.set(3);
      component.certPanelValue.set('calcul-rechute');
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '[data-panel-id="calcul-rechute"]',
      ) as HTMLElement;

      expect(panel.classList.contains('p-disabled')).toBe(true);

      const statusLabel =
        panel.querySelector('.p-tag')?.textContent?.trim() ?? '';
      expect(statusLabel).toBe('Non démarré');

      expect(panel.textContent).toContain(
        "Le calcul des indemnités n'a pas encore commencé car les F.D.R. ne sont pas traitées.",
      );
      expect(panel.textContent).not.toContain('En attente');
      expect(panel.textContent).not.toContain('10/01/2026');
      expect(panel.textContent).not.toContain('26/1005678');
      expect(panel.textContent).not.toContain('Voir plus de détails');
      expect(
        panel.querySelector('.c-affiliate-document-detail__actions'),
      ).toBeNull();
      expect(panel.querySelector('p-message')).toBeNull();
    });

    it('should open the more-details drawer with two audit events for FDR employeur rechute', async () => {
      component.activeStep.set(2);
      component.certPanelValue.set('fdr-employeur-rechute');
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '[data-panel-id="fdr-employeur-rechute"]',
      ) as HTMLElement;
      const moreDetailsButton = findButtonByLabel(
        panel,
        'Voir plus de détails',
      );

      moreDetailsButton?.click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
        'fdr-employeur-rechute',
      );
      expect(document.body.textContent).toContain('Reçu flux');
      expect(document.body.textContent).toContain('En traitement');
      expect(document.body.textContent).toContain('URP01RPA');
      expect(document.body.textContent).not.toContain('Clôturé');
      expect(
        document.body.querySelectorAll(
          '.p-drawer .c-accordion--bordered p-accordion-panel',
        ).length,
      ).toBe(2);
    });

    it('should open the more-details drawer with two audit events for FDR affilié rechute', async () => {
      component.activeStep.set(2);
      component.certPanelValue.set('fdr-affilie-rechute');
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '[data-panel-id="fdr-affilie-rechute"]',
      ) as HTMLElement;
      const moreDetailsButton = findButtonByLabel(
        panel,
        'Voir plus de détails',
      );

      moreDetailsButton?.click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
        'fdr-affilie-rechute',
      );
      expect(document.body.textContent).toContain('Reçu flux');
      expect(document.body.textContent).toContain('En attente du flux employeur');
      expect(document.body.textContent).toContain('URP02RPA');
      expect(document.body.textContent).not.toContain('Clôturé');
      expect(
        document.body.querySelectorAll(
          '.p-drawer .c-accordion--bordered p-accordion-panel',
        ).length,
      ).toBe(2);
    });

    it('should open the more-details drawer with two audit events for compte financier rechute', async () => {
      component.activeStep.set(2);
      component.certPanelValue.set('compte-financier-rechute');
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '[data-panel-id="compte-financier-rechute"]',
      ) as HTMLElement;
      const moreDetailsButton = findButtonByLabel(
        panel,
        'Voir plus de détails',
      );

      moreDetailsButton?.click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
        'compte-financier-rechute',
      );
      expect(document.body.textContent).toContain('Reçu flux');
      expect(document.body.textContent).toContain(
        'UOPV encodé en 9M à la réception',
      );
      expect(document.body.textContent).toContain(
        'Liasse compte financier en cours de traitement',
      );
      expect(document.body.textContent).toContain('UOPV01RPA');
      expect(document.body.textContent).not.toContain('Clôturé');
      expect(
        document.body.querySelectorAll(
          '.p-drawer .c-accordion--bordered p-accordion-panel',
        ).length,
      ).toBe(2);
    });
  });

  describe('doc-cloture-primaire (2e demande primaire)', () => {
    beforeEach(() => {
      fixture.componentInstance.selectedDocumentId.set('doc-cloture-primaire');
      fixture.detectChanges();
    });

    it('should render three disabled FDR panels with Non reçu status on step 2', () => {
      component.activeStep.set(2);
      fixture.detectChanges();

      const disabledPanels = [
        ...fixture.nativeElement.querySelectorAll(
          '.c-accordion--bordered .p-accordionpanel.p-disabled',
        ),
      ] as HTMLElement[];

      expect(disabledPanels).toHaveSize(3);

      const statusLabels = disabledPanels.map(
        (panel) =>
          panel.querySelector('.p-tag')?.textContent?.trim() ?? '',
      );

      expect(statusLabels).toEqual([
        'Non reçu',
        'Non reçu',
        'Non reçu',
      ]);

      const titles = disabledPanels.map(
        (panel) =>
          panel
            .querySelector('.c-affiliate-document-detail__cert-title')
            ?.textContent?.trim() ?? '',
      );

      expect(titles).toEqual([
        'F.D.R. employeur',
        'F.D.R. affilié - Incapacité de travail',
        'Compte financier - Liasse',
      ]);
    });

    it('should not show worker comments or panel actions on disabled FDR panels', () => {
      component.activeStep.set(2);
      fixture.detectChanges();

      const panelRoots = [
        'fdr-employeur-cloture',
        'fdr-affilie-incapacite-cloture',
        'compte-financier-liasse-cloture',
      ];

      for (const panelId of panelRoots) {
        const panel = fixture.nativeElement.querySelector(
          `[data-panel-id="${panelId}"]`,
        ) as HTMLElement;

        expect(panel.querySelector('p-message')).toBeNull();
        expect(panel.querySelector('.c-affiliate-document-detail__actions')).toBeNull();
      }

      expect(fixture.nativeElement.textContent).not.toContain('Clôturé');
    });

    it('should render disabled Calcul panel on step 3 with FDR not-received message', () => {
      component.activeStep.set(3);
      component.certPanelValue.set('calcul-cloture-primaire');
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '[data-panel-id="calcul-cloture-primaire"]',
      ) as HTMLElement;

      expect(panel.classList.contains('p-disabled')).toBe(true);

      const statusLabel =
        panel.querySelector('.p-tag')?.textContent?.trim() ?? '';
      expect(statusLabel).toBe('Non démarré');

      expect(panel.textContent).toContain(
        "Le calcul des indemnités n'a pas encore commencé car les F.D.R. n'ont pas été reçues",
      );
      expect(panel.textContent).not.toContain('En attente');
      expect(panel.textContent).not.toContain('Voir plus de détails');
      expect(
        panel.querySelector('.c-affiliate-document-detail__actions'),
      ).toBeNull();
      expect(panel.querySelector('p-message')).toBeNull();
      expect(
        panel.querySelector('.c-affiliate-document-detail__disabled-hint'),
      ).not.toBeNull();
    });
  });

  describe('doc-archive-changement-adresse', () => {
    beforeEach(() => {
      fixture.componentInstance.selectedDocumentId.set(
        'doc-archive-changement-adresse',
      );
      fixture.detectChanges();
    });

    it('should open the more-details drawer with full audit timeline for changement d\'adresse', async () => {
      const moreDetailsButton = findButtonByLabel(
        fixture.nativeElement,
        'Voir plus de détails',
      );

      moreDetailsButton?.click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.componentInstance.moreDetailsPanel()?.id).toBe(
        'changement-adresse',
      );
      expect(document.body.querySelector('.p-timeline')).toBeTruthy();
      expect(document.body.textContent).toContain('Reçu');
      expect(document.body.textContent).toContain('En traitement');
      expect(document.body.textContent).toContain('Clôturé');
      expect(document.body.textContent).toContain('IGED');
      expect(document.body.textContent).toContain(
        "Population - Changement d'adresse",
      );
      expect(document.body.textContent).not.toContain('Historique détaillé');

      expect(
        document.body.querySelectorAll(
          '.p-drawer .c-accordion--bordered p-accordion-panel',
        ).length,
      ).toBe(3);
    });
  });
});
