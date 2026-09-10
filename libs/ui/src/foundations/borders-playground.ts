// =============================================================================
// libs/ui/src/foundations/borders-playground.ts
// Helpers + in-page composer for Foundations / Borders.
// Class lists come from the compiled stylesheet (rule 10-css-ssot).
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
import { SelectButton } from 'primeng/selectbutton';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { readClassRules, readClassSuffixes } from '../storybook/cssom';
import { DocsDirectionComponent } from '../storybook/docs-direction.component';
import type { DocsTokenCard } from '../storybook/docs-token-cards';
import { copyStorybookText } from '../storybook/storybook-toast';

/** Longest stop first so `top-2xl` resolves to `2xl`, not `xl`. */
const RADIUS_STOPS = [
  '2xl',
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'pill',
] as const;

export function radiusVar(suffix: string): string {
  const stop = RADIUS_STOPS.find(
    (item) => suffix === item || suffix.endsWith(`-${item}`),
  );
  return `var(--pds-radius-${stop ?? suffix})`;
}

/** All-corner stops: a single segment after the prefix (`md`, `2xl`, `pill`). */
export const allCornerRadii = (): string[] =>
  readClassSuffixes(/^u-radius-([a-z0-9]+)$/);

/** Per-edge and per-corner targets: everything else. */
export const radiusTargets = (): string[] =>
  readClassSuffixes(/^u-radius-([a-z0-9]+(?:-[a-z0-9]+)+)$/);

export interface BorderGroups {
  sides: string[];
  modifiers: string[];
  statuses: string[];
}

/**
 * Split `u-border-*` by what each rule sets:
 *   side     → a `border*` longhand
 *   status   → only `--pds-border-color`
 *   modifier → only `--pds-border-width` / `--pds-border-style`
 */
export function borderGroups(): BorderGroups {
  const groups: BorderGroups = { sides: [], modifiers: [], statuses: [] };

  for (const rule of readClassRules(/^u-border-(.+)$/)) {
    const setsBorder = rule.properties.some((prop) =>
      /^border($|-)/.test(prop),
    );
    const setsColor = rule.properties.includes('--pds-border-color');

    if (setsBorder) groups.sides.push(rule.suffix);
    else if (setsColor) groups.statuses.push(rule.suffix);
    else groups.modifiers.push(rule.suffix);
  }

  return groups;
}

export interface BorderComposeInput {
  side: string;
  status: string;
  thick: boolean;
  dashed: boolean;
  radius: string;
  radiusTarget?: string;
}

/** `md` → all corners; `top-md` → `top`; `top-start-xl` → `top-start`. */
export function radiusTargetFromSuffix(suffix: string): string {
  const stop = RADIUS_STOPS.find(
    (item) => suffix === item || suffix.endsWith(`-${item}`),
  );
  if (!stop) return suffix;
  return suffix === stop ? 'all' : suffix.slice(0, -(stop.length + 1));
}

/** Unique radius targets from the stylesheet (`all`, `top`, `top-start`, …). */
export function radiusTargetKeys(): string[] {
  const keys = new Set<string>();
  for (const suffix of readClassSuffixes(/^u-radius-(.+)$/)) {
    keys.add(radiusTargetFromSuffix(suffix));
  }
  return [...keys].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return a.localeCompare(b);
  });
}

export function radiusClass(target: string, stop: string): string {
  if (stop === 'none') return '';
  return target === 'all' ? `u-radius-${stop}` : `u-radius-${target}-${stop}`;
}

export function radiusCards(stops: readonly string[]): DocsTokenCard[] {
  return stops.map((stop) => {
    const target = radiusTargetFromSuffix(stop);
    return {
      name: `u-radius-${stop}`,
      tag: radiusVar(stop),
      previewClass:
        target === 'all'
          ? `c-token-explorer__preview--shape u-radius-${stop}`
          : undefined,
      direction:
        target === 'all' ? undefined : { kind: 'radius' as const, target },
    };
  });
}

export function borderSideCards(): DocsTokenCard[] {
  return borderGroups().sides.map((side) => ({
    name: `u-border-${side}`,
    direction: { kind: 'border', target: side },
  }));
}

export function borderStatusCards(): DocsTokenCard[] {
  return borderGroups().statuses.map((status) => ({
    name: `u-border-${status}`,
    tag: `var(--pds-color-${status})`,
    previewClass: `c-token-explorer__preview--box u-border-all u-border-${status}`,
  }));
}

export function composeBorderClasses(input: BorderComposeInput): string {
  return [
    `u-border-${input.side}`,
    input.status !== 'default' ? `u-border-${input.status}` : '',
    input.thick ? 'u-border-thick' : '',
    input.dashed ? 'u-border-dashed' : '',
    radiusClass(input.radiusTarget ?? 'all', input.radius),
  ]
    .filter(Boolean)
    .join(' ');
}

function pretty(suffix: string): string {
  return suffix
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

type SelectOption = { label: string; value: string };

function selectOptions(values: readonly string[]): SelectOption[] {
  return values.map((value) => ({ label: pretty(value), value }));
}

@Component({
  selector: 'pds-borders-playground',
  standalone: true,
  imports: [
    FormsModule,
    FormFieldComponent,
    ToolbarComponent,
    DocsDirectionComponent,
    Select,
    SelectButton,
  ],
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
            label="Side"
            hint="Which edges get the stroke — u-border-{side}."
            inputId="pds-borders-side"
          >
            @if (sideOptions().length) {
              <p-select
                class="c-token-explorer__filter"
                inputId="pds-borders-side"
                [options]="sideOptions()"
                optionLabel="label"
                optionValue="value"
                [ngModel]="side()"
                (ngModelChange)="side.set($event)"
                appendTo="body"
              >
                <ng-template #selectedItem let-option>
                  <span
                    class="o-flex o-flex--align-items-center o-layout--gap-2"
                  >
                    <pds-docs-direction
                      class="o-flex__item--shrink-0"
                      kind="border"
                      [target]="asOption(option).value"
                    />
                    <span>{{ asOption(option).label }}</span>
                  </span>
                </ng-template>
                <ng-template #item let-option>
                  <span
                    class="o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout--gap-2"
                  >
                    <span>{{ asOption(option).label }}</span>
                    <pds-docs-direction
                      class="o-flex__item--shrink-0"
                      kind="border"
                      [target]="asOption(option).value"
                    />
                  </span>
                </ng-template>
              </p-select>
            }
          </pds-form-field>

          <pds-form-field
            class="c-token-explorer__compose-field o-flex__item--grow-0"
            label="Status"
            hint="Optional colour. Default keeps content-border."
          >
            <p-selectButton
              [options]="statusOptions()"
              optionLabel="label"
              optionValue="value"
              [ngModel]="status()"
              (ngModelChange)="status.set($event)"
              [allowEmpty]="false"
              aria-label="Status"
            />
          </pds-form-field>

          <pds-form-field
            class="c-token-explorer__compose-field o-flex__item--grow-0"
            label="Weight"
            hint="Thick sets --pds-border-width."
          >
            <p-selectButton
              [options]="weightOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="weight()"
              (ngModelChange)="weight.set($event)"
              [allowEmpty]="false"
              aria-label="Weight"
            />
          </pds-form-field>

          <pds-form-field
            class="c-token-explorer__compose-field o-flex__item--grow-0"
            label="Style"
            hint="Dashed sets --pds-border-style."
          >
            <p-selectButton
              [options]="styleOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="stroke()"
              (ngModelChange)="stroke.set($event)"
              [allowEmpty]="false"
              aria-label="Style"
            />
          </pds-form-field>

          <pds-form-field
            class="c-token-explorer__compose-field o-flex__item--grow-0"
            label="Radius"
            hint="Optional u-radius-{stop} on the same element."
            inputId="pds-borders-radius"
          >
            @if (radiusOptions().length) {
              <p-select
                class="c-token-explorer__filter"
                inputId="pds-borders-radius"
                [options]="radiusOptions()"
                optionLabel="label"
                optionValue="value"
                [ngModel]="radius()"
                (ngModelChange)="radius.set($event)"
                appendTo="body"
              >
                <ng-template #selectedItem let-option>
                  <span
                    class="o-flex o-flex--align-items-center o-layout--gap-2"
                  >
                    <span
                      [attr.class]="
                        'c-token-explorer__swatch o-flex__item--shrink-0 u-radius-' +
                        asOption(option).value
                      "
                      aria-hidden="true"
                    ></span>
                    <span>{{ asOption(option).label }}</span>
                  </span>
                </ng-template>
                <ng-template #item let-option>
                  <span
                    class="o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout--gap-2"
                  >
                    <span>{{ asOption(option).label }}</span>
                    <span
                      [attr.class]="
                        'c-token-explorer__swatch o-flex__item--shrink-0 u-radius-' +
                        asOption(option).value
                      "
                      aria-hidden="true"
                    ></span>
                  </span>
                </ng-template>
              </p-select>
            }
          </pds-form-field>

          <pds-form-field
            class="c-token-explorer__compose-field o-flex__item--grow-0"
            label="Corners"
            hint="Which corners get the radius — pick a radius stop first."
            inputId="pds-borders-corners"
          >
            @if (cornerOptions().length) {
              <p-select
                class="c-token-explorer__filter"
                inputId="pds-borders-corners"
                [options]="cornerOptions()"
                optionLabel="label"
                optionValue="value"
                [ngModel]="radiusTarget()"
                (ngModelChange)="radiusTarget.set($event)"
                [disabled]="cornersDisabled()"
                appendTo="body"
              >
                <ng-template #selectedItem let-option>
                  <span
                    class="o-flex o-flex--align-items-center o-layout--gap-2"
                  >
                    <pds-docs-direction
                      class="o-flex__item--shrink-0"
                      kind="radius"
                      [target]="asOption(option).value"
                    />
                    <span>{{ asOption(option).label }}</span>
                  </span>
                </ng-template>
                <ng-template #item let-option>
                  <span
                    class="o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout--gap-2"
                  >
                    <span>{{ asOption(option).label }}</span>
                    <pds-docs-direction
                      class="o-flex__item--shrink-0"
                      kind="radius"
                      [target]="asOption(option).value"
                    />
                  </span>
                </ng-template>
              </p-select>
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
            'o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-6 ' +
            classes()
          "
          [style.background]="'var(--pds-color-surface-0)'"
        >
          preview
        </div>
        <div class="o-flex o-flex--align-items-center o-layout--gap-2">
          <code class="o-flex__item--grow-1 o-layout--min-w-0"
            >class="{{ classes() }}"</code
          >
          <button
            type="button"
            class="c-token-explorer__copy-btn o-layout--inline-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-0-5 u-border-all u-radius-sm"
            [style.--pds-border-color]="'var(--pds-color-panel-border)'"
            [attr.aria-label]="'Copy ' + classes()"
            (click)="copy()"
          >
            <i class="bi bi-clipboard" aria-hidden="true"></i>
          </button>
        </div>
      </section>
    </div>
  `,
})
export class BordersPlaygroundComponent {
  private readonly ready = signal(false);

  readonly sideOptions = computed(() => {
    this.ready();
    return selectOptions(borderGroups().sides);
  });
  readonly statusOptions = computed(() => {
    this.ready();
    return [
      { label: 'Default', value: 'default' },
      ...selectOptions(borderGroups().statuses),
    ];
  });
  readonly weightOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Thick', value: 'thick' },
  ];
  readonly styleOptions = [
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
  ];
  readonly radiusOptions = computed(() => {
    this.ready();
    return selectOptions([...new Set(['none', ...allCornerRadii()])]);
  });
  readonly cornerOptions = computed(() => {
    this.ready();
    return selectOptions(radiusTargetKeys());
  });

  readonly side = linkedSignal(() => this.sideOptions()[0]?.value ?? 'all');
  readonly status = signal('default');
  readonly weight = signal('default');
  readonly stroke = signal('solid');
  readonly radiusTarget = linkedSignal(
    () => this.cornerOptions()[0]?.value ?? 'all',
  );
  readonly radius = signal('none');
  readonly cornersDisabled = computed(() => this.radius() === 'none');

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  readonly classes = computed(() =>
    composeBorderClasses({
      side: this.side(),
      status: this.status(),
      thick: this.weight() === 'thick',
      dashed: this.stroke() === 'dashed',
      radius: this.radius(),
      radiusTarget: this.radiusTarget(),
    }),
  );

  asOption(item: string | SelectOption | null | undefined): SelectOption {
    if (item && typeof item === 'object') return item;
    const value = String(item ?? '');
    return { label: pretty(value), value };
  }

  copy(): void {
    void copyStorybookText(this.classes());
  }
}
