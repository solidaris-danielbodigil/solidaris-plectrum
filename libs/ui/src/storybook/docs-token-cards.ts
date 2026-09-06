// =============================================================================
// libs/ui/src/storybook/docs-token-cards.ts
// Shared markup for foundation utility galleries. Same chrome as
// <pds-token-explorer> grid items (c-token-explorer__item) so Elevation,
// Borders and the Token finder all show one card shape.
// =============================================================================

export interface DocsTokenCard {
  name: string;
  value?: string;
  tag?: string;
  /** Extra classes on the preview tile — usually a u-* utility. */
  previewClass?: string;
  /** Inline custom properties the preview modifiers read. */
  previewStyle?: string;
}

export function tokenExplorerCards(cards: readonly DocsTokenCard[]): string {
  return `
  <ul class="c-token-explorer__grid o-flex o-flex--wrap o-layout--gap-2 o-layout--margin-0 o-layout--padding-0" role="list">
    ${cards
      .map(
        (card) => `
      <li class="c-token-explorer__item o-flex__item o-flex__item--12 o-flex__item--6@sm o-flex__item--4@md o-flex__item--3@lg">
        <span class="c-token-explorer__preview ${card.previewClass ?? ''}"${
          card.previewStyle ? ` style="${card.previewStyle}"` : ''
        }></span>
        <div class="c-token-explorer__body">
          <p class="c-token-explorer__name">${card.name}</p>
          ${card.value ? `<p class="c-token-explorer__value">${card.value}</p>` : ''}
          ${
            card.tag
              ? `<p class="c-token-explorer__tags"><span class="c-token-explorer__tag">${card.tag}</span></p>`
              : ''
          }
        </div>
      </li>`,
      )
      .join('')}
  </ul>`;
}
