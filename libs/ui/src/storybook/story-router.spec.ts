import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideStoryRouter } from './story-router';

describe('provideStoryRouter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideStoryRouter()] });
  });

  it('leaves the browser URL untouched when the router navigates', async () => {
    const before = window.location.href;
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/icrm');
    await router.navigateByUrl('/does/not/exist');

    expect(window.location.href).toBe(before);
  });

  it('resolves unmatched sample links instead of failing the navigation', async () => {
    const router = TestBed.inject(Router);

    await expectAsync(router.navigateByUrl('/ishare')).toBeResolvedTo(true);
    expect(TestBed.inject(Location).path()).toBe('/ishare');
  });

  it('keeps caller routes ahead of the wildcard', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideStoryRouter([{ path: 'icrm', children: [] }])],
    });
    const router = TestBed.inject(Router);

    expect(router.config[0].path).toBe('icrm');
    expect(router.config.at(-1)?.path).toBe('**');
  });
});
