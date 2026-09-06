import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';

import { DocsCalloutComponent } from './docs-callout.component';
import { docsHeroEyebrow } from './docs-stack';
import { DocsCardsComponent } from './docs-cards.component';
import {
  calloutSeverity,
  docsLinkAttrs,
  toneSeverity,
} from './docs-figures.types';
import { DocsHeroComponent } from './docs-hero.component';
import { DocsLinkComponent } from './docs-link.component';
import { DocsStepsComponent } from './docs-steps.component';

describe('docs figures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DocsStepsComponent,
        DocsCardsComponent,
        DocsCalloutComponent,
        DocsHeroComponent,
        DocsLinkComponent,
      ],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  describe('pds-docs-hero', () => {
    it('renders the brand banner with an h1, the exported shape assets, and top-targeted actions', () => {
      const fixture = TestBed.createComponent(DocsHeroComponent);
      fixture.componentRef.setInput('title', 'Plectrum Design System');
      fixture.componentRef.setInput('lead', 'Welcome');
      fixture.componentRef.setInput('actions', [
        { label: 'Start', path: '/docs/intro--docs', variant: 'primary' },
        {
          label: 'Contribute',
          path: '/docs/contribute--docs',
          variant: 'secondary',
        },
      ]);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.classList.contains('c-docs-hero')).toBeTrue();
      expect(
        host.querySelector('h1.c-docs-hero__title')?.textContent?.trim(),
      ).toBe('Plectrum Design System');
      expect(
        host.querySelector('.c-docs-hero__eyebrow')?.textContent?.trim(),
      ).toBe(docsHeroEyebrow());
      expect(
        host.querySelector('.c-docs-hero__lead')?.textContent?.trim(),
      ).toBe('Welcome');

      const shapes = host.querySelectorAll<HTMLImageElement>(
        '.c-docs-hero__shape',
      );
      expect(shapes.length)
        .withContext('three overlapping plectrum copies')
        .toBe(3);
      shapes.forEach((img) =>
        expect(img.getAttribute('src')).toBe('assets/plectrum-shape.svg'),
      );
      expect(
        host
          .querySelector('.c-docs-hero__backdrop')
          ?.getAttribute('aria-hidden'),
      ).toBe('true');
      expect(
        host
          .querySelector<HTMLImageElement>('.c-docs-hero__logo-img')
          ?.getAttribute('alt'),
      ).toBe('Solidaris');

      const links = host.querySelectorAll<HTMLAnchorElement>(
        '.c-docs-hero__actions a[pButton]',
      );
      expect(links.length).toBe(2);
      expect(links[0].getAttribute('href')).toBe('./?path=/docs/intro--docs');
      expect(links[0].getAttribute('target'))
        .withContext('escape the docs iframe')
        .toBe('_top');
      expect(links[0].textContent?.trim()).toBe('Start');
      expect(links[1].classList.contains('p-button-outlined'))
        .withContext('secondary → outlined')
        .toBeTrue();
    });

    it('always shows the stack versions; omits lead and actions when not provided', () => {
      const fixture = TestBed.createComponent(DocsHeroComponent);
      fixture.componentRef.setInput('title', 'Only a title');
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(
        host.querySelector('.c-docs-hero__eyebrow')?.textContent?.trim(),
      ).toBe(docsHeroEyebrow());
      expect(host.querySelector('.c-docs-hero__lead')).toBeNull();
      expect(host.querySelector('.c-docs-hero__actions')).toBeNull();
    });
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

  describe('docsLinkAttrs', () => {
    it('rewrites markdown ?path= onto the manager and leaves the iframe', () => {
      expect(docsLinkAttrs('?path=/docs/foundations-spacing--docs')).toEqual({
        href: './?path=/docs/foundations-spacing--docs',
        target: '_top',
      });
    });

    it('opens external URLs in a new tab', () => {
      expect(docsLinkAttrs('https://primeng.dev/button#link')).toEqual({
        href: 'https://primeng.dev/button#link',
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    });

    it('keeps in-page hashes inside the iframe', () => {
      expect(docsLinkAttrs('#commands')).toEqual({
        href: '#commands',
        target: '_self',
      });
    });
  });

  describe('pds-docs-link', () => {
    it('renders a PrimeNG Button link on a real anchor', () => {
      const fixture = TestBed.createComponent(DocsLinkComponent);
      fixture.componentRef.setInput('label', 'Spacing');
      fixture.componentRef.setInput('path', '/docs/foundations-spacing--docs');
      fixture.detectChanges();
      const link = fixture.nativeElement.querySelector(
        'a[pButton]',
      ) as HTMLAnchorElement;

      expect(link).not.toBeNull();
      expect(link.classList.contains('p-button-link')).toBeTrue();
      expect(link.getAttribute('href')).toBe(
        './?path=/docs/foundations-spacing--docs',
      );
      expect(link.getAttribute('target')).toBe('_top');
      expect(link.textContent?.trim()).toBe('Spacing');
    });
  });

  describe('pds-docs-steps', () => {
    it('renders one numbered timeline event per step with an actor tag', () => {
      const fixture = TestBed.createComponent(DocsStepsComponent);
      fixture.componentRef.setInput('steps', [
        {
          title: 'First',
          who: 'Designer',
          tone: 'design',
          detail: 'Detail one',
          links: [
            { label: 'Spacing', path: '/docs/foundations-spacing--docs' },
          ],
        },
        { title: 'Second', who: 'CI' },
      ]);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.querySelector('p-timeline'))
        .withContext('p-timeline host')
        .not.toBeNull();
      const badges = Array.from(host.querySelectorAll('p-badge')).map((el) =>
        el.textContent?.trim(),
      );
      expect(badges).toEqual(['1', '2']);
      expect(host.querySelectorAll('.c-docs-steps__title').length).toBe(2);
      expect(host.querySelectorAll('.c-docs-steps__detail').length).toBe(1);

      const links = host.querySelectorAll<HTMLAnchorElement>(
        '.c-docs-steps__links a[pButton]',
      );
      expect(links.length).withContext('only the first step has links').toBe(1);
      expect(links[0].textContent?.trim()).toBe('Spacing');
      expect(links[0].getAttribute('href')).toBe(
        './?path=/docs/foundations-spacing--docs',
      );
      expect(links[0].getAttribute('target'))
        .withContext('escape the docs iframe')
        .toBe('_top');
      expect(links[0].classList.contains('p-button-link'))
        .withContext('Button link variant')
        .toBeTrue();

      const tags = host.querySelectorAll('p-tag');
      expect(tags.length).toBe(2);
      expect(tags[0].textContent?.trim()).toBe('Designer');
      expect(tags[0].classList.contains('p-tag-warn'))
        .withContext('design → warn')
        .toBeTrue();
      expect(tags[1].classList.contains('p-tag-secondary'))
        .withContext('default → secondary')
        .toBeTrue();
    });
  });

  describe('pds-docs-cards', () => {
    it('renders a p-card per entry, an eyebrow tag when given, and the 2-up modifier', () => {
      const fixture = TestBed.createComponent(DocsCardsComponent);
      fixture.componentRef.setInput('cards', [
        {
          eyebrow: 'Designer',
          tone: 'design',
          title: 'Owns design decisions',
          items: ['a', 'b'],
        },
        { title: 'Rule', lead: 'Lead text' },
      ]);
      fixture.componentRef.setInput('columns', 2);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.classList.contains('c-docs-cards--2-up')).toBeTrue();
      expect(host.querySelectorAll('p-card').length).toBe(2);
      expect(host.querySelectorAll('p-tag').length).toBe(1);
      expect(host.querySelectorAll('.c-docs-cards__list > li').length).toBe(2);
      expect(
        host.querySelector('.c-docs-cards__lead')?.textContent?.trim(),
      ).toBe('Lead text');
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
      expect(message?.classList.contains('p-message-warn'))
        .withContext('warning → warn')
        .toBeTrue();
      expect(
        host.querySelector('.c-docs-callout__title')?.textContent?.trim(),
      ).toBe('Guardrail');
      expect(
        host.querySelector('.c-docs-callout__text')?.textContent?.trim(),
      ).toBe('Explanation');
      expect(host.querySelectorAll('.c-docs-callout__list > li').length).toBe(
        2,
      );
    });
  });
});
