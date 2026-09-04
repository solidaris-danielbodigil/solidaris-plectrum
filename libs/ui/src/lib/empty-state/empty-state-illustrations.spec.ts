import {
  EMPTY_STATE_ILLUSTRATIONS,
  pickRandomEmptyStateIllustration,
  resolveEmptyStateIllustration,
} from './empty-state-illustrations';

describe('empty-state-illustrations', () => {
  afterEach(() => {
    jasmine.getEnv().allowRespy(true);
  });

  it('should pick from the known illustration catalog', () => {
    spyOn(Math, 'random').and.returnValue(0);

    expect(pickRandomEmptyStateIllustration()).toBe(
      EMPTY_STATE_ILLUSTRATIONS[0],
    );
  });

  it('should wrap around the last illustration index', () => {
    spyOn(Math, 'random').and.returnValue(0.999);

    expect(pickRandomEmptyStateIllustration()).toBe(
      EMPTY_STATE_ILLUSTRATIONS[EMPTY_STATE_ILLUSTRATIONS.length - 1],
    );
  });

  it('should keep a random src when the choice is random', () => {
    expect(
      resolveEmptyStateIllustration('random', EMPTY_STATE_ILLUSTRATIONS[2]),
    ).toBe(EMPTY_STATE_ILLUSTRATIONS[2]);
  });

  it('should resolve a pinned illustration id to its asset path', () => {
    expect(
      resolveEmptyStateIllustration('person-box', EMPTY_STATE_ILLUSTRATIONS[0]),
    ).toBe('assets/empty-illustrations/person-box.svg');
  });
});
