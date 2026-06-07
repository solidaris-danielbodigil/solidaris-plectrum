import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlectrumAvatarComponent } from './plectrum-avatar.component';
import { getPlectrumAvatarIllustrationSrc } from './plectrum-avatar.assets';

describe('PlectrumAvatarComponent', () => {
  let fixture: ComponentFixture<PlectrumAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlectrumAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlectrumAvatarComponent);
    fixture.componentRef.setInput('initials', 'LV');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render initials in small variant', () => {
    const initials = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__initials',
    );
    expect(initials?.textContent?.trim()).toBe('LV');
    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--large'),
    ).toBe(false);
  });

  it('should render illustrated image in large variant', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--large'),
    ).toBe(true);

    const illustration = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__illustration',
    ) as HTMLImageElement;

    expect(illustration).toBeTruthy();
    expect(illustration.getAttribute('src')).toBe(
      getPlectrumAvatarIllustrationSrc('female', 1),
    );
    expect(
      fixture.nativeElement.querySelector('.c-plectrum-avatar__initials'),
    ).toBeFalsy();
  });

  it('should resolve illustration src from gender and variant inputs', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('gender', 'male');
    fixture.componentRef.setInput('variant', 2);
    fixture.detectChanges();

    const illustration = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__illustration',
    ) as HTMLImageElement;

    expect(illustration.getAttribute('src')).toBe(
      getPlectrumAvatarIllustrationSrc('male', 2),
    );
  });

  it('should fall back other gender to variant 1 asset', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('gender', 'other');
    fixture.componentRef.setInput('variant', 3);
    fixture.detectChanges();

    const illustration = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__illustration',
    ) as HTMLImageElement;

    expect(illustration.getAttribute('src')).toBe(
      getPlectrumAvatarIllustrationSrc('other', 1),
    );
  });

  it('should apply BEM host class', () => {
    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar'),
    ).toBe(true);
  });

  it('should apply large modifier class when size input is large', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--large'),
    ).toBe(true);
  });

  it('should expose role img and tabindex for keyboard focus', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('img');
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('should fall back aria-label to uppercase initials', () => {
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('LV');
  });

  it('should use ariaLabel input when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Eva Martinez');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Eva Martinez');
  });

  it('should set data-state when state is active', () => {
    fixture.componentRef.setInput('state', 'active');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-state')).toBe('active');
  });

  it('should mark illustrated image as aria-hidden in large variant', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const illustration = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__illustration',
    ) as HTMLImageElement;

    expect(illustration.getAttribute('aria-hidden')).toBe('true');
    expect(illustration.getAttribute('alt')).toBe('');
  });

  it('should mark small variant shape and initials as aria-hidden', () => {
    const shape = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__shape',
    );
    const initials = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__initials',
    );

    expect(shape?.getAttribute('aria-hidden')).toBe('true');
    expect(shape?.getAttribute('focusable')).toBe('false');
    expect(initials?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not apply any colour modifier class by default', () => {
    const classes = fixture.nativeElement.classList;
    expect(classes.contains('c-plectrum-avatar--color-blue')).toBe(false);
    expect(classes.contains('c-plectrum-avatar--color-green')).toBe(false);
    expect(classes.contains('c-plectrum-avatar--color-yellow')).toBe(false);
    expect(classes.contains('c-plectrum-avatar--color-red')).toBe(false);
  });

  it('should apply the colour modifier class matching the color input', () => {
    fixture.componentRef.setInput('color', 'blue');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--color-blue'),
    ).toBe(true);
  });

  it('should swap the colour modifier class when the color input changes', () => {
    fixture.componentRef.setInput('color', 'green');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--color-green'),
    ).toBe(true);

    fixture.componentRef.setInput('color', 'yellow');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--color-green'),
    ).toBe(false);
    expect(
      fixture.nativeElement.classList.contains(
        'c-plectrum-avatar--color-yellow',
      ),
    ).toBe(true);
  });

  it('should remove the colour modifier class when color is reset to null', () => {
    fixture.componentRef.setInput('color', 'red');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--color-red'),
    ).toBe(true);

    fixture.componentRef.setInput('color', null);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.classList.contains('c-plectrum-avatar--color-red'),
    ).toBe(false);
  });
});
