import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import type { AnatomyPart } from '@solidaris/contracts';
import { DocsAnatomyComponent } from './docs-anatomy.component';
import {
  anatomyPartSelectors,
  leafOrientation,
  placeAnatomyCallouts,
  queryAnatomyPart,
} from './docs-anatomy';

const PARTS: AnatomyPart[] = [
  { part: 'c-copyable-text', role: 'Host button' },
  { part: 'c-copyable-text__label', role: 'Visible field name' },
  { part: 'c-copyable-text__separator', role: 'Parent-owned bullet' },
];

@Component({
  selector: 'pds-docs-anatomy-host',
  imports: [DocsAnatomyComponent],
  template: `
    <pds-docs-anatomy [parts]="parts" bemBlock="c-copyable-text">
      <button class="c-copyable-text" type="button">
        <span class="c-copyable-text__label">Territoire</span>
      </button>
    </pds-docs-anatomy>
  `,
})
class DocsAnatomyHostComponent {
  readonly parts = PARTS;
}

const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('anatomyPartSelectors', () => {
  it('turns a BEM class into a class selector', () => {
    expect(anatomyPartSelectors('c-copyable-text__icon')).toEqual([
      '.c-copyable-text__icon',
    ]);
  });

  it('splits slash pairs and resolves a leftover __element against the block', () => {
    expect(
      anatomyPartSelectors(
        'c-plectrum-avatar__shape / __initials',
        'c-plectrum-avatar',
      ),
    ).toEqual(['.c-plectrum-avatar__shape', '.c-plectrum-avatar__initials']);
  });

  it('tries the PrimeNG host as an element and as a class', () => {
    expect(anatomyPartSelectors('p-drawer')).toEqual(['p-drawer', '.p-drawer']);
  });

  it('keeps attribute and compound selectors as written', () => {
    expect(anatomyPartSelectors('svg[data-p-icon="times"]')).toEqual([
      'svg[data-p-icon="times"]',
    ]);
    expect(anatomyPartSelectors('i.bi')).toEqual(['i.bi']);
    expect(anatomyPartSelectors('data-state="active"')).toEqual([
      '[data-state="active"]',
    ]);
  });

  it('skips placeholders and prose labels', () => {
    expect(anatomyPartSelectors('c-drawer__{feature}-{part}')).toEqual([]);
    expect(anatomyPartSelectors('c-icon--xs … c-icon--xl')).toEqual([]);
    expect(anatomyPartSelectors('Row launch button')).toEqual([]);
  });
});

describe('queryAnatomyPart', () => {
  it('returns the first matching element inside the root', () => {
    const root = document.createElement('div');
    root.innerHTML = `<button class="c-copyable-text"><span class="c-copyable-text__label">Territoire</span></button>`;
    expect(queryAnatomyPart(root, 'c-copyable-text__label')?.textContent).toBe(
      'Territoire',
    );
    expect(queryAnatomyPart(root, 'c-copyable-text__value')).toBeNull();
  });
});

describe('placeAnatomyCallouts', () => {
  const metrics = {
    markerRadius: 12,
    gutter: 32,
    clearance: 28,
    anchorRadius: 3,
  };

  it('puts a wrapping host on the left and a row of siblings below', () => {
    const callouts = placeAnatomyCallouts(
      [
        { index: 1, x: 40, y: 40, w: 200, h: 40 },
        { index: 2, x: 50, y: 48, w: 40, h: 24 },
        { index: 3, x: 100, y: 48, w: 60, h: 24 },
        { index: 4, x: 170, y: 48, w: 50, h: 24 },
      ],
      { w: 320, h: 160 },
      metrics,
    );

    expect(callouts.find((c) => c.index === 1)?.side).toBe('left');
    const bottom = callouts.filter((c) => c.index !== 1);
    expect(bottom.every((c) => c.side === 'bottom')).toBe(true);
    expect(new Set(bottom.map((c) => c.markerY)).size).toBe(1);
    expect(leafOrientation(bottom)).toBe('row');
  });

  it('puts a vertical stack of siblings on the right', () => {
    const callouts = placeAnatomyCallouts(
      [
        { index: 1, x: 40, y: 20, w: 180, h: 160 },
        { index: 2, x: 56, y: 36, w: 80, h: 24 },
        { index: 3, x: 56, y: 80, w: 148, h: 24 },
        { index: 4, x: 90, y: 124, w: 100, h: 24 },
      ],
      { w: 400, h: 220 },
      metrics,
    );

    expect(callouts.find((c) => c.index === 1)?.side).toBe('left');
    const right = callouts.filter((c) => c.index !== 1);
    expect(right.every((c) => c.side === 'right')).toBe(true);
    expect(new Set(right.map((c) => c.markerX)).size).toBe(1);
    const lengths = right.map((c) => Math.abs(c.lineX2 - c.lineX1));
    expect(Math.max(...lengths)).toBeGreaterThan(Math.min(...lengths));
  });

  it('aligns left-side badges on one rail', () => {
    const callouts = placeAnatomyCallouts(
      [
        { index: 1, x: 40, y: 90, w: 40, h: 24 },
        { index: 2, x: 60, y: 150, w: 30, h: 24 },
        { index: 3, x: 200, y: 20, w: 40, h: 20 },
        { index: 4, x: 200, y: 220, w: 40, h: 20 },
      ],
      { w: 400, h: 280 },
      metrics,
    );

    const left = callouts.filter((c) => c.side === 'left');
    expect(left.length).toBeGreaterThan(1);
    expect(new Set(left.map((c) => c.markerX)).size).toBe(1);
    const lengths = left.map((c) => Math.abs(c.lineX2 - c.lineX1));
    expect(Math.max(...lengths)).toBeGreaterThan(Math.min(...lengths));
  });
});

describe('pds-docs-anatomy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsAnatomyHostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  it('renders found parts only, with leaders, and a note for the rest', async () => {
    const fixture = TestBed.createComponent(DocsAnatomyHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.c-copyable-text__label')?.textContent).toBe(
      'Territoire',
    );

    const items = host.querySelectorAll('.c-docs-anatomy__legend-item');
    expect(items.length).toBe(2);
    expect(text(items[0].querySelector('.c-docs-anatomy__label'))).toBe(
      'Host button',
    );
    expect(text(items[1].querySelector('.c-docs-anatomy__label'))).toBe(
      'Visible field name',
    );

    expect(host.querySelectorAll('.c-docs-anatomy__marker').length).toBe(2);
    expect(host.querySelectorAll('.c-docs-anatomy__leader').length).toBe(2);
    expect(host.querySelector('.p-tag')).toBeNull();
    expect(text(host.querySelector('p-message'))).toContain(
      'Extra elements may appear in other variants.',
    );
  });
});
