import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { clearStorybookToasts } from '../storybook/storybook-toast';
import {
  borderGroups,
  BordersPlaygroundComponent,
  composeBorderClasses,
  radiusTargetFromSuffix,
} from './borders-playground';

function cornersSelectDisabled(host: HTMLElement): boolean {
  const control = host.querySelector(
    '#pds-borders-corners',
  ) as HTMLElement | null;
  const select = control?.closest('p-select') ?? null;
  if (!control && !select) return false;
  return (
    (control as HTMLButtonElement | null)?.disabled === true ||
    control?.getAttribute('aria-disabled') === 'true' ||
    control?.getAttribute('data-p-disabled') === 'true' ||
    select?.getAttribute('data-p-disabled') === 'true' ||
    select?.classList.contains('p-disabled') === true
  );
}

describe('composeBorderClasses', () => {
  it('joins side, optional status, modifiers and radius', () => {
    expect(
      composeBorderClasses({
        side: 'top',
        status: 'danger',
        thick: true,
        dashed: true,
        radius: 'md',
      }),
    ).toBe(
      'u-border-top u-border-danger u-border-thick u-border-dashed u-radius-md',
    );
  });

  it('omits default status and none radius', () => {
    expect(
      composeBorderClasses({
        side: 'all',
        status: 'default',
        thick: false,
        dashed: false,
        radius: 'none',
      }),
    ).toBe('u-border-all');
  });

  it('targets a radius edge or corner', () => {
    expect(
      composeBorderClasses({
        side: 'all',
        status: 'default',
        thick: false,
        dashed: false,
        radius: 'md',
        radiusTarget: 'top-start',
      }),
    ).toBe('u-border-all u-radius-top-start-md');
  });
});

describe('radiusTargetFromSuffix', () => {
  it('reads all-corner stops and per-edge / per-corner targets', () => {
    expect(radiusTargetFromSuffix('md')).toBe('all');
    expect(radiusTargetFromSuffix('2xl')).toBe('all');
    expect(radiusTargetFromSuffix('top-md')).toBe('top');
    expect(radiusTargetFromSuffix('top-2xl')).toBe('top');
    expect(radiusTargetFromSuffix('top-start-xl')).toBe('top-start');
  });
});

describe('BordersPlaygroundComponent', () => {
  let fixture: ComponentFixture<BordersPlaygroundComponent>;
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
      imports: [BordersPlaygroundComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(BordersPlaygroundComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    clearStorybookToasts();
  });

  it('labels the compose filters and starts from a side class', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Side');
    expect(text).toContain('Status');
    expect(text).toContain('Weight');
    expect(text).toContain('Style');
    expect(text).toContain('Radius');
    expect(text).toContain('Corners');
    expect(text).toContain('Result');
    expect(text.indexOf('Radius')).toBeLessThan(text.indexOf('Corners'));
    expect(fixture.nativeElement.querySelector('pds-toolbar')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('pds-docs-direction'),
    ).toBeTruthy();
    expect(fixture.componentInstance.classes()).toMatch(/^u-border-/);
    expect(fixture.componentInstance.cornersDisabled()).toBe(true);
    expect(cornersSelectDisabled(fixture.nativeElement)).toBe(true);
  });

  it('enables corners once a radius stop is set', async () => {
    fixture.componentInstance.radius.set('md');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.cornersDisabled()).toBe(false);
    expect(cornersSelectDisabled(fixture.nativeElement)).toBe(false);
  });

  it('updates the snippet when filters change and copies it', async () => {
    const statuses = borderGroups().statuses;
    expect(statuses.length).toBeGreaterThan(0);

    fixture.componentInstance.side.set('top');
    fixture.componentInstance.status.set(statuses[0]);
    fixture.componentInstance.weight.set('thick');
    fixture.componentInstance.stroke.set('dashed');
    fixture.componentInstance.radiusTarget.set('top');
    fixture.componentInstance.radius.set('md');
    fixture.detectChanges();

    const expected = `u-border-top u-border-${statuses[0]} u-border-thick u-border-dashed u-radius-top-md`;
    expect(fixture.componentInstance.classes()).toBe(expected);
    expect(fixture.nativeElement.textContent).toContain(expected);

    const button = fixture.nativeElement.querySelector(
      '[aria-label^="Copy "]',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();
    expect(written).toEqual([expected]);
  });
});
