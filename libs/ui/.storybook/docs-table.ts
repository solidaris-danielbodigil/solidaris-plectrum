/**
 * Storybook ArgTypes table chrome for docs pages.
 *
 * Written without JSX — Angular's Storybook webpack runs this file through
 * the app Babel loader, which has no React preset.
 *
 * Markdown pipe tables do not render in Storybook 10 MDX without GFM, and a
 * PrimeNG p-table inside a Canvas iframe is clipped — so tables stay here.
 */
import { createElement, type ReactNode } from 'react';

export function DocsTable({
  headers,
  rows,
}: {
  headers: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}): ReactNode {
  return createElement(
    'table',
    { className: 'docblock-argstable' },
    createElement(
      'thead',
      { className: 'docblock-argstable-head' },
      createElement(
        'tr',
        null,
        headers.map((header) =>
          createElement('th', { key: header }, createElement('span', null, header)),
        ),
      ),
    ),
    createElement(
      'tbody',
      { className: 'docblock-argstable-body' },
      rows.map((row, rowIndex) =>
        createElement(
          'tr',
          { key: rowIndex },
          row.map((cell, cellIndex) =>
            createElement(
              'td',
              { key: cellIndex },
              createElement('div', null, createElement('span', null, cell)),
            ),
          ),
        ),
      ),
    ),
  );
}
