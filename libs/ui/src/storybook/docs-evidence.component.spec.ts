import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import type { AccessibilityEvidence } from '@solidaris/contracts';
import { DocsEvidenceComponent } from './docs-evidence.component';

const EVIDENCE: AccessibilityEvidence = {
  automated: 'passed',
  manualKeyboard: {
    result: 'passed',
    by: 'agent',
    method: 'Tab, Shift+Tab, Enter, Escape',
  },
  manualScreenReader: { result: 'not-assessed' },
  date: '2026-09-22',
  version: '1.0.0',
  limitations: ['Screen reader announcement of the hint is not verified.'],
};

@Component({
  selector: 'pds-docs-evidence-host',
  imports: [DocsEvidenceComponent],
  template: `<pds-docs-evidence wcagLevel="AA" [evidence]="evidence" />`,
})
class HostComponent {
  evidence: AccessibilityEvidence | undefined = EVIDENCE;
}

const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('DocsEvidenceComponent', () => {
  async function render(evidence: AccessibilityEvidence | undefined) {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.evidence = evidence;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the target as a target, then one row per check', async () => {
    const el = await render(EVIDENCE);
    expect(text(el.querySelector('p'))).toContain('WCAG 2.1 AA');
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    expect(text(rows[0])).toContain('Automated');
    expect(text(rows[0])).toContain('Passed');
    expect(text(rows[1])).toContain('Agent-run');
    expect(text(rows[1])).toContain('Tab, Shift+Tab');
    expect(text(rows[2])).toContain('Not assessed');
  });

  it('prints the date, version and known limitations', async () => {
    const el = await render(EVIDENCE);
    expect(text(el)).toContain('Last checked 2026-09-22, version 1.0.0.');
    expect(text(el)).toContain('Known limitations');
    expect(text(el)).toContain('Screen reader announcement');
  });

  it('reads Not assessed everywhere when no evidence is recorded', async () => {
    const el = await render(undefined);
    const tags = Array.from(el.querySelectorAll('tbody p-tag')).map(text);
    expect(tags).toEqual(['Not assessed', 'Not assessed', 'Not assessed']);
    expect(el.querySelector('p-message')).toBeNull();
  });
});
