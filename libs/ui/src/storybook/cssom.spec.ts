// =============================================================================
// Proves the CSSOM is the source of truth (.ai/rules/10-css-ssot.md).
//
// The decisive test is `discovers a token that no manifest knows about`: it
// injects a brand-new --pds-* declaration and asserts the reader finds it with
// no generated file involved.
// =============================================================================

import { readClassNames, readClassRules, readTokenDeclarations, resolveToken } from './cssom';
import { classifyToken } from './token-taxonomy';
import { TOKEN_ANNOTATIONS } from './tokens.generated';

describe('cssom', () => {
  it('reads every global --pds-* declaration', () => {
    const declarations = readTokenDeclarations();
    // The manifest only annotates Figma-sourced tokens; CSS carries far more.
    expect(declarations.size).toBeGreaterThan(TOKEN_ANNOTATIONS.length);
    expect(declarations.has('--pds-color-primary-600')).toBe(true);
    // Declared only in _settings.radius.scss, never in the manifest.
    expect(declarations.has('--pds-radius-pill')).toBe(true);
  });

  it('parses the hybrid emit into alias and fallback', () => {
    const token = readTokenDeclarations().get('--pds-color-primary-600')!;
    expect(token.authored).toBe('var(--p-primary-600, #487395)');
    expect(token.primeNgVar).toBe('--p-primary-600');
    expect(token.fallback).toBe('#487395');
  });

  it('treats an unaliased token as its own fallback', () => {
    const token = readTokenDeclarations().get('--pds-radius-md')!;
    expect(token.primeNgVar).toBeNull();
    expect(token.fallback).toBe('6px');
  });

  it('resolves a token against an element', () => {
    expect(resolveToken(document.documentElement, '--pds-radius-md')).toBe('6px');
  });

  it('discovers a token that no manifest knows about', () => {
    const style = document.createElement('style');
    style.textContent = ':root { --pds-radius-3xl: 24px; }';
    document.head.appendChild(style);

    try {
      const declarations = readTokenDeclarations();
      const token = declarations.get('--pds-radius-3xl');

      expect(token).toBeTruthy();
      expect(token!.fallback).toBe('24px');
      // Shape-based taxonomy, so a new scale step lands on the right page.
      expect(classifyToken('radius-3xl')).toEqual({
        category: 'radius',
        group: 'radius',
        scope: 'foundation',
      });
    } finally {
      style.remove();
    }
  });

  it('enumerates generated class names', () => {
    const radii = readClassNames(/^u-radius-/);
    expect(radii).toContain('u-radius-md');
    expect(radii).toContain('u-radius-top-start-xl');
    // The stylesheet generates far more per-edge targets than any list tracked.
    expect(radii.length).toBeGreaterThan(40);
  });

  it('reports the properties a class rule declares', () => {
    const rules = readClassRules(/^u-border-(.+)$/);
    const side = rules.find((rule) => rule.suffix === 'top')!;
    const status = rules.find((rule) => rule.suffix === 'danger')!;

    expect(side.properties.some((prop) => /^border/.test(prop))).toBe(true);
    expect(status.properties).toContain('--pds-border-color');
    expect(status.properties.some((prop) => /^border/.test(prop))).toBe(false);
  });
});

describe('token taxonomy', () => {
  it('routes foundation roles and scale steps to their page', () => {
    expect(classifyToken('color-text-muted')).toEqual({
      category: 'color',
      group: 'text',
      scope: 'foundation',
    });
    expect(classifyToken('text-body-md-size').group).toBe('body');
    expect(classifyToken('spacing-0-25').scope).toBe('foundation');
    expect(classifyToken('shadow-sm')).toEqual({
      category: 'shadow',
      group: 'elevation',
      scope: 'foundation',
    });
    expect(classifyToken('ease-standard').group).toBe('easing');
    expect(classifyToken('icon-size')).toEqual({
      category: 'icon',
      group: 'size',
      scope: 'foundation',
    });
    expect(classifyToken('icon-size-xl')).toEqual({
      category: 'icon',
      group: 'size',
      scope: 'foundation',
    });
  });

  it('routes component tokens to the component bucket on the same page', () => {
    expect(classifyToken('color-affiliate-details-page-bg')).toEqual({
      category: 'color',
      group: 'component',
      scope: 'component',
    });
    expect(classifyToken('space-nav-shell-item-px').category).toBe('spacing');
    expect(classifyToken('space-nav-shell-item-px').scope).toBe('component');
    expect(classifyToken('transition-nav-reveal').scope).toBe('component');
  });

  it('leaves non-foundation names off every foundation page', () => {
    expect(classifyToken('size-avatar').category).toBeNull();
    expect(classifyToken('z-sticky').category).toBeNull();
  });

  it('uses Figma Colors group names', () => {
    expect(classifyToken('color-blue-500')).toEqual({
      category: 'color',
      group: 'blue',
      scope: 'foundation',
    });
    expect(classifyToken('color-primary-600').group).toBe('primary');
    expect(classifyToken('color-primary-interactive-hover').group).toBe('primary');
    expect(classifyToken('color-brand-hover').group).toBe('primary');
    expect(classifyToken('color-nav-item').group).toBe('navigation');
    expect(classifyToken('color-surface-50').group).toBe('surface');
    expect(classifyToken('color-surface-subtle').group).toBe('surface');
  });
});
