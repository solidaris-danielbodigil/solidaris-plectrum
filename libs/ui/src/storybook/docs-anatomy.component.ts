// =============================================================================
// libs/ui/src/storybook/docs-anatomy.component.ts
// Anatomy figure for component docs pages.
//
// Projects a live specimen (the primary catalogue story) and hangs numbered
// PrimeNG badges with Material-style leader lines on each metadata.anatomy
// part that is in the DOM. The legend lists only those found parts. Missing
// parts are a single p-message, not numbered callouts.
//
// PrimeNG components used:
//   - p-badge   — callout index on the specimen and in the legend
//   - p-message — note when metadata lists parts this example does not show
//
// Overlay positions are measured from the CSSOM (rule 10). Styles:
// c-docs-anatomy* in libs/styles/src/06-components/_components.docs-figures.scss
// =============================================================================

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { AnatomyPart } from '@solidaris/contracts';
import { Badge } from 'primeng/badge';
import { Message } from 'primeng/message';
import {
  placeAnatomyCallouts,
  queryAnatomyPart,
  tokenPx,
  type AnatomyCallout,
} from './docs-anatomy';

export interface AnatomyLegendItem extends AnatomyPart {
  index: number;
}

const HIDDEN_PARTS_NOTE =
  'Extra elements may appear in other variants.';

@Component({
  selector: 'pds-docs-anatomy',
  imports: [Badge, Message],
  template: `
    <div class="c-docs-anatomy__body o-flex o-flex--y o-layout o-layout--gap-3">
      <div
        #stage
        class="c-docs-anatomy__stage o-flex o-flex--justify-content-center o-flex--align-items-center o-layout o-layout--padding-6 u-radius-xl"
      >
        <div #specimen class="c-docs-anatomy__specimen">
          <ng-content />
        </div>
        @if (hasSpecimen()) {
          <svg
            class="c-docs-anatomy__leaders o-layout o-layout--overflow-visible"
            [attr.viewBox]="'0 0 ' + stageSize().w + ' ' + stageSize().h"
            aria-hidden="true"
          >
            @for (spot of hotspots(); track spot.index) {
              <line
                class="c-docs-anatomy__leader"
                [attr.x1]="spot.lineX1"
                [attr.y1]="spot.lineY1"
                [attr.x2]="spot.lineX2"
                [attr.y2]="spot.lineY2"
              />
              <circle
                class="c-docs-anatomy__anchor"
                [attr.cx]="spot.lineX2"
                [attr.cy]="spot.lineY2"
                [attr.r]="anchorRadius()"
              />
            }
          </svg>
          <div class="c-docs-anatomy__overlay" aria-hidden="true">
            @for (spot of hotspots(); track spot.index) {
              <p-badge
                class="c-docs-anatomy__marker"
                [value]="spot.index"
                severity="secondary"
                [style.left.px]="spot.markerX"
                [style.top.px]="spot.markerY"
              />
            }
          </div>
        }
      </div>

      <ol
        class="c-docs-anatomy__legend o-flex o-flex--y o-layout o-layout--gap-1 o-layout--margin-0 o-layout--padding-0"
      >
        @for (item of legend(); track item.part + item.index) {
          <li
            class="c-docs-anatomy__legend-item o-flex o-flex--align-items-center o-layout o-layout--gap-1"
          >
            <p-badge
              class="c-docs-anatomy__index o-flex__item o-flex__item--shrink-0"
              [value]="item.index"
              severity="secondary"
            />
            <span class="c-docs-anatomy__label">{{ item.role }}</span>
          </li>
        }
      </ol>

      @if (hasHiddenParts()) {
        <p-message severity="secondary">{{ hiddenPartsNote }}</p-message>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-anatomy o-layout o-layout--block o-layout--margin-block-3',
  },
})
export class DocsAnatomyComponent {
  readonly parts = input<readonly AnatomyPart[]>([]);
  /** BEM block from metadata.component.bemBlock — resolves `__element` tokens. */
  readonly bemBlock = input('');

  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly specimen = viewChild<ElementRef<HTMLElement>>('specimen');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly hiddenPartsNote = HIDDEN_PARTS_NOTE;
  protected readonly hotspots = signal<AnatomyCallout[]>([]);
  protected readonly legend = signal<AnatomyLegendItem[]>([]);
  protected readonly hasSpecimen = signal(false);
  protected readonly hasHiddenParts = signal(false);
  protected readonly stageSize = signal({ w: 0, h: 0 });
  protected readonly anchorRadius = signal(3);

  constructor() {
    afterNextRender(() => {
      this.observe();
      this.measure();
    });

    effect(() => {
      this.parts();
      this.bemBlock();
      untracked(() => this.measure());
    });
  }

  private observe(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => this.measure());
    const stage = this.stage()?.nativeElement;
    const specimen = this.specimen()?.nativeElement;
    if (stage) {
      observer.observe(stage);
    }
    if (specimen) {
      observer.observe(specimen);
    }
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private measure(): void {
    const stage = this.stage()?.nativeElement;
    const specimen = this.specimen()?.nativeElement;
    const parts = this.parts();
    if (!specimen) {
      this.hasSpecimen.set(false);
      this.hotspots.set([]);
      this.legend.set([]);
      this.hasHiddenParts.set(parts.length > 0);
      this.stageSize.set({ w: 0, h: 0 });
      return;
    }

    const populated = specimen.childElementCount > 0;
    this.hasSpecimen.set(populated);
    if (!stage || !populated) {
      this.hotspots.set([]);
      this.legend.set([]);
      this.hasHiddenParts.set(parts.length > 0);
      this.stageSize.set({ w: 0, h: 0 });
      return;
    }

    const stageBox = stage.getBoundingClientRect();
    this.stageSize.set({ w: stageBox.width, h: stageBox.height });

    const bemBlock = this.bemBlock();
    const found: AnatomyLegendItem[] = [];
    const measured: Array<{ index: number; x: number; y: number; w: number; h: number }> =
      [];

    parts.forEach((part) => {
      const el = queryAnatomyPart(specimen, part.part, bemBlock);
      if (!el) {
        return;
      }
      const index = found.length + 1;
      found.push({ ...part, index });
      const box = el.getBoundingClientRect();
      measured.push({
        index,
        x: box.left - stageBox.left,
        y: box.top - stageBox.top,
        w: box.width,
        h: box.height,
      });
    });

    const markerRadius = tokenPx(stage, '--pds-size-docs-anatomy-marker', 24) / 2;
    const gutter = tokenPx(stage, '--pds-space-docs-anatomy-gutter', 32);
    const clearance = tokenPx(stage, '--pds-size-docs-anatomy-clearance', 28);
    const anchor = tokenPx(stage, '--pds-size-docs-anatomy-anchor', 6) / 2;
    this.anchorRadius.set(anchor);

    this.legend.set(found);
    this.hotspots.set(
      placeAnatomyCallouts(measured, { w: stageBox.width, h: stageBox.height }, {
        markerRadius,
        gutter,
        clearance,
        anchorRadius: anchor,
      }),
    );
    this.hasHiddenParts.set(found.length < parts.length);
  }
}
