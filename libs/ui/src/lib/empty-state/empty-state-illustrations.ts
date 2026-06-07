export const EMPTY_STATE_ILLUSTRATIONS = [
  'assets/empty-illustrations/hand-coffee.svg',
  'assets/empty-illustrations/people-search.svg',
  'assets/empty-illustrations/person-box.svg',
  'assets/empty-illustrations/person-long-hair-window-happy-coffee.svg',
  'assets/empty-illustrations/person-short-hair-window-happy-coffee.svg',
  'assets/empty-illustrations/person-zero.svg',
  'assets/empty-illustrations/search-doctor-stethoscoop.svg',
] as const;

export function pickRandomEmptyStateIllustration(): string {
  const index = Math.floor(Math.random() * EMPTY_STATE_ILLUSTRATIONS.length);
  return EMPTY_STATE_ILLUSTRATIONS[index];
}
