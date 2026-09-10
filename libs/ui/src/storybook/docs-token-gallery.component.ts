// =============================================================================
// libs/ui/src/storybook/docs-token-gallery.component.ts
// Click-to-copy utility cards for Elevation / Borders catalogues.
// Chrome matches <pds-token-explorer> grid items (c-token-explorer__item).
// =============================================================================

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DocsDirectionComponent } from './docs-direction.component';
import type { DocsTokenCard } from './docs-token-cards';
import { copyStorybookText } from './storybook-toast';

@Component({
  selector: 'pds-docs-token-gallery',
  standalone: true,
  imports: [DocsDirectionComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="c-token-explorer o-layout--padding-4">
      <p
        class="c-token-explorer__value o-layout--margin-0 o-layout--margin-block-end-2"
      >
        {{ hint() }}
      </p>
      <ul
        class="c-token-explorer__grid o-flex o-flex--wrap o-layout--gap-2 o-layout--margin-0 o-layout--padding-0"
        role="list"
      >
        @for (card of resolvedCards(); track card.name) {
          <li
            class="c-token-explorer__item o-layout--relative o-flex o-flex--align-items-flex-start o-layout--gap-2 o-layout--min-w-0 o-layout--padding-2 u-border-all u-radius-md o-flex__item o-flex__item--12 o-flex__item--6@sm o-flex__item--4@md o-flex__item--3@lg"
            [style.--pds-border-color]="'var(--pds-color-panel-border)'"
            (click)="copy(card)"
          >
            @if (card.direction; as direction) {
              <pds-docs-direction
                class="c-token-explorer__preview o-flex__item--shrink-0"
                [kind]="direction.kind"
                [target]="direction.target"
              />
            } @else {
              <span
                [attr.class]="
                  'c-token-explorer__preview o-flex__item--shrink-0 ' +
                  (card.previewClass ?? '')
                "
                [attr.style]="card.previewStyle ?? null"
              ></span>
            }
            <div
              class="c-token-explorer__body o-layout--min-w-0 o-flex__item--grow-1"
            >
              <p class="c-token-explorer__name o-layout--margin-0">
                {{ card.name }}
              </p>
              @if (card.value) {
                <p class="c-token-explorer__value o-layout--margin-0">
                  {{ card.value }}
                </p>
              }
              @if (card.tag) {
                <p
                  class="c-token-explorer__tags o-flex o-flex--wrap o-layout--gap-0-5 o-layout--margin-0 o-layout--margin-block-start-1"
                >
                  <span
                    class="c-token-explorer__tag o-layout--padding-inline-0-5 u-radius-sm"
                    >{{ card.tag }}</span
                  >
                </p>
              }
            </div>
            <button
              type="button"
              class="c-token-explorer__copy o-layout--absolute o-layout--inline-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-0-5 u-border-all u-radius-sm"
              [attr.aria-label]="'Copy ' + (card.copyText ?? card.name)"
              (click)="copy(card); $event.stopPropagation()"
            >
              <i class="bi bi-clipboard" aria-hidden="true"></i>
            </button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class DocsTokenGalleryComponent {
  /** Precomputed cards — prefer `source` so the CSSOM is read after render. */
  readonly cards = input<readonly DocsTokenCard[]>([]);
  /** Called after the host is in the document, when stylesheets are readable. */
  readonly source = input<(() => readonly DocsTokenCard[]) | undefined>(
    undefined,
  );
  readonly hint = input('Click a card to copy the class.');

  private readonly ready = signal(false);

  readonly resolvedCards = computed(() => {
    this.ready();
    return this.source()?.() ?? this.cards();
  });

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  copy(card: DocsTokenCard): void {
    void copyStorybookText(card.copyText ?? card.name);
  }
}
