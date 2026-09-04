// =============================================================================
// libs/ui/src/foundations/token-contracts.stories.ts
// Checks each component's `.metadata.ts` tokens.consumed list against the
// tokens the stylesheet actually declares.
//
// The CSSOM is the source of truth (.ai/rules/10-css-ssot.md), so a metadata
// entry naming a token that no longer exists shows up as a broken contract
// rather than passing silently.
//
// Reuses the token explorer chrome (c-token-explorer*) for search and copy.
// =============================================================================

import { afterNextRender, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Badge } from 'primeng/badge';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { showStorybookToast } from '../storybook/storybook-toast';
import { AffiliateDetailDrawerMetadata } from '../lib/affiliate-detail-drawer/affiliate-detail-drawer.metadata';
import { AffiliateOverviewCardMetadata } from '../lib/affiliate-overview-card/affiliate-overview-card.metadata';
import { CopyableTextMetadata } from '../lib/copyable-text/copyable-text.metadata';
import { EmptyStateMetadata } from '../lib/empty-state/empty-state.metadata';
import { FormFieldMetadata } from '../lib/form-field/form-field.metadata';
import { IconMetadata } from '../lib/icon/icon.metadata';
import { InputClearComponent } from '../lib/input-clear';
import { InputClearMetadata } from '../lib/input-clear/input-clear.metadata';
import { ListMetadata } from '../lib/list/list.metadata';
import { NavShellMetadata } from '../lib/nav-shell/nav-shell.metadata';
import { PlectrumAvatarMetadata } from '../lib/plectrum-avatar/plectrum-avatar.metadata';
import { SubNavShellMetadata } from '../lib/sub-nav-shell/sub-nav-shell.metadata';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { TopNavMetadata } from '../lib/top-nav/top-nav.metadata';
import { readTokenDeclarations } from '../storybook/cssom';
import { TOKEN_ANNOTATIONS } from '../storybook/tokens.generated';

const METADATA = [
  AffiliateDetailDrawerMetadata,
  AffiliateOverviewCardMetadata,
  CopyableTextMetadata,
  EmptyStateMetadata,
  FormFieldMetadata,
  IconMetadata,
  InputClearMetadata,
  ListMetadata,
  NavShellMetadata,
  PlectrumAvatarMetadata,
  SubNavShellMetadata,
  TopNavMetadata,
];

const FROM_FIGMA = new Set(TOKEN_ANNOTATIONS.map((annotation) => annotation.cssVar));

const CONTRACTS = METADATA.flatMap((meta) =>
  (meta.tokens?.consumed ?? []).map((cssVar) => ({
    component: meta.component.name,
    cssVar,
    haystack: `${meta.component.name} ${cssVar}`.toLowerCase(),
  })),
);

@Component({
  standalone: true,
  selector: 'pds-token-contracts-page',
  imports: [
    ToolbarComponent,
    IconField,
    InputIcon,
    InputText,
    InputClearComponent,
    Badge,
  ],
  template: `
    <div
      class="c-token-explorer o-layout--padding-inline-4 o-layout--padding-block-end-6"
    >
      <pds-toolbar [sticky]="true">
        <ng-container slot="start">
          <p-iconField class="c-token-explorer__search">
            <p-inputIcon styleClass="bi bi-search" />
            <input
              pInputText
              type="text"
              role="searchbox"
              autocomplete="off"
              placeholder="Search component or token…"
              aria-label="Search token contracts"
              class="c-token-explorer__search-input"
              [value]="search()"
              (input)="search.set($any($event.target).value)"
            />
            <p-inputicon>
              <pds-input-clear
                [visible]="!!search()"
                ariaLabel="Clear search"
                (clear)="search.set('')"
              />
            </p-inputicon>
          </p-iconField>
        </ng-container>
        <ng-container slot="end">
          <p-badge
            [severity]="brokenCount() ? 'danger' : 'secondary'"
            aria-live="polite"
            [value]="
              brokenCount()
                ? brokenCount() + ' broken of ' + total
                : rows().length + ' / ' + total + ' contracts'
            "
          />
        </ng-container>
      </pds-toolbar>

      <section class="c-token-explorer__section">
        <table class="c-token-explorer__table">
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Consumed token</th>
              <th scope="col">Declared in CSS</th>
              <th scope="col"><span class="u-sr-only">Copy</span></th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.component + row.cssVar) {
              <tr [class.is-warning]="!row.declared">
                <th scope="row">{{ row.component }}</th>
                <td><code>{{ row.cssVar }}</code></td>
                <td>{{ row.origin }}</td>
                <td>
                  <button
                    type="button"
                    class="c-token-explorer__copy-btn"
                    [attr.aria-label]="'Copy var(' + row.cssVar + ')'"
                    (click)="copy(row.cssVar)"
                  >
                    <i class="bi bi-clipboard" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (rows().length === 0) {
          <p class="c-token-explorer__empty">No contract matches “{{ search() }}”.</p>
        }
      </section>
    </div>
  `,
})
class TokenContractsPageComponent {
  private readonly rendered = signal(false);

  readonly total = CONTRACTS.length;
  readonly search = signal('');

  constructor() {
    afterNextRender(() => this.rendered.set(true));
  }

  private readonly checked = computed(() => {
    this.rendered();
    const declared = readTokenDeclarations();
    return CONTRACTS.map((contract) => {
      const exists = declared.has(contract.cssVar);
      return {
        ...contract,
        declared: exists,
        origin: !exists
          ? 'not declared'
          : FROM_FIGMA.has(contract.cssVar)
            ? 'Figma'
            : 'code-owned',
      };
    });
  });

  readonly brokenCount = computed(
    () => this.checked().filter((row) => !row.declared).length,
  );

  readonly rows = computed(() => {
    const query = this.search().trim().toLowerCase();
    const checked = this.checked();
    return query ? checked.filter((row) => row.haystack.includes(query)) : checked;
  });

  copy(cssVar: string): void {
    const text = `var(${cssVar})`;
    void navigator.clipboard.writeText(text).then(() =>
      showStorybookToast({
        summary: 'Copied',
        detail: text,
      }),
    );
  }
}

const meta: Meta<TokenContractsPageComponent> = {
  title: 'Foundations/Token contracts',
  component: TokenContractsPageComponent,
  tags: ['!dev'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenContractsPageComponent>;

export const Consumed: Story = {};
