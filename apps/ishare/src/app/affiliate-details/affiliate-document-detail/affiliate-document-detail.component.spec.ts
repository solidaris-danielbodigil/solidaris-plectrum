import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import type { ListDocumentItem } from '@solidaris/ui';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail.component';

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

describe('AffiliateDocumentDetailComponent', () => {
  let fixture: ComponentFixture<AffiliateDocumentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateDocumentDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateDocumentDetailComponent);
    fixture.componentRef.setInput('selectedDocumentId', 'doc-demande-primaire');
    fixture.componentRef.setInput('visibleDocuments', VISIBLE_DOCUMENTS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply BEM host class', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.classList.contains('c-affiliate-document-detail')).toBe(true);
  });

  it('should expose the selected document title from mock data', () => {
    expect(fixture.componentInstance.documentTitle()).toBe(
      'Demande Primaire - Régime général',
    );
  });

  it('should disable previous document navigation on the first visible document', () => {
    expect(fixture.componentInstance.canGoToPreviousDocument()).toBe(false);
  });

  it('should enable next document navigation when another document is visible', () => {
    expect(fixture.componentInstance.canGoToNextDocument()).toBe(true);
  });

  it('should disable next document navigation on the last visible document', () => {
    fixture.componentRef.setInput('selectedDocumentId', 'doc-rechute');
    fixture.detectChanges();

    expect(fixture.componentInstance.canGoToNextDocument()).toBe(false);
  });

  it('should emit selectedDocumentIdChange when navigating to the next document', () => {
    const emitSpy = spyOn(
      fixture.componentInstance.selectedDocumentIdChange,
      'emit',
    );

    fixture.componentInstance.goToNextDocument();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('doc-incapacite');
  });

  it('should emit selectedDocumentIdChange when navigating to the previous document', () => {
    fixture.componentRef.setInput('selectedDocumentId', 'doc-incapacite');
    fixture.detectChanges();

    const emitSpy = spyOn(
      fixture.componentInstance.selectedDocumentIdChange,
      'emit',
    );

    fixture.componentInstance.goToPreviousDocument();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('doc-demande-primaire');
  });

  it('should disable both document nav directions when selected document is not in visibleDocuments', () => {
    fixture.componentRef.setInput('selectedDocumentId', 'doc-rechute');
    fixture.componentRef.setInput('visibleDocuments', [
      VISIBLE_DOCUMENTS[0],
      VISIBLE_DOCUMENTS[1],
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.canGoToPreviousDocument()).toBe(false);
    expect(fixture.componentInstance.canGoToNextDocument()).toBe(false);
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
    fixture.componentInstance.goToNextStep();
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent ?? '';

    expect(content).toContain('F.D.R. employeur');
    expect(content).toContain('F.D.R. affilié - Incapacité de travail');
    expect(content).toContain('Compte financier - Liasse');
    expect(content).toContain('Clôturé');
    expect(content).toContain('Date du risque');
    expect(content).toContain('06/01/2026');
  });

  it('should render count tag on Compte financier - Liasse panel', () => {
    fixture.componentInstance.activeStep.set(2);
    fixture.componentInstance.certPanelValue.set('compte-financier-liasse');
    fixture.detectChanges();

    const countTag = fixture.nativeElement.querySelector(
      '.c-affiliate-document-detail__cert-header-meta p-tag:nth-of-type(2)',
    );

    expect(countTag?.textContent).toContain('1');
  });

  it('should render info worker comment on Compte financier - Liasse panel', () => {
    fixture.componentInstance.activeStep.set(2);
    fixture.componentInstance.certPanelValue.set('compte-financier-liasse');
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
    fixture.componentInstance.activeStep.set(3);
    fixture.componentInstance.certPanelValue.set('calcul');
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
    expect(fixture.componentInstance.previousDisabled()).toBe(true);

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );

    expect(previousStepButton?.disabled).toBe(true);
  });

  it('should enable Etape précédente when not on the first step', () => {
    fixture.componentInstance.activeStep.set(2);
    fixture.detectChanges();

    expect(fixture.componentInstance.previousDisabled()).toBe(false);

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );

    expect(previousStepButton?.disabled).toBe(false);
  });

  it('should disable Etape suivante on the last step', () => {
    fixture.componentInstance.activeStep.set(3);
    fixture.detectChanges();

    expect(fixture.componentInstance.nextDisabled()).toBe(true);

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

    expect(fixture.componentInstance.activeStep()).toBe(2);
  });

  it('should return to the previous step when Etape précédente is clicked', () => {
    fixture.componentInstance.activeStep.set(2);
    fixture.detectChanges();

    const previousStepButton = findButtonByLabel(
      fixture.nativeElement,
      'Etape précédente',
    );

    previousStepButton?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeStep()).toBe(1);
  });

  it('should jump to the focusTarget step and panel instead of resetting to defaults', () => {
    fixture.componentRef.setInput('focusTarget', {
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.activeStep()).toBe(2);
    expect(fixture.componentInstance.certPanelValue()).toBe(
      'compte-financier-liasse',
    );
  });

  it('should highlight the matching panel for a focusTarget and clear it after the timeout', fakeAsync(() => {
    fixture.componentRef.setInput('focusTarget', {
      stepValue: 2,
      panelId: 'compte-financier-liasse',
    });
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector(
      '[data-panel-id="compte-financier-liasse"]',
    ) as HTMLElement | null;

    expect(fixture.componentInstance.highlightedPanelId()).toBe(
      'compte-financier-liasse',
    );
    expect(
      panel?.classList.contains(
        'c-affiliate-document-detail__panel--highlighted',
      ),
    ).toBe(true);

    tick(2000);
    fixture.detectChanges();

    expect(fixture.componentInstance.highlightedPanelId()).toBeNull();
    expect(
      panel?.classList.contains(
        'c-affiliate-document-detail__panel--highlighted',
      ),
    ).toBe(false);
  }));
});

