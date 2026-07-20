import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelayPredictionCardComponent } from './delay-prediction-card.component';

describe('DelayPredictionCardComponent', () => {
  let fixture: ComponentFixture<DelayPredictionCardComponent>;
  let component: DelayPredictionCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayPredictionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DelayPredictionCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('daysRemaining', 11);
    fixture.componentRef.setInput('predictedCloseDate', '19/06/2026');
    fixture.detectChanges();
  });

  it('should render days remaining and predicted close date', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('11');
    expect(el.textContent).toContain('Jours restants');
    expect(el.textContent).toContain('19/06/2026');
    expect(el.textContent).toContain('Clôture prédite');
  });

  it('should expose menu button with aria-label', () => {
    const button = fixture.nativeElement.querySelector(
      '.c-delay-prediction-card__menu',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe(
      "Plus d'actions — prédiction du délai",
    );
  });

  it('should emit menuClick when menu button is clicked', () => {
    const spy = jasmine.createSpy('menuClick');
    component.menuClick.subscribe(spy);
    const button = fixture.nativeElement.querySelector(
      '.c-delay-prediction-card__menu',
    ) as HTMLButtonElement;
    button.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
