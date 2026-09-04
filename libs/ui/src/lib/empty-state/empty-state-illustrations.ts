export const EMPTY_STATE_ILLUSTRATION_IDS = [
  'hand-coffee',
  'people-search',
  'person-box',
  'person-long-hair-window-happy-coffee',
  'person-short-hair-window-happy-coffee',
  'person-zero',
  'search-doctor-stethoscoop',
] as const;

export type EmptyStateIllustrationId =
  (typeof EMPTY_STATE_ILLUSTRATION_IDS)[number];

export type EmptyStateIllustrationChoice = EmptyStateIllustrationId | 'random';

export const EMPTY_STATE_ILLUSTRATION_CHOICES = [
  'random',
  ...EMPTY_STATE_ILLUSTRATION_IDS,
] as const;

export function emptyStateIllustrationSrc(
  id: EmptyStateIllustrationId,
): string {
  return `assets/empty-illustrations/${id}.svg`;
}

export const EMPTY_STATE_ILLUSTRATIONS = EMPTY_STATE_ILLUSTRATION_IDS.map(
  (id) => emptyStateIllustrationSrc(id),
);

export function pickRandomEmptyStateIllustration(): string {
  const index = Math.floor(Math.random() * EMPTY_STATE_ILLUSTRATION_IDS.length);
  return emptyStateIllustrationSrc(EMPTY_STATE_ILLUSTRATION_IDS[index]);
}

export function resolveEmptyStateIllustration(
  choice: EmptyStateIllustrationChoice,
  randomSrc: string,
): string {
  if (choice === 'random') {
    return randomSrc;
  }

  return emptyStateIllustrationSrc(choice);
}
