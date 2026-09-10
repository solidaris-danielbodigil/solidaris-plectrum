// =============================================================================
// libs/ui/src/foundations/elevation-playground.ts
// Helpers + in-page composer for Foundations / Elevation.
// The class list is read from the compiled stylesheet (rule 10-css-ssot).
// =============================================================================

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { readClassSuffixes } from '../storybook/cssom';
import type { DocsTokenCard } from '../storybook/docs-token-cards';
import { copyStorybookText } from '../storybook/storybook-toast';

/** Prose only — CSS cannot express intent. Unknown stops fall back gracefully. */
export const ELEVATION_USE_CASE: Record<string, string> = {
  none: 'Remove elevation',
  sm: 'Subtle card chrome',
  md: 'Raised panels, dropdowns',
  xl: 'Prominent elevation (drawers)',
  'overlay-modal': 'Modal dialogs',
  'overlay-select': 'Select / autocomplete panels',
  'overlay-popover': 'Popovers, tooltips',
  'overlay-navigation': 'Navigation overlays',
};

export const elevationStops = (): string[] =>
  readClassSuffixes(/^u-shadow-(.+)$/);

export function elevationCards(levels: readonly string[]): DocsTokenCard[] {
  return levels.map((stop) => ({
    name: `u-shadow-${stop}`,
    value: ELEVATION_USE_CASE[stop] ?? 'See Foundations / Shadows',
    tag: `var(--pds-shadow-${stop})`,
    previewClass: 'c-token-explorer__preview--shadow',
    previewStyle: `--pds-token-explorer-shadow: var(--pds-shadow-${stop})`,
  }));
}

function pretty(suffix: string): string {
  return suffix
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

@Component({
  selector: 'pds-elevation-playground',
  standalone: true,
  imports: [FormsModule, FormFieldComponent, ToolbarComponent, Select],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="c-token-explorer o-layout--padding-inline-4 o-layout--padding-block-start-4 o-layout--padding-block-end-6"
    >
      <pds-toolbar [sticky]="true">
        <ng-container slot="start">
          <pds-form-field
            class="c-token-explorer__compose-field o-flex__item--grow-0"
            label="Level"
            hint="Pick by the role of the surface, not how strong the shadow looks."
            inputId="pds-elevation-level"
          >
            @if (levelOptions().length) {
              <p-select
                class="c-token-explorer__filter"
                inputId="pds-elevation-level"
                [options]="levelOptions()"
                optionLabel="label"
                optionValue="value"
                [ngModel]="level()"
                (ngModelChange)="level.set($event)"
                appendTo="body"
              />
            }
          </pds-form-field>
        </ng-container>
      </pds-toolbar>

      <section
        class="c-token-explorer__playground o-flex o-flex--col o-layout--gap-3 o-layout--margin-block-start-4 o-layout--padding-3 u-border-all u-radius-md"
        [style.--pds-border-color]="'var(--pds-color-panel-border)'"
      >
        <p class="c-token-explorer__playground-label o-layout--margin-0">
          Result
        </p>
        <div
          [attr.class]="
            'o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-6 u-radius-md u-shadow-' +
            level()
          "
          [style.background]="'var(--pds-color-surface-0)'"
        >
          {{ useCase() }}
        </div>
        <div class="o-flex o-flex--col o-layout--gap-1">
          <div class="o-flex o-flex--align-items-center o-layout--gap-2">
            <code class="o-flex__item--grow-1 o-layout--min-w-0">{{
              className()
            }}</code>
            <button
              type="button"
              class="c-token-explorer__copy-btn o-layout--inline-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-0-5 u-border-all u-radius-sm"
              [style.--pds-border-color]="'var(--pds-color-panel-border)'"
              [attr.aria-label]="'Copy ' + className()"
              (click)="copy(className())"
            >
              <i class="bi bi-clipboard" aria-hidden="true"></i>
            </button>
          </div>
          <div class="o-flex o-flex--align-items-center o-layout--gap-2">
            <code class="o-flex__item--grow-1 o-layout--min-w-0">{{
              tokenVar()
            }}</code>
            <button
              type="button"
              class="c-token-explorer__copy-btn o-layout--inline-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-0-5 u-border-all u-radius-sm"
              [style.--pds-border-color]="'var(--pds-color-panel-border)'"
              [attr.aria-label]="'Copy ' + tokenVar()"
              (click)="copy(tokenVar())"
            >
              <i class="bi bi-clipboard" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ElevationPlaygroundComponent {
  private readonly ready = signal(false);

  readonly levelOptions = computed(() => {
    this.ready();
    return elevationStops().map((value) => ({
      label: pretty(value),
      value,
    }));
  });

  readonly level = linkedSignal(() => {
    const stops = this.levelOptions().map((option) => option.value);
    return stops.includes('md') ? 'md' : (stops[0] ?? 'md');
  });

  readonly className = computed(() => `u-shadow-${this.level()}`);
  readonly tokenVar = computed(() => `var(--pds-shadow-${this.level()})`);
  readonly useCase = computed(
    () => ELEVATION_USE_CASE[this.level()] ?? 'See Foundations / Shadows',
  );

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  copy(text: string): void {
    void copyStorybookText(text);
  }
}
