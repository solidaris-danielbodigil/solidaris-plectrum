/** Storybook Design panel + MDX Figma link — one URL from `{name}.metadata.ts`. */
export function storyDesign(figmaUrl?: string): {
  design?: { type: 'figma'; url: string };
} {
  if (!figmaUrl) {
    return {};
  }

  return {
    design: {
      type: 'figma',
      url: figmaUrl,
    },
  };
}
