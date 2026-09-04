import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';

import { DocsCalloutComponent } from './docs-callout.component';
import { DocsCardsComponent } from './docs-cards.component';
import { calloutSeverity, toneSeverity } from './docs-figures.types';
import { DocsStepsComponent } from './docs-steps.component';

describe('docs figures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsStepsComponent, DocsCardsComponent, DocsCalloutComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  describe('tone mapping', () => {
    it('maps figure tones onto PrimeNG severities', () => {
      expect(toneSeverity('design')).toBe('warn');
      expect(toneSeverity('system')).toBe('info');
      expect(toneSeverity('app')).toBe('success');
      expect(toneSeverity('neutral')).toBe('secondary');
      expect(toneSeverity()).toBe('secondary');
    });

    it('maps callout tones onto Message severities', () => {
      expect(calloutSeverity('warning')).toBe('warn');
      expect(calloutSeverity('success')).toBe('success');
      expect(calloutSeverity()).toBe('info');
    });
  });

  describe('pds-docs-steps', () => {
    it('renders one numbered timeline event per step with an actor tag', () => {
      const fixture = TestBed.createComponent(DocsStepsComponent);
      fixture.componentRef.setInput('steps', [
        { title: 'First', who: 'Designer', tone: 'design', detail: 'Detail one' },
        { title: 'Second', who: 'CI' },
      ]);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.querySelector('p-timeline')).withContext('p-timeline host').not.toBeNull();
      const badges = Array.from(host.querySelectorAll('p-badge')).map((el) => el.textContent?.trim());
      expect(badges).toEqual(['1', '2']);
      expect(host.querySelectorAll('.c-docs-steps__title').length).toBe(2);
      expect(host.querySelectorAll('.c-docs-steps__detail').length).toBe(1);

      const tags = host.querySelectorAll('p-tag');
      expect(tags.length).toBe(2);
      expect(tags[0].textContent?.trim()).toBe('Designer');
      expect(tags[0].classList.contains('p-tag-warn')).withContext('design → warn').toBeTrue();
      expect(tags[1].classList.contains('p-tag-secondary')).withContext('default → secondary').toBeTrue();
    });
  });

  describe('pds-docs-cards', () => {
    it('renders a p-card per entry, an eyebrow tag when given, and the 2-up modifier', () => {
      const fixture = TestBed.createComponent(DocsCardsComponent);
      fixture.componentRef.setInput('cards', [
        { eyebrow: 'Designer', tone: 'design', title: 'Owns design decisions', items: ['a', 'b'] },
        { title: 'Rule', lead: 'Lead text' },
      ]);
      fixture.componentRef.setInput('columns', 2);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.classList.contains('c-docs-cards--2-up')).toBeTrue();
      expect(host.querySelectorAll('p-card').length).toBe(2);
      expect(host.querySelectorAll('p-tag').length).toBe(1);
      expect(host.querySelectorAll('.c-docs-cards__list > li').length).toBe(2);
      expect(host.querySelector('.c-docs-cards__lead')?.textContent?.trim()).toBe('Lead text');
    });
  });

  describe('pds-docs-callout', () => {
    it('renders a p-message with the mapped severity, title, text and items', () => {
      const fixture = TestBed.createComponent(DocsCalloutComponent);
      fixture.componentRef.setInput('tone', 'warning');
      fixture.componentRef.setInput('title', 'Guardrail');
      fixture.componentRef.setInput('text', 'Explanation');
      fixture.componentRef.setInput('items', ['one', 'two']);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      const message = host.querySelector('p-message');
      expect(message).not.toBeNull();
      expect(message?.classList.contains('p-message-warn')).withContext('warning → warn').toBeTrue();
      expect(host.querySelector('.c-docs-callout__title')?.textContent?.trim()).toBe('Guardrail');
      expect(host.querySelector('.c-docs-callout__text')?.textContent?.trim()).toBe('Explanation');
      expect(host.querySelectorAll('.c-docs-callout__list > li').length).toBe(2);
    });
  });
});
