import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { EMPTY_STATE_ILLUSTRATIONS } from './empty-state-illustrations';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Aucun résultat');
    fixture.detectChanges();
  });

  it('should render a random illustration from the catalog', () => {
    const illustrationSrc = fixture.componentInstance.illustrationSrc;
    const illustration = fixture.nativeElement.querySelector(
      '.c-empty-state__illustration',
    ) as HTMLImageElement;

    expect(EMPTY_STATE_ILLUSTRATIONS).toContain(
      illustrationSrc as (typeof EMPTY_STATE_ILLUSTRATIONS)[number],
    );
    expect(illustration.getAttribute('src')).toBe(illustrationSrc);
  });
});
