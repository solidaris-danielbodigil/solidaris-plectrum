import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should expose aria-label on the add certificate panel button', () => {
    expect(
      fixture.nativeElement.querySelector(
        'button.c-affiliate-document-detail__add-panel-button[aria-label="Ajouter un certificat"]',
      ),
    ).toBeTruthy();
  });

  it('should render Certificat ITT panel with Accepté status for Eva Martinez demo doc', () => {
    const statusTag = fixture.nativeElement.querySelector(
      '.c-affiliate-document-detail__status-tag',
    );

    expect(statusTag?.textContent).toContain('Accepté');
    expect(
      fixture.nativeElement.textContent,
    ).toContain('Certificat ITT');
  });

  it('should render certificate metadata rows from Figma mock data', () => {
    const content = fixture.nativeElement.textContent ?? '';

    expect(content).toContain('Date de réception');
    expect(content).toContain('24/11/2025');
    expect(content).toContain('Numéro de certificat');
    expect(content).toContain('25/1256332');
    expect(content).toContain('Période');
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
});

