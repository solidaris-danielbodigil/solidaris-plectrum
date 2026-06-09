import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { StepperModule } from 'primeng/stepper';
import { TagModule } from 'primeng/tag';
import type { ListDocumentItem } from '@solidaris/ui';
import { EVA_MARTINEZ_DOCUMENT_DETAILS } from './affiliate-document-detail.mock';
import {
  isDocumentDetailPeriod,
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
  readonly selectedDocumentId = input.required<string>();
  readonly visibleDocuments = input.required<ListDocumentItem[]>();

  readonly selectedDocumentIdChange = output<string>();

  readonly activeStep = signal(1);
  readonly certPanelValue = signal<string | string[] | undefined>(
    'certificat-itt',
  );

  readonly documentDetail = computed(() => {
    const id = this.selectedDocumentId();
    return EVA_MARTINEZ_DOCUMENT_DETAILS[id] ?? null;
  });

  readonly documentTitle = computed(
    () => this.documentDetail()?.title ?? '',
  );

  readonly steps = computed(() => this.documentDetail()?.steps ?? []);

  readonly selectedDocumentIndex = computed(() =>
    this.visibleDocuments().findIndex(
      (document) => document.id === this.selectedDocumentId(),
    ),
  );

  readonly canGoToPreviousDocument = computed(
    () => this.selectedDocumentIndex() > 0,
  );

  readonly canGoToNextDocument = computed(() => {
    const index = this.selectedDocumentIndex();
    return index >= 0 && index < this.visibleDocuments().length - 1;
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
      this.activeStep.set(detail?.activeStep ?? 1);

      const firstPanelId = detail?.steps[0]?.panels?.[0]?.id;
      this.certPanelValue.set(firstPanelId ?? undefined);
    });
  }

  isPeriodField(field: DocumentDetailField): boolean {
    return isDocumentDetailPeriod(field.value);
  }

  goToPreviousDocument(): void {
    const index = this.selectedDocumentIndex();
    if (index <= 0) {
      return;
    }

    this.selectedDocumentIdChange.emit(
      this.visibleDocuments()[index - 1].id,
    );
  }

  goToNextDocument(): void {
    const index = this.selectedDocumentIndex();
    const documents = this.visibleDocuments();
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
  }

  goToNextStep(): void {
    if (this.nextDisabled()) {
      return;
    }

    this.activeStep.update((value) => value + 1);
  }
}
