import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { clearStorybookToasts } from '../storybook/storybook-toast';
import {
  elevationStops,
  ElevationPlaygroundComponent,
} from './elevation-playground';

describe('ElevationPlaygroundComponent', () => {
  let fixture: ComponentFixture<ElevationPlaygroundComponent>;
  let written: string[];

  beforeEach(async () => {
    written = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          written.push(text);
          return Promise.resolve();
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [ElevationPlaygroundComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ElevationPlaygroundComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    clearStorybookToasts();
  });

  it('labels the level filter and offers every generated stop', () => {
    const stops = elevationStops();
    expect(stops.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain('Level');
    expect(fixture.nativeElement.querySelector('pds-toolbar')).toBeTruthy();
    expect(
      fixture.componentInstance.levelOptions().map((option) => option.value),
    ).toEqual(stops);
  });

  it('copies the class and the token var', async () => {
    fixture.componentInstance.level.set('sm');
    fixture.detectChanges();

    expect(fixture.componentInstance.className()).toBe('u-shadow-sm');
    expect(fixture.componentInstance.tokenVar()).toBe('var(--pds-shadow-sm)');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label^="Copy "]'),
    ) as HTMLButtonElement[];
    expect(buttons.length).toBe(2);

    buttons[0].click();
    buttons[1].click();
    await fixture.whenStable();
    expect(written).toEqual(['u-shadow-sm', 'var(--pds-shadow-sm)']);
  });
});
