import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { readTokenDeclarations } from './cssom';
import { classifyToken } from './token-taxonomy';
import { TokenFinderComponent } from './token-finder.component';

function cardNames(fixture: ComponentFixture<TokenFinderComponent>): string[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.c-token-explorer__name'),
  ).map((node) => (node as HTMLElement).textContent!.trim());
}

describe('TokenFinderComponent', () => {
  let fixture: ComponentFixture<TokenFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenFinderComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenFinderComponent);
  });

  async function selectIntent(key: string): Promise<void> {
    fixture.componentInstance.intentKey.set(key);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('puts the intent field in the explorer toolbar', () => {
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('pds-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.querySelector('#pds-token-finder-intent')).toBeTruthy();
    expect(toolbar.textContent).toContain('What are you styling?');
  });

  it('lists only border-role colour tokens for the Border intent', async () => {
    await selectIntent('border');

    const names = cardNames(fixture);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((name) => name.includes('border')))
      .withContext(names.join(', '))
      .toBe(true);
    // Whole-group members that used to leak in through groups: ['surface', 'content', 'form'].
    expect(names).not.toContain('color-text');
    expect(names).not.toContain('color-surface-0');
    expect(names).not.toContain('color-form-placeholder');

    // Every border-role colour token in the stylesheet is present — the list is
    // the CSSOM, not a curated subset.
    const expected = [...readTokenDeclarations().values()]
      .filter(
        (declaration) =>
          /border/.test(declaration.name) &&
          classifyToken(declaration.name).category === 'color',
      )
      .map((declaration) => declaration.name);
    expect(expected).toContain('color-panel-border');
    expect(expected).toContain('color-card-border');
    expect(expected).toContain('color-content-border');
    expect(expected).toContain('color-form-border');
    expect(names.sort()).toEqual(expected.sort());
  });

  it('points at Foundations / Colors for the full palette', async () => {
    await selectIntent('border');
    expect(fixture.nativeElement.textContent).toContain('Foundations / Colors');
  });

  it('keeps the unfiltered explorer behaviour for other intents', async () => {
    await selectIntent('text-color');
    const names = cardNames(fixture);
    expect(names).toContain('color-text');
    expect(names.some((name) => name.includes('border'))).toBe(false);
  });
});
