import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import type { ComponentMetadata } from '@solidaris/contracts';
import { TopNavMetadata } from '../lib/top-nav/top-nav.metadata';
import {
  DocsContractComponent,
  usageToDoDont,
} from './docs-contract.component';
import { DocsDoDontComponent } from './docs-do-dont.component';
import type { DocsContractSection } from './docs-figures.types';
import { DocsStatusComponent } from './docs-status.component';

const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

function renderContract(
  metadata: ComponentMetadata,
  section: DocsContractSection,
): HTMLElement {
  const fixture = TestBed.createComponent(DocsContractComponent);
  fixture.componentRef.setInput('metadata', metadata);
  fixture.componentRef.setInput('section', section);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('docs contract figures (metadata is the docs SSOT)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DocsContractComponent,
        DocsDoDontComponent,
        DocsStatusComponent,
      ],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  describe('usageToDoDont', () => {
    it("maps useCases to Do entries and antiPatterns to Don't entries with reason and alternative", () => {
      const { dos, donts } = usageToDoDont(TopNavMetadata.usage);

      expect(dos.map((d) => d.title)).toEqual(TopNavMetadata.usage.useCases);
      expect(donts.length).toBe(TopNavMetadata.usage.antiPatterns.length);
      donts.forEach((dont, i) => {
        const anti = TopNavMetadata.usage.antiPatterns[i];
        expect(dont.title).toBe(anti.scenario);
        expect(dont.detail).toBe(anti.reason);
        expect(dont.alternative).toBe(anti.alternative);
      });
    });
  });

  describe('pds-docs-do-dont', () => {
    it('renders one card per column with an icon per entry and the Instead line', () => {
      const fixture = TestBed.createComponent(DocsDoDontComponent);
      fixture.componentRef.setInput('dos', [{ title: 'Use it here' }]);
      fixture.componentRef.setInput('donts', [
        { title: 'Not there', detail: 'Because', alternative: 'Do this' },
      ]);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(host.querySelectorAll('.c-docs-do-dont__card').length).toBe(2);
      expect(text(host.querySelector('.c-docs-do-dont__card--do .p-tag'))).toBe(
        'Do',
      );
      expect(
        text(host.querySelector('.c-docs-do-dont__card--dont .p-tag')),
      ).toBe("Don't");
      expect(
        host.querySelectorAll('.c-docs-do-dont__card--do .c-docs-do-dont__icon')
          .length,
      ).toBe(1);
      expect(
        text(
          host.querySelector(
            '.c-docs-do-dont__card--dont .c-docs-do-dont__detail',
          ),
        ),
      ).toBe('Because');
      expect(text(host.querySelector('.c-docs-do-dont__alternative'))).toBe(
        'Instead: Do this',
      );
    });

    it('omits a column that has no entries', () => {
      const fixture = TestBed.createComponent(DocsDoDontComponent);
      fixture.componentRef.setInput('dos', [{ title: 'Only dos' }]);
      fixture.detectChanges();

      expect(
        (fixture.nativeElement as HTMLElement).querySelectorAll(
          '.c-docs-do-dont__card',
        ).length,
      ).toBe(1);
    });
  });

  describe('pds-docs-contract', () => {
    it("renders the usage block as Do / Don't cards from the metadata", () => {
      const host = renderContract(TopNavMetadata, 'usage');

      expect(host.getAttribute('data-section')).toBe('usage');
      expect(host.querySelectorAll('.c-docs-do-dont__card--do li').length).toBe(
        TopNavMetadata.usage.useCases.length,
      );
      expect(
        host.querySelectorAll('.c-docs-do-dont__card--dont li').length,
      ).toBe(TopNavMetadata.usage.antiPatterns.length);
    });

    it('renders the anatomy block as a p-table with one row per part', () => {
      const host = renderContract(TopNavMetadata, 'anatomy');
      const rows = host.querySelectorAll('tbody tr');

      expect(rows.length).toBe(TopNavMetadata.anatomy?.length ?? -1);
      expect(text(rows[0].querySelector('code'))).toBe(
        TopNavMetadata.anatomy![0].part,
      );
    });

    it('renders the accessibility block with the WCAG tag and both lists', () => {
      const host = renderContract(TopNavMetadata, 'accessibility');

      expect(text(host.querySelector('.p-tag'))).toBe('WCAG 2.1 AA');
      const lists = host.querySelectorAll('.c-docs-contract__list');
      expect(lists.length).toBe(2);
      expect(lists[0].querySelectorAll('li').length).toBe(
        TopNavMetadata.accessibility.ariaAttributes?.length ?? -1,
      );
      expect(lists[1].querySelectorAll('li').length).toBe(
        TopNavMetadata.accessibility.keyboardSupport?.length ?? -1,
      );
    });

    it('renders states as tags and interactions as a list for the behavior block', () => {
      const host = renderContract(TopNavMetadata, 'behavior');

      expect(host.querySelectorAll('.p-tag').length).toBe(
        TopNavMetadata.behavior?.states.length ?? -1,
      );
      expect(host.querySelectorAll('.c-docs-contract__list li').length).toBe(
        TopNavMetadata.behavior?.interactions?.length ?? -1,
      );
    });

    it('says so instead of vanishing when a block is empty', () => {
      const empty: ComponentMetadata = {
        ...TopNavMetadata,
        anatomy: undefined,
        variants: undefined,
      };

      expect(
        text(
          renderContract(empty, 'anatomy').querySelector(
            '.c-docs-contract__empty',
          ),
        ),
      ).toBe('No anatomy recorded in TopNav.metadata.ts yet.');
      expect(
        text(
          renderContract(empty, 'variants').querySelector(
            '.c-docs-contract__empty',
          ),
        ),
      ).toContain('No variants recorded');
    });
  });

  describe('pds-docs-status', () => {
    it('renders the metadata description as the lead and the Figma URL as an external link', () => {
      const fixture = TestBed.createComponent(DocsStatusComponent);
      fixture.componentRef.setInput('status', TopNavMetadata.governance.status);
      fixture.componentRef.setInput('owner', TopNavMetadata.governance.owner);
      fixture.componentRef.setInput(
        'description',
        TopNavMetadata.component.description,
      );
      fixture.componentRef.setInput(
        'figmaUrl',
        TopNavMetadata.component.figmaUrl,
      );
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      expect(text(host.querySelector('.c-docs-status__description'))).toBe(
        TopNavMetadata.component.description,
      );
      const figma = host.querySelector<HTMLAnchorElement>(
        'a[href*="figma.com"]',
      );
      expect(figma?.getAttribute('target')).toBe('_blank');
      expect(text(figma)).toBe('Open in Figma');
    });
  });
});
