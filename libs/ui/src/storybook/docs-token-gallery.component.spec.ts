import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsTokenGalleryComponent } from './docs-token-gallery.component';
import { clearStorybookToasts } from './storybook-toast';

describe('DocsTokenGalleryComponent', () => {
  let fixture: ComponentFixture<DocsTokenGalleryComponent>;
  let written: string[];

  beforeEach(async () => {
    written = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          written.push(text);
          return Promise.resolve();
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [DocsTokenGalleryComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsTokenGalleryComponent);
  });

  afterEach(() => {
    clearStorybookToasts();
  });

  it('copies the class name from the card and the clipboard button', async () => {
    fixture.componentRef.setInput('cards', [
      {
        name: 'u-shadow-md',
        tag: 'var(--pds-shadow-md)',
        previewClass: 'c-token-explorer__preview--shadow',
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector(
      '.c-token-explorer__item',
    ) as HTMLElement;
    const button = card.querySelector(
      '.c-token-explorer__copy',
    ) as HTMLButtonElement;

    expect(card.textContent).toContain('u-shadow-md');
    expect(button.getAttribute('aria-label')).toBe('Copy u-shadow-md');

    button.click();
    await fixture.whenStable();
    expect(written).toEqual(['u-shadow-md']);
  });

  it('renders a direction glyph when the card names an edge', async () => {
    fixture.componentRef.setInput('cards', [
      {
        name: 'u-border-top',
        direction: { kind: 'border', target: 'top' },
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const glyph = fixture.nativeElement.querySelector(
      'pds-docs-direction',
    ) as HTMLElement;
    expect(glyph).toBeTruthy();
    expect(glyph.getAttribute('data-kind')).toBe('border');
    expect(glyph.getAttribute('data-target')).toBe('top');
  });
});
