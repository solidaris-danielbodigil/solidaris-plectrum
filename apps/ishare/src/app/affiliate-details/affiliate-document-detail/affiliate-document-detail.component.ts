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
 * Renders PrimeNG stepper and stacked certificate/metadata sections. Document title
 * and prev/next navigation live in the parent p-card header slot.
 *
 * ## Figma
 * Node 324:5860 — second column (card header + stepper + sections)
 * https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1
 */
@Component({
  selector: 'app-affiliate-document-detail',
  standalone: true,
  imports: [ButtonModule, DividerModule, StepperModule, TagModule],
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

  readonly isFirstStep = computed(() => {
    const steps = this.steps();
    if (steps.length === 0) {
      return true;
    }

    return this.activeStep() === steps[0].value;
  });

  readonly isLastStep = computed(() => {
    const steps = this.steps();
    if (steps.length === 0) {
      return true;
    }

    return this.activeStep() === steps[steps.length - 1].value;
  });

  constructor() {
    effect(() => {
      const detail = this.documentDetail();
      this.activeStep.set(detail?.activeStep ?? 1);
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

  goToPreviousStep(activateCallback: (index: number) => void): void {
    if (this.isFirstStep()) {
      return;
    }

    activateCallback(this.activeStep() - 1);
  }

  goToNextStep(activateCallback: (index: number) => void): void {
    if (this.isLastStep()) {
      return;
    }

    activateCallback(this.activeStep() + 1);
  }
}
