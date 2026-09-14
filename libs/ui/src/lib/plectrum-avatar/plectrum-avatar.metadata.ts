import type { ComponentMetadata } from '@solidaris/contracts';

export const PlectrumAvatarMetadata: ComponentMetadata = {
  component: {
    name: 'PlectrumAvatar',
    category: 'atoms',
    description:
      'Initials-based and illustrated identity avatar of the Plectrum design system — a custom treatment, not PrimeNG Avatar. The small shield carries initials; the large variant shows a catalog illustration. Hover, focus-visible and pressed are CSS pseudo-classes; state keeps the persistent selected halo.',
    type: 'display',
    path: 'libs/ui/src/lib/plectrum-avatar/plectrum-avatar.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-plectrum-avatar',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.plectrum-avatar.scss',
    figmaUrl: 'https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=1-1586',
    created: '2026-06-04',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'User initials avatar or profile chip',
      'Small identity marker in navigation or lists',
      'Large illustrated identity next to a profile title',
    ],
    commonPatterns: [
      {
        name: 'Default state',
        description: 'Red brand mark with centered initials.',
        composition: '<(pds|app|lib)-plectrum-avatar initials="LV" />',
      },
      {
        name: 'Active state',
        description: 'Selected avatar with blue halo and white outline.',
        composition: '<(pds|app|lib)-plectrum-avatar initials="LV" state="active" />',
      },
      {
        name: 'Large illustrated',
        description: 'Catalog illustration chosen by gender and variant, named by the person.',
        composition: '<(pds|app|lib)-plectrum-avatar size="large" gender="female" [variant]="1" initials="EM" ariaLabel="Eva Martinez" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Generic photo avatars',
        reason: 'This treatment is initials or a catalog illustration only — there is no image input.',
        alternative: 'Use a dedicated image avatar component if photos are needed.',
      },
      {
        scenario: 'A focusable avatar inside a button or menu trigger',
        reason: 'The trigger already has the accessible name; a second tab stop with role="img" duplicates it.',
        alternative: 'Set focusable="false" so the avatar is decorative (aria-hidden) inside the control.',
      },
      {
        scenario: 'Hardcoding the active halo in component SCSS',
        reason: 'The active ring is tokenised and must stay in 01-settings.',
        alternative: 'Use --pds-shadow-avatar-active from the avatar settings file.',
      },
    ],
  },
  anatomy: [
    { part: 'c-plectrum-avatar', role: 'Host — small initials treatment by default; role="img" + aria-label when focusable' },
    { part: 'c-plectrum-avatar--large', role: 'Illustrated catalog SVG variant' },
    { part: 'c-plectrum-avatar--color-{blue|green|yellow|red}', role: 'Named shield colour for the small variant (unset keeps the Solidaris red)' },
    { part: 'c-plectrum-avatar__shape / __initials', role: 'Decorative shield and initials (aria-hidden)' },
    { part: 'c-plectrum-avatar__illustration', role: 'Decorative img for the large variant (alt="", aria-hidden)' },
    { part: 'data-state="active"', role: 'Persistent selected halo' },
  ],
  variants: {
    size: {
      options: ['small', 'large'],
      default: 'small',
      purpose: {
        small: 'Initials shield sized by --pds-size-avatar — identity chip in navigation, lists and tiles',
        large: 'Catalog illustration (gender × variant 1–3) from libs/assets — next to a profile title',
      },
    },
    state: {
      options: ['default', 'active'],
      default: 'default',
      purpose: {
        default: 'Resting brand mark',
        active: 'Persistent selected halo (--pds-shadow-avatar-active), e.g. while the profile menu is open',
      },
    },
  },
  behavior: {
    states: ['default', 'hover', 'focus-visible', 'pressed', 'active'],
    interactions: [
      'Hover, focus-visible and pressed are CSS pseudo-class states; the state input is the persistent selected halo',
      'The initials are upper-cased for display and as the fallback accessible name',
      'The illustration is picked by gender × variant; a variant outside 1–3 clamps to 1 and gender "other" only has variant 1',
    ],
  },
  props: [
    { name: 'initials', type: 'string', required: true, description: 'Initials rendered in the center of the small avatar.' },
    { name: 'size', type: 'PlectrumAvatarSize', required: false, default: 'small', description: 'Small initials or large illustrated treatment.' },
    { name: 'gender', type: 'PlectrumAvatarGender', required: false, default: 'female', description: 'Illustrated avatar gender (large variant).' },
    { name: 'variant', type: 'PlectrumAvatarVariant', required: false, default: '1', description: 'Illustrated avatar style variant 1–3 (other clamps to 1).' },
    { name: 'color', type: 'PlectrumAvatarColor | null', required: false, default: 'null', description: 'Optional named colour for the small shield. Unset keeps the Solidaris red.' },
    { name: 'state', type: 'PlectrumAvatarState', required: false, default: 'default', description: 'Persistent visual state from the Figma component (default or active).' },
    { name: 'ariaLabel', type: 'string | null', required: false, default: 'null', description: 'Optional accessible label; falls back to the initials.' },
    { name: 'focusable', type: 'boolean', required: false, default: 'true', description: 'When false the avatar is decorative — use inside another interactive control.' },
  ],
  accessibility: {
    role: 'img',
    ariaAttributes: [
      'Focusable (default): the host is role="img" with aria-label from ariaLabel, falling back to the initials',
      'Decorative inside another control: focusable="false" drops role and tabindex and sets aria-hidden on the host',
      'Illustration and initials glyphs are aria-hidden — the host label is the only accessible name',
    ],
    keyboardSupport: [
      'Tab / Shift+Tab reach the avatar when focusable (tabindex 0)',
      'The avatar has no action of its own — wrap it in a button or menu trigger for activation',
    ],
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [
      '--pds-size-avatar',
      '--pds-color-avatar-shape-hover',
      '--pds-shadow-avatar-active',
      '--pds-radius-md',
      '--pds-color-surface-0',
      '--pds-transition-duration-mask',
    ],
  },
  composition: {
    nestedComponents: [],
    parentConstraints: [
      'TopNavComponent — avatar menu trigger (focusable="false" inside the button)',
      'ProfileCardComponent — large illustrated avatar named by the title',
      'ProfileDrawerComponent — large header avatar and small coloured related-person avatars',
    ],
    companions: [],
    slots: [],
  },
  aiHints: {
    priority: 'medium',
    context:
      'Use for initials-based avatar treatments that match the Plectrum custom-components Figma node 1:1586. Not a PrimeNG Avatar replacement. Hover/focus/pressed are CSS pseudo-class states; active is the persistent selected state.',
    selectionCriteria: {
      'initials avatar': 'use PlectrumAvatar',
      'active halo state': 'use PlectrumAvatar with state="active"',
    },
    keywords: ['avatar', 'initials', 'identity', 'stateful', 'brand'],
  },
  examples: [
    {
      name: 'Default avatar',
      description: 'Render an initials avatar',
      code: '<(pds|app|lib)-plectrum-avatar initials="LV" />',
    },
  ],
};
