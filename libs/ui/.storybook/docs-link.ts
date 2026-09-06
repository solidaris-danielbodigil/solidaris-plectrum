/**
 * MDX `<a>` → PrimeNG Button link chrome.
 *
 * MDX is React; it cannot host `[pButton]`. The markup matches what
 * `pds-docs-link` renders: `p-button p-button-link p-component` + label span.
 *
 * Written without JSX — Angular's Storybook webpack has no React preset.
 */
import { createElement, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { docsLinkAttrs } from '../src/storybook/docs-figures.types';

// sb-unstyled opts out of Storybook's unlayered `.sbdocs a` rules so
// PrimeNG's layered .p-button-link chrome can apply.
const LINK_CLASS = 'p-button p-button-link p-component sb-unstyled';

export function DocsAnchor({
  href,
  target,
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }): ReactNode {
  // TOC and heading permalinks are Storybook chrome, not docs page links.
  if (className?.includes('toc-link') || rest['aria-hidden'] === 'true') {
    return createElement('a', { href, target, className, ...rest }, children);
  }

  const attrs = docsLinkAttrs(href ?? '');
  return createElement(
    'a',
    {
      ...rest,
      href: attrs.href,
      target: target ?? attrs.target,
      rel: attrs.rel,
      className: className ? `${LINK_CLASS} ${className}` : LINK_CLASS,
    },
    createElement('span', { className: 'p-button-label' }, children),
  );
}
