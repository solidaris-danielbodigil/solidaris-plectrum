import type {
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from './plectrum-avatar.types';

const GENDER_LABELS: Record<PlectrumAvatarGender, string> = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

/** Clamp variant to available assets — `other` only has variant 1. */
export function resolvePlectrumAvatarVariant(
  gender: PlectrumAvatarGender,
  variant: PlectrumAvatarVariant,
): PlectrumAvatarVariant {
  if (gender === 'other') {
    return 1;
  }

  return variant >= 1 && variant <= 3 ? variant : 1;
}

/** Resolve served asset URL for a complete illustrated avatar SVG. */
export function getPlectrumAvatarIllustrationSrc(
  gender: PlectrumAvatarGender,
  variant: PlectrumAvatarVariant,
): string {
  const resolvedVariant = resolvePlectrumAvatarVariant(gender, variant);
  const filename = `Gender=${GENDER_LABELS[gender]}, Variant=${resolvedVariant}.svg`;

  return `assets/${encodeURIComponent(filename)}`;
}
