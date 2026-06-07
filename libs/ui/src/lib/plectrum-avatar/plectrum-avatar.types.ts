export type PlectrumAvatarState = 'default' | 'active';

export type PlectrumAvatarSize = 'small' | 'large';

export type PlectrumAvatarGender = 'female' | 'male' | 'other';

export type PlectrumAvatarVariant = 1 | 2 | 3;

/**
 * Named colour palette for the small (initials) avatar shield.
 *
 * Drives the shield `fill` (host `color`) and initials contrast via a
 * `c-plectrum-avatar--color-{name}` modifier class. `red` is the default
 * Solidaris treatment; `blue`/`green` use white initials while `yellow`
 * uses a dark initial colour for contrast (Figma family avatars 7:1160).
 */
export type PlectrumAvatarColor = 'red' | 'blue' | 'green' | 'yellow';
