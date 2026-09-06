// =============================================================================
// libs/ui/src/foundations/token-contracts.stories.ts
// Checks each component's `.metadata.ts` tokens.consumed list against the
// tokens the stylesheet actually declares.
//
// The CSSOM is the source of truth (.ai/rules/10-css-ssot.md), so a metadata
// entry naming a token that no longer exists shows up as a broken contract
// rather than passing silently.
//
// PrimeNG: p-table row expansion (one collapsed row per component), p-tag
// (token count + origin). Search and copy reuse token-explorer chrome.
// =============================================================================

import { afterNextRender, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
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

const FROM_FIGMA = new Set(
  TOKEN_ANNOTATIONS.map((annotation) => annotation.cssVar),
);

const CONTRACTS = METADATA.flatMap((meta) =>
  (meta.tokens?.consumed ?? []).map((cssVar) => ({
    component: meta.component.name,
    cssVar,
    haystack: `${meta.component.name} ${cssVar}`.toLowerCase(),
  })),
);

type ContractOrigin = 'not declared' | 'Figma' | 'code-owned';

interface TokenContract {
  component: string;
  cssVar: string;
  haystack: string;
  declared: boolean;
  origin: ContractOrigin;
}

interface TokenContractGroup {
  component: string;
  tokens: TokenContract[];
  count: number;
  broken: boolean;
}

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
    Button,
    TableModule,
    Tag,
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
              (input)="onSearch($any($event.target).value)"
            />
            <p-inputicon>
              <pds-input-clear
                [visible]="!!search()"
                ariaLabel="Clear search"
                (clear)="onSearch('')"
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
                : matchCount() + ' / ' + total + ' contracts'
            "
          />
        </ng-container>
      </pds-toolbar>

      <section class="c-token-explorer__section">
        <p-table
          [value]="groups()"
          dataKey="component"
          [expandedRowKeys]="expandedRows"
          [rowHover]="true"
        >
          <ng-template #header>
            <tr>
              <th scope="col">Component</th>
            </tr>
          </ng-template>

          <ng-template #body let-group let-expanded="expanded">
            <tr
              class="c-token-contracts__row"
              [class.is-warning]="group.broken"
            >
              <td>
                <div class="o-flex o-flex--align-items-center o-layout--gap-1">
                  <p-button
                    type="button"
                    [pRowToggler]="group"
                    [text]="true"
                    severity="secondary"
                    [rounded]="true"
                    [icon]="
                      expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'
                    "
                    [ariaLabel]="
                      (expanded ? 'Collapse ' : 'Expand ') + group.component
                    "
                  />
                  <span>{{ group.component }}</span>
                  <p-tag
                    [value]="
                      group.count + (group.count === 1 ? ' token' : ' tokens')
                    "
                    [severity]="group.broken ? 'danger' : 'secondary'"
                  />
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template #expandedrow let-group>
            <tr>
              <td>
                <p-table [value]="group.tokens" dataKey="cssVar">
                  <ng-template #header>
                    <tr>
                      <th scope="col">Consumed token</th>
                      <th scope="col">Declared in CSS</th>
                      <th scope="col"><span class="u-sr-only">Copy</span></th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-token>
                    <tr
                      class="c-token-contracts__row"
                      [class.is-warning]="!token.declared"
                    >
                      <td>
                        <code>{{ token.cssVar }}</code>
                      </td>
                      <td>
                        <p-tag
                          [value]="token.origin"
                          [severity]="originSeverity(token.origin)"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          class="c-token-explorer__copy-btn"
                          [attr.aria-label]="'Copy var(' + token.cssVar + ')'"
                          (click)="copy(token.cssVar)"
                        >
                          <i class="bi bi-clipboard" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </td>
            </tr>
          </ng-template>

          <ng-template #emptymessage>
            <tr>
              <td>No contract matches “{{ search() }}”.</td>
            </tr>
          </ng-template>
        </p-table>
      </section>
    </div>
  `,
})
class TokenContractsPageComponent {
  private readonly rendered = signal(false);

  readonly total = CONTRACTS.length;
  readonly search = signal('');
  /** Empty map — PrimeNG keeps every component row collapsed until toggled. */
  expandedRows: Record<string, boolean> = {};

  constructor() {
    afterNextRender(() => this.rendered.set(true));
  }

  private readonly checked = computed<TokenContract[]>(() => {
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

  readonly groups = computed<TokenContractGroup[]>(() => {
    const query = this.search().trim().toLowerCase();
    const buckets = new Map<string, TokenContract[]>();

    for (const row of this.checked()) {
      if (query && !row.haystack.includes(query)) continue;
      const bucket = buckets.get(row.component);
      if (bucket) bucket.push(row);
      else buckets.set(row.component, [row]);
    }

    return [...buckets.entries()].map(([component, tokens]) => ({
      component,
      tokens,
      count: tokens.length,
      broken: tokens.some((token) => !token.declared),
    }));
  });

  readonly matchCount = computed(() =>
    this.groups().reduce((total, group) => total + group.count, 0),
  );

  onSearch(value: string): void {
    this.search.set(value);
    const query = value.trim();
    this.expandedRows = query
      ? Object.fromEntries(
          this.groups().map((group) => [group.component, true]),
        )
      : {};
  }

  originSeverity(origin: ContractOrigin): 'warn' | 'info' | 'secondary' {
    if (origin === 'not declared') return 'warn';
    if (origin === 'Figma') return 'info';
    return 'secondary';
  }

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
