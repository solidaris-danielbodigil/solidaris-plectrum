import type { ComponentMetadata } from '@solidaris/contracts';
import { TOKEN_ANNOTATIONS } from './tokens.generated';

export type ConsumedTokenOrigin = 'not declared' | 'Figma' | 'code-owned';

export interface ConsumedTokenCheck {
  component: string;
  cssVar: string;
  haystack: string;
  declared: boolean;
  origin: ConsumedTokenOrigin;
}

const FROM_FIGMA = new Set(TOKEN_ANNOTATIONS.map((a) => a.cssVar));

export function checkTokenContracts(
  metadata: readonly ComponentMetadata[],
  declared: Pick<Map<string, unknown>, 'has'>,
): ConsumedTokenCheck[] {
  return metadata.flatMap((meta) =>
    (meta.tokens?.consumed ?? []).map((cssVar) => {
      const exists = declared.has(cssVar);
      return {
        component: meta.component.name,
        cssVar,
        haystack: `${meta.component.name} ${cssVar}`.toLowerCase(),
        declared: exists,
        origin: !exists
          ? 'not declared'
          : FROM_FIGMA.has(cssVar)
            ? 'Figma'
            : 'code-owned',
      };
    }),
  );
}
