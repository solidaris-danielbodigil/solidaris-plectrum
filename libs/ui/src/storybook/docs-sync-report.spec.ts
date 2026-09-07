import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';

import { DocsSyncChangesComponent } from './docs-sync-changes.component';
import { DocsSyncChecksComponent } from './docs-sync-checks.component';
import {
  changeKindSeverity,
  checkSeverity,
  flattenChanges,
  formatSyncDate,
  isColorValue,
  type SyncReport,
  syncOutcome,
} from './sync-report.types';

const REPORT: SyncReport = {
  generatedAt: '2026-09-07T01:36:50.000Z',
  source: 'primeui-figma-plugin-v4',
  branch: 'design-tokens/sync',
  sha: 'd702032',
  actor: 'designer',
  runNumber: '3',
  runUrl: null,
  sets: ['aura/primitive'],
  leafCount: 3,
  resolvedCount: 3,
  unresolved: 0,
  outcomes: { build: 'success', audit: 'success' },
  diff: {
    base: { available: true, label: 'HEAD:libs/plectrum/src/tokens.json' },
    changed: [
      {
        path: 'surface.50',
        before: '#fafafa',
        after: '#f6f6f6',
        alias: 'neutral.50',
      },
      {
        path: 'accordion.panel.border.width',
        before: '1',
        after: '0',
        alias: null,
      },
    ],
    reordered: [
      { path: 'card.shadow', before: 'a, b', after: 'b, a', alias: null },
    ],
    added: [
      {
        path: 'card.background',
        after: '#ffffff',
        alias: 'content.background',
      },
    ],
    removed: [{ path: 'togglebutton.sm.zadding.x', before: '12' }],
  },
  checks: [
    {
      id: 'build',
      name: 'Build',
      status: 'OK',
      detail: 'Refreshed.',
      items: [],
    },
    {
      id: 'audit',
      name: 'Drift audit',
      status: 'PASS',
      detail: 'Agree.',
      items: [],
    },
    {
      id: 'coverage',
      name: 'Preset coverage',
      status: 'WARN',
      detail: '1 code-owned gap.',
      items: ['focus.ring.style'],
    },
    {
      id: 'theme',
      name: 'Theme',
      status: 'SKIP',
      detail: 'No theme files.',
      items: [],
    },
  ],
  result: 'promote',
  resultText: 'A promotion pull request is opened for developer review.',
};

describe('sync report figures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsSyncChecksComponent, DocsSyncChangesComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  describe('mappers', () => {
    it('maps check statuses onto Tag severities', () => {
      expect(checkSeverity('PASS')).toBe('success');
      expect(checkSeverity('OK')).toBe('success');
      expect(checkSeverity('WARN')).toBe('warn');
      expect(checkSeverity('FAIL')).toBe('danger');
      expect(checkSeverity('SKIP')).toBe('secondary');
      expect(checkSeverity('NOT RUN')).toBe('secondary');
    });

    it('maps change kinds onto Tag severities', () => {
      expect(changeKindSeverity('changed')).toBe('warn');
      expect(changeKindSeverity('added')).toBe('success');
      expect(changeKindSeverity('removed')).toBe('danger');
      expect(changeKindSeverity('reordered')).toBe('secondary');
    });

    it('recognises flat colours only', () => {
      expect(isColorValue('#f6f6f6')).toBeTrue();
      expect(isColorValue('rgba(0, 0, 0, 0.1)')).toBeTrue();
      expect(isColorValue('0 8px 10px -6px rgba(0, 0, 0, 0.1)')).toBeFalse();
      expect(isColorValue('12')).toBeFalse();
      expect(isColorValue(null)).toBeFalse();
    });

    it('flattens the diff in reading order with a kind per row', () => {
      expect(flattenChanges(REPORT.diff).map((row) => row.kind)).toEqual([
        'changed',
        'changed',
        'added',
        'removed',
        'reordered',
      ]);
    });

    it('phrases the outcome for main', () => {
      expect(syncOutcome(REPORT)).toEqual(
        jasmine.objectContaining({ tone: 'success', title: 'Promoted' }),
      );
      expect(syncOutcome({ ...REPORT, result: 'blocked' }).tone).toBe('error');
      expect(syncOutcome({ ...REPORT, result: 'preview' })).toEqual(
        jasmine.objectContaining({
          tone: 'info',
          title: 'No promoted sync recorded yet',
        }),
      );
      expect(formatSyncDate(REPORT.generatedAt)).toBe('2026-09-07 01:36 UTC');
    });
  });

  describe('pds-docs-sync-checks', () => {
    it('renders the outcome as a p-message and one severity-mapped p-tag per check', () => {
      const fixture = TestBed.createComponent(DocsSyncChecksComponent);
      fixture.componentRef.setInput('report', REPORT);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(
        host
          .querySelector('p-message')
          ?.classList.contains('p-message-success'),
      )
        .withContext('promote → success')
        .toBeTrue();
      expect(
        host.querySelector('.c-docs-callout__title')?.textContent?.trim(),
      ).toBe('Promoted');

      const tags = Array.from(
        host.querySelectorAll('.c-docs-sync-checks__item p-tag'),
      );
      expect(tags.map((tag) => tag.textContent?.trim())).toEqual([
        'OK',
        'PASS',
        'WARN',
        'SKIP',
      ]);
      expect(tags[0].classList.contains('p-tag-success')).toBeTrue();
      expect(tags[2].classList.contains('p-tag-warn')).toBeTrue();
      expect(tags[3].classList.contains('p-tag-secondary')).toBeTrue();
      expect(host.querySelectorAll('.c-docs-sync-checks__items > li').length)
        .withContext('only the coverage check has items')
        .toBe(1);
    });

    it('shows the blocked outcome as an error message', () => {
      const fixture = TestBed.createComponent(DocsSyncChecksComponent);
      fixture.componentRef.setInput('report', { ...REPORT, result: 'blocked' });
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('p-message');

      expect(message?.classList.contains('p-message-error')).toBeTrue();
    });

    it('shows only the explanation while no sync has been promoted', () => {
      const fixture = TestBed.createComponent(DocsSyncChecksComponent);
      fixture.componentRef.setInput('report', { ...REPORT, result: 'preview' });
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(
        host.querySelector('p-message')?.classList.contains('p-message-info'),
      ).toBeTrue();
      expect(host.querySelectorAll('.c-docs-sync-checks__item').length).toBe(0);
    });
  });

  describe('pds-docs-sync-changes', () => {
    it('renders every change as a p-table row with a kind tag and swatches for colours', () => {
      const fixture = TestBed.createComponent(DocsSyncChangesComponent);
      fixture.componentRef.setInput('report', REPORT);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.querySelector('p-table'))
        .withContext('p-table host')
        .not.toBeNull();
      expect(host.querySelectorAll('tbody tr').length).toBe(5);
      expect(host.querySelectorAll('tbody p-tag').length).toBe(5);
      expect(host.querySelectorAll('.c-docs-sync-changes__swatch').length)
        .withContext('surface.50 before + after, card.background after')
        .toBe(3);
      expect(host.querySelector('p-badge')?.textContent?.trim()).toBe(
        '5 / 5 changes',
      );
      expect(host.querySelectorAll('p-selectbutton [role="button"]').length)
        .withContext('All + four kinds present in the fixture')
        .toBe(5);
    });

    it('filters rows by search text and by kind', () => {
      const fixture = TestBed.createComponent(DocsSyncChangesComponent);
      fixture.componentRef.setInput('report', REPORT);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      const search = host.querySelector<HTMLInputElement>(
        'input[type="search"]',
      );
      expect(search).not.toBeNull();
      search!.value = 'neutral';
      search!.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(host.querySelectorAll('tbody tr').length)
        .withContext('alias match')
        .toBe(1);
      expect(host.querySelector('tbody code')?.textContent).toBe('surface.50');

      search!.value = 'no-such-token';
      search!.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(
        host.querySelector('.c-docs-sync-changes__empty')?.textContent,
      ).toContain('no-such-token');

      search!.value = '';
      search!.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const removedOption = Array.from(
        host.querySelectorAll<HTMLElement>('p-selectbutton [role="button"]'),
      ).find((option) => option.textContent?.includes('Removed'));
      removedOption!.click();
      fixture.detectChanges();
      expect(host.querySelectorAll('tbody tr').length).toBe(1);
      expect(host.querySelector('tbody code')?.textContent).toBe(
        'togglebutton.sm.zadding.x',
      );
    });

    it('explains an empty record instead of rendering a table', () => {
      const fixture = TestBed.createComponent(DocsSyncChangesComponent);
      fixture.componentRef.setInput('report', {
        ...REPORT,
        diff: {
          ...REPORT.diff,
          changed: [],
          reordered: [],
          added: [],
          removed: [],
        },
      });
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.querySelector('p-table')).toBeNull();
      expect(
        host.querySelector('.c-docs-callout__title')?.textContent?.trim(),
      ).toBe('No value changes');
    });

    it('tells the reader when no sync has been promoted yet', () => {
      const fixture = TestBed.createComponent(DocsSyncChangesComponent);
      fixture.componentRef.setInput('report', { ...REPORT, result: 'preview' });
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.querySelector('p-table')).toBeNull();
      expect(
        host.querySelector('.c-docs-callout__title')?.textContent?.trim(),
      ).toBe('No promoted sync recorded yet');
    });
  });
});
