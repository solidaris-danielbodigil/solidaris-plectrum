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
  viewChild,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { Popover } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { ScrollTop } from 'primeng/scrolltop';
import { StepperModule } from 'primeng/stepper';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import type {
  ListDocumentItem,
  ListDocumentTag,
  ListDocumentTagTarget,
} from '@solidaris/ui';
import { PdsTelemetryLabelDirective } from '@solidaris/ui';
import { getDocumentDetailsForAffiliate } from './affiliate-document-detail.mock';
import {
  summarizeDocumentStep,
  type DocumentStepSummary,
} from './affiliate-document-detail.tags';
import {
  commentCountTagSeverity,
  isDocumentDetailPeriod,
  type DocumentCertificatAction,
  type DocumentCertificatPanel,
  type DocumentCrossReference,
  type DocumentDetailField,
  type DocumentStep,
  type DocumentStepperView,
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
    PdsTelemetryLabelDirective,
    Popover,
    Ripple,
    ScrollTop,
    Skeleton,
    StepperModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './affiliate-document-detail.component.html',
  styleUrl: './affiliate-document-detail.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'c-affiliate-document-detail o-flex o-flex--y o-layout--min-w-0 o-layout--full-height o-layout--min-h-0 o-flex__item--grow-1',
    '[class.is-loading]': 'loading()',
    '[attr.aria-busy]': 'loading()',
  },
})
export class AffiliateDocumentDetailComponent {
  /** How long the transient panel highlight stays applied, in milliseconds. */
  private static readonly HIGHLIGHT_DURATION_MS = 2000;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly messageService = inject(MessageService);
  private readonly tagPopover = viewChild<Popover>('tagPopover');

  private readonly tagAnchorRect = signal<DOMRectReadOnly | null>(null);
  readonly tagPopoverStyle = signal<Record<string, string> | undefined>(
    undefined,
  );
  readonly activeStepTagContext = signal<{
    step: DocumentStep;
    tag: ListDocumentTag;
  } | null>(null);

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

  readonly loading = input(false);

  readonly stepperView = input<DocumentStepperView>('horizontal');

  protected readonly skeletonStepSlots = [1, 2, 3] as const;
  protected readonly skeletonDetailRowSlots = [1, 2, 3] as const;
  protected readonly skeletonAccordionValue = ['skeleton-panel'] as const;

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

  readonly documentTitle = computed(() => this.documentDetail()?.title ?? '');

  readonly steps = computed(() => this.documentDetail()?.steps ?? []);

  readonly stepSummaries = computed(() => {
    const detail = this.documentDetail();
    const summaries = new Map<number, DocumentStepSummary>();

    if (!detail) {
      return summaries;
    }

    for (const step of detail.steps) {
      summaries.set(step.value, summarizeDocumentStep(step, detail.layout));
    }

    return summaries;
  });

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
      detail.steps.find(
        (documentStep) => documentStep.value === detail.activeStep,
      ) ?? detail.steps[0];

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

  /** Panels for the currently visible step (stepper or standalone layout). */
  readonly activeStepPanels = computed(() => {
    if (this.isStandaloneLayout()) {
      return this.standalonePanels();
    }

    const step = this.steps().find(
      (documentStep) => documentStep.value === this.activeStep(),
    );

    return step?.panels ?? [];
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

        const targetStep =
          detail?.steps.find((step) => step.value === target.stepValue) ??
          detail?.steps[0];
        const targetPanel = targetStep?.panels?.find(
          (panel) => panel.id === target.panelId,
        );

        if (targetPanel && !targetPanel.disabled) {
          this.certPanelValue.set(target.panelId);
          this.focusPanel(target.panelId);
        } else {
          this.certPanelValue.set(undefined);
        }

        return;
      }

      const activeStepValue = detail?.activeStep ?? 1;
      this.activeStep.set(activeStepValue);

      const activeDocumentStep =
        detail?.steps.find((step) => step.value === activeStepValue) ??
        detail?.steps[0];

      this.certPanelValue.set(
        this.defaultExpandedPanelValue(activeDocumentStep?.panels),
      );
    });
  }

  isPeriodField(field: DocumentDetailField): boolean {
    return isDocumentDetailPeriod(field.value);
  }

  stepSummary(step: DocumentStep): DocumentStepSummary | null {
    return this.stepSummaries().get(step.value) ?? null;
  }

  onStepTagClick(
    event: MouseEvent | KeyboardEvent,
    step: DocumentStep,
    tag: ListDocumentTag,
  ): void {
    const targets = tag.targets ?? [];
    event.stopPropagation();

    if (targets.length === 0) {
      return;
    }

    if (targets.length === 1) {
      this.navigateToCommentTarget(step.value, targets[0]);
      return;
    }

    const anchor = this.resolveTagAnchor(event);
    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    this.tagAnchorRect.set(rect);
    this.tagPopoverStyle.set(this.popoverStyleFromRect(rect));
    this.activeStepTagContext.set({ step, tag });
    this.tagPopover()?.show(event, anchor);
    this.scheduleTagPopoverReposition();
  }

  onStepTagKeydown(
    event: KeyboardEvent,
    step: DocumentStep,
    tag: ListDocumentTag,
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onStepTagClick(event, step, tag);
    }
  }

  onStepTagPopoverShow(): void {
    this.scheduleTagPopoverReposition();
  }

  onStepTagPopoverHide(): void {
    this.tagAnchorRect.set(null);
    this.tagPopoverStyle.set(undefined);
  }

  onStepTagTargetSelect(event: Event, target: ListDocumentTagTarget): void {
    event.stopPropagation();
    const active = this.activeStepTagContext();
    if (!active) {
      return;
    }

    this.navigateToCommentTarget(active.step.value, target);
    this.tagPopover()?.hide();
  }

  onStepTagTargetKeydown(
    event: KeyboardEvent,
    target: ListDocumentTagTarget,
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onStepTagTargetSelect(event, target);
    }
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

    this.selectedDocumentIdChange.emit(this.navigableDocuments()[index - 1].id);
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

    const normalized = value as string | string[];
    this.certPanelValue.set(
      this.filterDisabledPanelValues(normalized, this.activeStepPanels()),
    );
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
    this.certPanelValue.set(this.defaultExpandedPanelValue(step?.panels));
  }

  /** First enabled panel id for default expansion; undefined when all are disabled. */
  private defaultExpandedPanelValue(
    panels: DocumentCertificatPanel[] | undefined,
  ): string | undefined {
    return panels?.find((panel) => !panel.disabled)?.id;
  }

  private filterDisabledPanelValues(
    value: string | string[],
    panels: DocumentCertificatPanel[],
  ): string | string[] | undefined {
    const disabledIds = new Set(
      panels.filter((panel) => panel.disabled).map((panel) => panel.id),
    );

    if (disabledIds.size === 0) {
      return value;
    }

    if (Array.isArray(value)) {
      const filtered = value.filter((id) => !disabledIds.has(id));
      return filtered.length > 0 ? filtered : undefined;
    }

    return disabledIds.has(value) ? undefined : value;
  }

  private focusPanel(panelId: string): void {
    setTimeout(() => {
      const host = this.elementRef.nativeElement as HTMLElement;
      const panelElement = host.querySelector(`[data-panel-id="${panelId}"]`);
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

  private navigateToCommentTarget(
    stepValue: number,
    target: ListDocumentTagTarget,
  ): void {
    const separator = target.id.indexOf('::');
    const panelId =
      separator >= 0 ? target.id.slice(separator + 2) : target.id;

    if (panelId.length === 0) {
      return;
    }

    if (this.activeStep() !== stepValue) {
      this.activeStep.set(stepValue);
    }

    const step =
      this.steps().find((documentStep) => documentStep.value === stepValue) ??
      null;
    const panel = step?.panels?.find((item) => item.id === panelId);

    if (panel && !panel.disabled) {
      this.certPanelValue.set(panelId);
      this.focusPanel(panelId);
    }
  }

  private resolveTagAnchor(
    event: MouseEvent | KeyboardEvent,
  ): HTMLElement | undefined {
    if (event.currentTarget instanceof HTMLElement) {
      return event.currentTarget;
    }

    const target = event.target;
    if (target instanceof Element) {
      return (
        target.closest<HTMLButtonElement>(
          '.c-affiliate-document-detail__step-meta button.p-button',
        ) ?? undefined
      );
    }

    return undefined;
  }

  private scheduleTagPopoverReposition(): void {
    const apply = () => this.repositionTagPopover();

    requestAnimationFrame(() => {
      apply();
      requestAnimationFrame(() => {
        apply();
        setTimeout(apply, 0);
        setTimeout(apply, 50);
      });
    });
  }

  private repositionTagPopover(): void {
    const rect = this.tagAnchorRect();
    if (!rect) {
      return;
    }

    const style = this.popoverStyleFromRect(rect);
    this.tagPopoverStyle.set(style);

    const panel = document.body.querySelector('.p-popover') as HTMLElement | null;
    if (!panel) {
      return;
    }

    Object.assign(panel.style, style);
  }

  private popoverStyleFromRect(rect: DOMRectReadOnly): Record<string, string> {
    const gutter = 4;

    return {
      position: 'fixed',
      top: `${rect.bottom + gutter}px`,
      left: `${rect.left}px`,
      margin: '0',
      transform: 'none',
    };
  }
}
