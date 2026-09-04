import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExplorerComponent } from './token-explorer.component';
import { clearStorybookToasts } from './storybook-toast';

function textOf(fixture: ComponentFixture<TokenExplorerComponent>): string {
  return fixture.nativeElement.textContent as string;
}

function cards(fixture: ComponentFixture<TokenExplorerComponent>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.c-token-explorer__item'),
  );
}

/** Corner copy control — click the button so the handler is the one under test. */
function copyButton(card: HTMLElement): HTMLButtonElement {
  return card.querySelector('.c-token-explorer__copy')!;
}

function cardNamed(
  fixture: ComponentFixture<TokenExplorerComponent>,
  name: string,
): HTMLElement {
  return cards(fixture).find(
    (card) =>
      card.querySelector('.c-token-explorer__name')!.textContent!.trim() === name,
  )!;
}

describe('TokenExplorerComponent', () => {
  let fixture: ComponentFixture<TokenExplorerComponent>;
  let written: string[];

  beforeEach(async () => {
    written = [];
    // Headless Chrome exposes no clipboard without a permission grant.
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
      imports: [TokenExplorerComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenExplorerComponent);
  });

  afterEach(() => {
    clearStorybookToasts();
  });

  async function render(
    inputs: Partial<{
      category: string;
      groups: readonly string[];
      bundle: 'type-role' | null;
      stubPrime: boolean;
    }>,
  ): Promise<void> {
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('renders sections and a card per token', async () => {
    await render({ category: 'radius' });

    expect(textOf(fixture)).not.toContain('How to use');
    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__section-title')
        .textContent,
    ).toContain('Stops');

    const names = cards(fixture).map((card) =>
      card.querySelector('.c-token-explorer__name')!.textContent!.trim(),
    );
    expect(names).toContain('radius-md');
    // Discovered from the stylesheet, so code-owned stops appear with no
    // manifest entry — radius-pill is declared only in _settings.radius.scss.
    expect(names).toContain('radius-pill');
  });

  it('renders icon size tokens on the same card chrome', async () => {
    await render({ category: 'icon' });

    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__section-title')
        .textContent,
    ).toContain('Sizes');

    const names = cards(fixture).map((card) =>
      card.querySelector('.c-token-explorer__name')!.textContent!.trim(),
    );
    expect(names).toContain('icon-size');
    expect(names).toContain('icon-size-md');
    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__preview--icon'),
    ).toBeTruthy();
  });

  it('splits color pages the way Figma does', async () => {
    await render({ category: 'color', groups: ['blue', 'gray'] });
    const primitive = cards(fixture).map((card) =>
      card.querySelector('.c-token-explorer__name')!.textContent!.trim(),
    );
    expect(primitive).toContain('color-blue-500');
    expect(primitive).not.toContain('color-text');
    expect(primitive).not.toContain('color-primary-600');

    await render({ category: 'color', groups: ['text', 'primary'] });
    const semantic = cards(fixture).map((card) =>
      card.querySelector('.c-token-explorer__name')!.textContent!.trim(),
    );
    expect(semantic).toContain('color-text');
    expect(semantic).toContain('color-primary-600');
    expect(semantic).toContain('color-primary-interactive');
    expect(semantic).not.toContain('color-blue-500');
  });

  it('shows the authored declaration, alias and fallback read from CSS', async () => {
    await render({ category: 'color' });

    fixture.componentInstance.search.set('color-primary-600');
    fixture.componentInstance.activeView.set('table');
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('.c-token-explorer__table tbody tr');
    const text = row.textContent as string;
    // Hybrid emit: the alias and its literal both come from the stylesheet.
    expect(text).toContain('var(--p-primary-600, #487395)');
    expect(text).toContain('--p-primary-600');
  });

  it('groups tokens the manifest does not annotate into a component section', async () => {
    await render({ category: 'color' });

    const labels = fixture.componentInstance
      .sections()
      .map((section) => section.label);
    expect(labels).toContain('Component & feature tokens');
    // Foundation roles stay ahead of the component bucket.
    expect(labels.indexOf('Component & feature tokens')).toBe(labels.length - 1);
  });

  it('resolves a value for every rendered token', async () => {
    await render({ category: 'shadow' });

    const values = cards(fixture).map((card) =>
      card.querySelector('.c-token-explorer__value')!.textContent!.trim(),
    );
    expect(values.length).toBeGreaterThan(0);
    expect(values.every((value) => value.length > 0)).toBe(true);
  });

  it('hides search below the threshold and shows it for large categories', async () => {
    await render({ category: 'focus' });
    expect(fixture.componentInstance.totalCount()).toBeLessThanOrEqual(8);
    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__search-input'),
    ).toBeNull();

    await render({ category: 'color' });
    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__search-input'),
    ).toBeTruthy();
  });

  it('filters tokens by search across name and value', async () => {
    await render({ category: 'color' });
    const before = fixture.componentInstance.matchCount();

    fixture.componentInstance.search.set('primary-600');
    fixture.detectChanges();

    const after = fixture.componentInstance.matchCount();
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(before);
    expect(
      cards(fixture).every((card) =>
        card
          .querySelector('.c-token-explorer__name')!
          .textContent!.includes('primary-600'),
      ),
    ).toBe(true);
  });

  it('uses a button row for few roles and a dropdown for many', async () => {
    await render({ category: 'shadow' });
    expect(fixture.componentInstance.compactFilter()).toBe(false);
    expect(fixture.nativeElement.querySelector('p-selectbutton')).toBeTruthy();

    await render({ category: 'color' });
    expect(fixture.componentInstance.compactFilter()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__filter'),
    ).toBeTruthy();
  });

  it('filters to one section', async () => {
    await render({ category: 'shadow' });

    fixture.componentInstance.sectionFilter.set('overlay');
    fixture.detectChanges();

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('.c-token-explorer__section-title'),
    ).map((node) => (node as HTMLElement).textContent!.trim());
    expect(titles.length).toBe(1);
    expect(titles[0]).toContain('Overlay');
  });

  it('shows the empty state when nothing matches', async () => {
    await render({ category: 'color' });

    fixture.componentInstance.search.set('no-such-token-xyz');
    fixture.detectChanges();

    expect(fixture.componentInstance.matchCount()).toBe(0);
    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__empty'),
    ).toBeTruthy();
  });

  it('copies the selected format on click', async () => {
    await render({ category: 'radius' });

    const card = cardNamed(fixture, 'radius-md');

    copyButton(card).click();
    expect(written).toEqual(['var(--pds-radius-md)']);

    fixture.componentInstance.copyFormat.set('name');
    fixture.detectChanges();
    copyButton(card).click();
    expect(written[1]).toBe('--pds-radius-md');

    fixture.componentInstance.copyFormat.set('value');
    fixture.detectChanges();
    copyButton(card).click();
    expect(written[2]).toBeTruthy();
    expect(written[2]).not.toContain('--pds-');
  });

  it('keeps grid cells as listitems with a named copy button', async () => {
    await render({ category: 'radius' });

    const list = fixture.nativeElement.querySelector('.c-token-explorer__grid');
    expect(list.getAttribute('role')).toBe('list');
    expect(Array.from(list.children).every((child) => (child as Element).tagName === 'LI')).toBe(
      true,
    );

    const button = copyButton(cardNamed(fixture, 'radius-md'));
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-label')).toBe('Copy var(--pds-radius-md)');
  });

  it('switches to the table view', async () => {
    await render({ category: 'radius' });
    expect(fixture.nativeElement.querySelector('.c-token-explorer__table')).toBeNull();

    fixture.componentInstance.activeView.set('table');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.c-token-explorer__table'),
    ).toBeTruthy();
    expect(cards(fixture).length).toBe(0);
  });

  it('bundles typography roles into one row with family, weight and line-height', async () => {
    await render({ category: 'typography', bundle: 'type-role' });

    const names = cards(fixture).map((card) =>
      card.querySelector('.c-token-explorer__name')!.textContent!.trim(),
    );
    // 15 roles: 3 display + 4 heading + 4 label + 4 body
    expect(names.length).toBe(15);
    expect(names).toContain('text-body-md');
    expect(names).not.toContain('text-body-md-size');
    // Component type tokens match the property suffix but are not roles.
    expect(names).not.toContain('text-delay-prediction-metric');

    const bundle = cardNamed(fixture, 'text-display-lg');
    const props = Array.from(
      bundle.querySelectorAll('.c-token-explorer__member dt'),
    ).map((node) => node.textContent!.trim());
    expect(props).toEqual(['family', 'weight', 'line-height']);
    expect(bundle.querySelector('.c-token-explorer__value')).toBeNull();
    expect(bundle.textContent).toContain('.u-text-display-lg');
  });

  it('copies a mixin include for a bundled type role', async () => {
    await render({ category: 'typography', bundle: 'type-role' });

    copyButton(cardNamed(fixture, 'text-body-md')).click();

    expect(written).toEqual(['@include text-body-md;']);
  });

  // TestBed never calls providePlectrum(), so every mapped --p-* is absent here.
  // That is the same condition stubPrime creates in Storybook.
  it('flags mapped --p-* as empty and still shows a generated fallback', async () => {
    await render({ category: 'color', stubPrime: true });

    const flagged = cards(fixture).filter((card) =>
      card.classList.contains('is-warning'),
    );
    expect(flagged.length).toBeGreaterThan(0);
    expect(
      flagged[0].querySelector('.c-token-explorer__value')!.textContent!.trim(),
    ).toBeTruthy();
  });
});
