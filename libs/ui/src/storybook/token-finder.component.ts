// =============================================================================
// libs/ui/src/storybook/token-finder.component.ts
// Foundations / Token finder — intent-based guidance for picking a token.
//
// The stylesheet stays the source of truth: the embedded <pds-token-explorer>
// enumerates every matching token from the CSSOM (.ai/rules/10-css-ssot.md).
// This component only authors what CSS cannot express — which family serves
// which intent, and the snippet shape to write.
//
// PrimeNG: p-select (intent — 10 options, over the SelectButton max of 5).
// Guidance sits on pds-form-field as helper text.
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { TokenExplorerComponent } from './token-explorer.component';
import type { TokenExplorerBundle } from './token-explorer.component';
import type { TokenCategory } from './token-taxonomy';

interface TokenIntent {
  key: string;
  label: string;
  category: TokenCategory;
  groups: readonly string[];
  bundle: TokenExplorerBundle;
  hint: string;
  snippets: readonly string[];
}

/** Authored intent map — guidance only; the token lists below it are live. */
const INTENTS: readonly TokenIntent[] = [
  {
    key: 'text-color',
    label: 'Text colour',
    category: 'color',
    groups: ['text'],
    bundle: null,
    hint: 'Use a text role, never a hue step. Roles follow the surface they sit on.',
    snippets: [
      'color: var(--pds-color-text);',
      'color: var(--pds-color-text-muted);',
    ],
  },
  {
    key: 'type-style',
    label: 'Text style',
    category: 'typography',
    groups: [],
    bundle: 'type-role',
    hint: 'In templates use the u-text-{role}-{size} class; in component SCSS use the per-property --pds-text-* tokens. Never hardcode font-size or family.',
    snippets: [
      'class="u-text-body-md"',
      'font-size: var(--pds-text-body-md-size);',
    ],
  },
  {
    key: 'surface',
    label: 'Surface / background',
    category: 'color',
    groups: ['surface', 'primary', 'content', 'highlight'],
    bundle: null,
    hint: 'Backgrounds come from surface and content roles. primary steps are for brand-tinted chrome, not page backgrounds.',
    snippets: ['background: var(--pds-color-surface-0);'],
  },
  {
    key: 'border',
    label: 'Border',
    category: 'color',
    groups: ['surface', 'content', 'form'],
    bundle: null,
    hint: 'Static borders are u-border-* classes in the template; the colour comes from a shared role (panel-border, card-border, content-border) — never a feature-specific alias. Compose one on Foundations / Borders → Generate.',
    snippets: [
      'class="u-border-bottom"',
      '--pds-border-color: var(--pds-color-panel-border);',
    ],
  },
  {
    key: 'spacing',
    label: 'Spacing',
    category: 'spacing',
    groups: [],
    bundle: null,
    hint: 'Gap, padding and margin on the global scale are o-layout--* classes in the template. var(--pds-spacing-*) in SCSS is only for component tokens off the global scale.',
    snippets: ['class="o-layout--gap-2"', 'gap: var(--pds-spacing-2);'],
  },
  {
    key: 'radius',
    label: 'Radius',
    category: 'radius',
    groups: [],
    bundle: null,
    hint: 'Static radii are u-radius-{stop} classes in the template; state-driven or calculated radii use var(--pds-radius-*) in SCSS.',
    snippets: ['class="u-radius-md"', 'border-radius: var(--pds-radius-md);'],
  },
  {
    key: 'elevation',
    label: 'Elevation',
    category: 'shadow',
    groups: [],
    bundle: null,
    hint: 'Pick by the role of the surface: resting cards use u-shadow-*, overlays use the overlay-* tokens. Never compose box-shadow offsets by hand in 06-components.',
    snippets: [
      'class="u-shadow-md"',
      'box-shadow: var(--pds-shadow-overlay-modal);',
    ],
  },
  {
    key: 'motion',
    label: 'Motion',
    category: 'motion',
    groups: [],
    bundle: null,
    hint: 'Durations and easings are tokens; the animated property list stays in the component SCSS.',
    snippets: ['transition: border-color var(--pds-transition-duration);'],
  },
  {
    key: 'focus',
    label: 'Focus ring',
    category: 'focus',
    groups: [],
    bundle: null,
    hint: 'Focus styles are never hand-built — use the ring tokens on :focus-visible.',
    snippets: [
      'outline: var(--pds-focus-ring-width) var(--pds-focus-ring-style) var(--pds-focus-ring-color);',
      'outline-offset: var(--pds-focus-ring-offset);',
    ],
  },
  {
    key: 'icon',
    label: 'Icon size',
    category: 'icon',
    groups: [],
    bundle: null,
    hint: 'Render icons with <pds-icon>; sizes map to the --pds-icon-size tokens.',
    snippets: ['<pds-icon name="bi-check-lg" size="md" />'],
  },
];

@Component({
  selector: 'pds-token-finder',
  standalone: true,
  imports: [FormsModule, FormFieldComponent, Select, TokenExplorerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="o-flex o-flex--col o-layout--gap-3 o-layout--padding-3">
      <pds-form-field
        class="o-flex__item--align-self-flex-start"
        label="What are you styling?"
        [hint]="intent().hint"
        inputId="pds-token-finder-intent"
      >
        <p-select
          class="c-token-finder__intent"
          inputId="pds-token-finder-intent"
          [options]="intentOptions"
          optionLabel="label"
          optionValue="key"
          [ngModel]="intentKey()"
          (ngModelChange)="intentKey.set($event)"
          [filter]="true"
          filterBy="label"
          placeholder="What are you styling?"
        />
      </pds-form-field>

      <div class="o-flex o-flex--col o-layout--gap-1">
        @for (snippet of intent().snippets; track snippet) {
          <code>{{ snippet }}</code>
        }
      </div>
    </div>

    <pds-token-explorer
      [category]="intent().category"
      [groups]="intent().groups"
      [bundle]="intent().bundle"
    />
  `,
})
export class TokenFinderComponent {
  readonly intentOptions = INTENTS.map(({ key, label }) => ({ key, label }));
  readonly intentKey = signal<string>(INTENTS[0].key);

  readonly intent = computed<TokenIntent>(
    () => INTENTS.find(({ key }) => key === this.intentKey()) ?? INTENTS[0],
  );
}
