import type { ComponentMetadata } from '@solidaris/contracts';

export const PlectrumAvatarMetadata: ComponentMetadata = {
  component: {
    name: 'PlectrumAvatar',
    category: 'atoms',
    description:
      'Custom Plectrum avatar used for initials-based identity chips. Not PrimeNG Avatar. Hover, focus-visible, and pressed are handled with CSS pseudo-classes; the API keeps the persistent active state with the Figma halo.',
    type: 'display',
    path: 'libs/ui/src/lib/plectrum-avatar/plectrum-avatar.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-plectrum-avatar',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.plectrum-avatar.scss',
    created: '2026-06-04',
    modified: '2026-06-06',
  },
  usage: {
    useCases: [
      'user initials avatar',
      'profile chip',
      'small identity marker in navigation or lists',
    ],
    commonPatterns: [
      {
        name: 'Default state',
        description: 'Red brand mark with centered initials.',
        composition: '<sds-plectrum-avatar initials="LV" />',
      },
      {
        name: 'Active state',
        description: 'Selected avatar with blue halo and white outline.',
        composition: '<sds-plectrum-avatar initials="LV" state="active" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Using this avatar for generic image avatars',
        reason: 'The component is tailored to the Plectrum initials-based identity treatment.',
        alternative: 'Use a dedicated image avatar component if needed later.',
      },
      {
        scenario: 'Hardcoding the active halo in component SCSS',
        reason: 'The active ring is tokenised and must stay in 01-settings.',
        alternative: 'Use --sds-shadow-avatar-active from the avatar settings file.',
      },
    ],
  },
  behavior: {
    states: ['default', 'hover', 'focus-visible', 'active'],
  },
  props: [
    { name: 'initials', type: 'string', required: true, description: 'Initials rendered in the center of the small avatar' },
    { name: 'size', type: 'PlectrumAvatarSize', required: false, default: 'small', description: 'Small initials or large illustrated treatment' },
    { name: 'gender', type: 'PlectrumAvatarGender', required: false, default: 'female', description: 'Illustrated avatar gender (large variant)' },
    { name: 'variant', type: 'PlectrumAvatarVariant', required: false, default: '1', description: 'Illustrated avatar style variant 1–3 (other clamps to 1)' },
    { name: 'state', type: 'PlectrumAvatarState', required: false, default: 'default', description: 'Persistent visual state from the Figma component (default or active)' },
    { name: 'ariaLabel', type: 'string', required: false, default: 'null', description: 'Optional accessible label for screen readers' },
  ],
  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label'],
    keyboardSupport: ['Tab / Shift+Tab — move focus to the avatar', 'Enter / Space — native active feedback via CSS pseudo-classes'],
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [
      '--sds-size-avatar',
      '--sds-color-avatar-shape-hover',
      '--sds-shadow-avatar-active',
      '--sds-radius-md',
      '--sds-color-surface-0',
      '--sds-transition-duration-mask',
    ],
  },
  composition: {
    nestedComponents: [],
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
      description: 'Render a initials avatar',
      code: '<sds-plectrum-avatar initials="LV" />',
    },
  ],
};
