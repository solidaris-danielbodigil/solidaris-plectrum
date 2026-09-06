/**
 * Docs container that maps MDX `a` onto the PrimeNG Button link chrome.
 *
 * Written without JSX — Angular's Storybook webpack has no React preset.
 */
import { createElement, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { MDXProvider } from '@storybook/addon-docs/mdx-react-shim';
import { DocsAnchor } from './docs-link';

export function PlectrumDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  return createElement(
    MDXProvider,
    { components: { a: DocsAnchor } },
    createElement(DocsContainer, props),
  );
}
