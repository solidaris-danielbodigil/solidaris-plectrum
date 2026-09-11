// =============================================================================
// libs/ui/src/storybook/contrast-checker.component.ts
// Foundations / Colors — WCAG 2.1 contrast checker for text/surface pairs.
//
// Token lists come from the CSSOM (.ai/rules/10-css-ssot.md); resolved colours
// are measured off a rendered probe so any authored format (hex, rgb, var
// chains through the PrimeNG preset) normalises to rgb(). Thresholds are the
// WCAG 2.1 AA / AAA numbers from .ai/rules/06-accessibility.md.
//
// PrimeNG: p-select (role pickers), p-tag (pass/fail badges).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { CopyableTextComponent } from '../lib/copyable-text/copyable-text.component';
import { readTokenDeclarations } from './cssom';
import { showStorybookToast } from './storybook-toast';
import { COLOR_PRIMITIVE_GROUPS } from './token-sections';
import { classifyToken } from './token-taxonomy';

const SURFACE_GROUPS = [
  'surface',
  'primary',
  'content',
  'highlight',
  'form',
  'navigation',
  'overlay',
  'list',
];
const TEXT_GROUPS = ['text', 'primary', 'content'];

export function semanticColorVars(groups: readonly string[]): string[] {
  return [...readTokenDeclarations().values()]
    .filter((decl) => {
      const taxon = classifyToken(decl.name);
      return (
        taxon.category === 'color' &&
        groups.includes(taxon.group) &&
        !(COLOR_PRIMITIVE_GROUPS as readonly string[]).includes(taxon.group)
      );
    })
    .map((decl) => decl.cssVar)
    .sort();
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseRgb(value: string): Rgb | null {
  const rgb = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(value);
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] };

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!hex) return null;
  let digits = hex[1];
  if (digits.length === 3) digits = [...digits].map((d) => d + d).join('');
  return {
    r: parseInt(digits.slice(0, 2), 16),
    g: parseInt(digits.slice(2, 4), 16),
    b: parseInt(digits.slice(4, 6), 16),
  };
}

/** WCAG 2.1 relative luminance. */
function luminance({ r, g, b }: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Paint the token on a probe and read the normalised rgb() back. */
export function measureTokenColor(cssVar: string, host: ParentNode): string {
  if (typeof document === 'undefined') return '';
  const probe = document.createElement('span');
  probe.style.color = `var(${cssVar})`;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

export interface ContrastResult {
  ratio: number | null;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
}

/** WCAG 2.1 contrast for two resolved rgb()/hex colours. */
export function contrastFromResolved(background: string, text: string): ContrastResult {
  const bg = parseRgb(background);
  const fg = parseRgb(text);
  if (!bg || !fg) {
    return { ratio: null, aa: false, aaLarge: false, aaa: false };
  }
  const [lighter, darker] = [luminance(bg), luminance(fg)].sort((a, b) => b - a);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
  };
}

export function contrastRatioLabel(ratio: number | null): string {
  return ratio === null ? 'Contrast: —' : `Contrast ${ratio.toFixed(2)} : 1`;
}

@Component({
  selector: 'pds-contrast-checker',
  standalone: true,
  imports: [FormsModule, Select, Tag, CopyableTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="o-flex o-flex--col o-layout--gap-3 o-layout--padding-3">
      <p class="o-layout--margin-0">
        Results are for text size, not a whole-component certification.
      </p>
      <div class="o-flex o-flex--wrap o-layout--gap-2">
        <p-select
          [options]="surfaceOptions"
          [filter]="true"
          [ngModel]="background()"
          (ngModelChange)="background.set($event)"
          aria-label="Surface token"
          styleClass="o-layout--min-w-0"
        />
        <p-select
          [options]="textOptions"
          [filter]="true"
          [ngModel]="text()"
          (ngModelChange)="text.set($event)"
          aria-label="Text token"
          styleClass="o-layout--min-w-0"
        />
      </div>

      <div
        class="u-radius-md u-border-all o-layout--padding-4"
        [style.background]="'var(' + background() + ')'"
        [style.color]="'var(' + text() + ')'"
        style="max-width: 32rem;"
      >
        <strong>Sample heading</strong>
        <p class="o-layout--margin-0">Body copy rendered with the selected pair.</p>
      </div>

      <div class="o-flex o-flex--align-items-center o-flex--wrap o-layout--gap-2">
        <strong>{{ ratioLabel() }}</strong>
        <p-tag
          [value]="'AA normal text ≥ 4.5 — ' + (passes().aa ? 'pass' : 'fail')"
          [severity]="passes().aa ? 'success' : 'danger'"
        />
        <p-tag
          [value]="'AA large text ≥ 3 — ' + (passes().aaLarge ? 'pass' : 'fail')"
          [severity]="passes().aaLarge ? 'success' : 'danger'"
        />
        <p-tag
          [value]="'AAA normal text ≥ 7 — ' + (passes().aaa ? 'pass' : 'fail')"
          [severity]="passes().aaa ? 'success' : 'secondary'"
        />
      </div>

      <div class="o-flex o-flex--col o-layout--gap-2">
        <pds-copyable-text
          label="Background"
          [value]="'var(' + background() + ')'"
          ariaLabel="Copy background variable"
          (copied)="onCopied($event)"
        />
        <pds-copyable-text
          label="Text"
          [value]="'var(' + text() + ')'"
          ariaLabel="Copy text variable"
          (copied)="onCopied($event)"
        />
        <p class="o-layout--margin-0 u-text-body-sm">
          {{ background() }} — {{ resolvedBackground() }}
        </p>
        <p class="o-layout--margin-0 u-text-body-sm">
          {{ text() }} — {{ resolvedText() }}
        </p>
      </div>
    </div>
  `,
})
export class ContrastCheckerComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly surfaceOptions = semanticColorVars(SURFACE_GROUPS);
  readonly textOptions = semanticColorVars(TEXT_GROUPS);

  readonly background = signal('--pds-color-surface-0');
  readonly text = signal('--pds-color-text');

  readonly resolvedBackground = computed(() =>
    measureTokenColor(this.background(), this.host.nativeElement),
  );
  readonly resolvedText = computed(() =>
    measureTokenColor(this.text(), this.host.nativeElement),
  );

  readonly contrast = computed(() =>
    contrastFromResolved(this.resolvedBackground(), this.resolvedText()),
  );

  readonly ratioLabel = computed(() => contrastRatioLabel(this.contrast().ratio));

  readonly passes = computed(() => this.contrast());

  onCopied(text: string): void {
    showStorybookToast({ summary: 'Copied', detail: text });
  }
}
