import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { StepperModule } from 'primeng/stepper';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import type { ListDocumentItem } from '@solidaris/ui';
import { getDocumentDetailsForAffiliate } from './affiliate-document-detail.mock';
import {
  commentCountTagSeverity,
  isDocumentDetailPeriod,
  type DocumentCertificatAction,
  type DocumentCertificatPanel,
  type DocumentCrossReference,
  type DocumentDetailField,
} from './affiliate-document-detail.types';

/**
 * AffiliateDocumentDetailComponent — iSHARE second-column document detail viewer.
 *
 * Renders PrimeNG stepper and nested accordions for certificate panels. Document
 * title and prev/next navigation live in the parent p-card header slot.
 *
 * ## Figma
 * Node 324:5860 — second column (card header + stepper + sections)
 * https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1
 */
@Component({
  selector: 'app-affiliate-document-detail',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    NgTemplateOutlet,
    StepperModule,
    TagModule,
  ],
  templateUrl: './affiliate-document-detail.component.html',
  styleUrl: './affiliate-document-detail.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'c-affiliate-document-detail o-flex o-flex--y o-layout--min-w-0 o-layout--full-height',
  },
})
export class AffiliateDocumentDetailComponent {
  /** How long the transient panel highlight stays applied, in milliseconds. */
  private static readonly HIGHLIGHT_DURATION_MS = 2000;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly messageService = inject(MessageService);

  /**
   * Header comment-count tag severity, aligned with the document list rows:
   * info-origin comments render as `secondary`, warn-origin as `warn`. The
   * inline `p-message` keeps the raw comment severity (it reflects the actual
   * comment tone, not the count badge).
   */
  readonly commentCountTagSeverity = commentCountTagSeverity;

  readonly selectedDocumentId = input.required<string>();
  readonly affiliateRouteId = input('');
  readonly navigableDocuments = input.required<ListDocumentItem[]>();

  /**
   * Programmatic deep-link target. When set, the document-change effect jumps to
   * `stepValue` / `panelId` instead of resetting to the document defaults. The
   * `panelId` is already decoded by the parent (the list encodes it as
   * `` `${stepValue}::${panelId}` `` and decodes before passing it here).
   */
  readonly focusTarget = input<{ stepValue: number; panelId: string } | null>(
    null,
  );

  readonly selectedDocumentIdChange = output<string>();

  readonly moreDetailsOpen = output<DocumentCertificatPanel>();

  readonly transactionsCicsOpen = output<void>();

  readonly crossReferenceNavigate = output<DocumentCrossReference>();

  readonly activeStep = signal(1);
  readonly certPanelValue = signal<string | string[] | undefined>(
    'certificat-itt',
  );

  /** Panel id currently flashing the transient deep-link highlight, if any. */
  readonly highlightedPanelId = signal<string | null>(null);

  readonly documentDetail = computed(() => {
    const id = this.selectedDocumentId();
    const details = getDocumentDetailsForAffiliate(this.affiliateRouteId());
    return details[id] ?? null;
  });

  readonly documentTitle = computed(
    () => this.documentDetail()?.title ?? '',
  );

  readonly steps = computed(() => this.documentDetail()?.steps ?? []);

  readonly stepNumbered = computed(
    () => this.documentDetail()?.stepNumbered ?? true,
  );

  readonly isStandaloneLayout = computed(
    () => this.documentDetail()?.layout === 'standalone',
  );

  readonly standalonePanels = computed(() => {
    const detail = this.documentDetail();
    if (detail?.layout !== 'standalone') {
      return [];
    }

    const step =
      detail.steps.find((documentStep) => documentStep.value === detail.activeStep) ??
      detail.steps[0];

    return step?.panels ?? [];
  });

  readonly selectedDocumentIndex = computed(() =>
    this.navigableDocuments().findIndex(
      (document) => document.id === this.selectedDocumentId(),
    ),
  );

  readonly canGoToPreviousDocument = computed(
    () => this.selectedDocumentIndex() > 0,
  );

  readonly canGoToNextDocument = computed(() => {
    const index = this.selectedDocumentIndex();
    return index >= 0 && index < this.navigableDocuments().length - 1;
  });

  readonly activeStepIndex = computed(() => {
    const steps = this.steps();
    if (steps.length === 0) {
      return -1;
    }

    return steps.findIndex((step) => step.value === this.activeStep());
  });

  readonly previousDisabled = computed(() => this.activeStepIndex() <= 0);

  readonly nextDisabled = computed(() => {
    const steps = this.steps();
    const index = this.activeStepIndex();

    return index < 0 || index >= steps.length - 1;
  });

  constructor() {
    effect(() => {
      const detail = this.documentDetail();
      const target = this.focusTarget();

      // Prefer a programmatic deep-link target so the document-change reset does
      // not override a jump requested by the parent (list tag click).
      if (target) {
        if (detail?.layout !== 'standalone') {
          this.activeStep.set(target.stepValue);
        }

        this.certPanelValue.set(target.panelId);
        this.focusPanel(target.panelId);
        return;
      }

      this.activeStep.set(detail?.activeStep ?? 1);

      const firstPanelId = detail?.steps[0]?.panels?.[0]?.id;
      this.certPanelValue.set(firstPanelId ?? undefined);
    });
  }

  isPeriodField(field: DocumentDetailField): boolean {
    return isDocumentDetailPeriod(field.value);
  }

  openMoreDetails(panel: DocumentCertificatPanel): void {
    this.moreDetailsOpen.emit(panel);
  }

  onPanelActionClick(action: DocumentCertificatAction): void {
    if (action.label === 'Transactions CICS') {
      this.transactionsCicsOpen.emit();
      return;
    }

    if (action.label === 'Iris') {
      this.messageService.add({
        severity: 'info',
        summary: 'Iris',
        detail: "Ouverture d'Iris…",
      });
    }
  }

  onCrossReferenceClick(reference: DocumentCrossReference): void {
    this.crossReferenceNavigate.emit(reference);
  }

  goToPreviousDocument(): void {
    const index = this.selectedDocumentIndex();
    if (index <= 0) {
      return;
    }

    this.selectedDocumentIdChange.emit(
      this.navigableDocuments()[index - 1].id,
    );
  }

  goToNextDocument(): void {
    const index = this.selectedDocumentIndex();
    const documents = this.navigableDocuments();
    if (index < 0 || index >= documents.length - 1) {
      return;
    }

    this.selectedDocumentIdChange.emit(documents[index + 1].id);
  }

  onCertPanelValueChange(
    value: string | number | string[] | number[] | null | undefined,
  ): void {
    if (value === null || value === undefined) {
      this.certPanelValue.set(undefined);
      return;
    }

    if (typeof value === 'number') {
      this.certPanelValue.set(String(value));
      return;
    }

    if (Array.isArray(value) && typeof value[0] === 'number') {
      this.certPanelValue.set(value.map(String));
      return;
    }

    this.certPanelValue.set(value as string | string[]);
  }

  goToPreviousStep(): void {
    if (this.previousDisabled()) {
      return;
    }

    this.activeStep.update((value) => value - 1);
    this.openFirstPanelOfActiveStep();
  }

  goToNextStep(): void {
    if (this.nextDisabled()) {
      return;
    }

    this.activeStep.update((value) => value + 1);
    this.openFirstPanelOfActiveStep();
  }

  private openFirstPanelOfActiveStep(): void {
    const step = this.steps().find(
      (documentStep) => documentStep.value === this.activeStep(),
    );
    this.certPanelValue.set(step?.panels?.[0]?.id ?? undefined);
  }

  /**
   * Scrolls the target panel's worker-comment message into view and applies a
   * transient highlight class, cleared after {@link HIGHLIGHT_DURATION_MS}.
   * Deferred via `setTimeout` so the panel content has rendered (the effect that
   * calls this also opens the panel by setting `certPanelValue`).
   */
  private focusPanel(panelId: string): void {
    setTimeout(() => {
      const host = this.elementRef.nativeElement as HTMLElement;
      const panelElement = host.querySelector(
        `[data-panel-id="${panelId}"]`,
      );
      panelElement
        ?.querySelector('p-message')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      this.highlightedPanelId.set(panelId);

      setTimeout(() => {
        if (this.highlightedPanelId() === panelId) {
          this.highlightedPanelId.set(null);
        }
      }, AffiliateDocumentDetailComponent.HIGHLIGHT_DURATION_MS);
    });
  }
}
