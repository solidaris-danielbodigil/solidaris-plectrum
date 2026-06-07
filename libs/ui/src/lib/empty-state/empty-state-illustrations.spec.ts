import {
  EMPTY_STATE_ILLUSTRATIONS,
  pickRandomEmptyStateIllustration,
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
});
