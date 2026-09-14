import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  PDS_LOCALE_STORAGE_KEY,
  PdsLocaleService,
  providePdsLocale,
} from '../i18n';
import { TopNavComponent } from './top-nav.component';
import type { MenuItem } from 'primeng/api';

describe('TopNavComponent', () => {
  let fixture: ComponentFixture<TopNavComponent>;
  let component: TopNavComponent;

  const breadcrumbs: MenuItem[] = [{ label: 'Home' }];

  beforeEach(async () => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [TopNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
    fixture.componentRef.setInput('avatarInitials', 'IS');
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  it('should render an optional back button before the breadcrumb', () => {
    fixture.componentRef.setInput('showBackButton', true);
    fixture.componentRef.setInput('backLabel', 'Retour');
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector(
      '.c-top-nav__back-button',
    ) as HTMLButtonElement | null;

    expect(backButton).not.toBeNull();
    expect(backButton?.textContent).toContain('Retour');
  });

  it('should emit backClicked when the back button is activated', () => {
    const backSpy = jasmine.createSpy('backClicked');
    fixture.componentRef.setInput('showBackButton', true);
    fixture.componentInstance.backClicked.subscribe(backSpy);
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector(
      '.c-top-nav__back-button',
    ) as HTMLButtonElement;
    backButton.click();

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('should render a plain avatar when no menu items are provided', () => {
    const trigger = fixture.nativeElement.querySelector('.c-top-nav__avatar-trigger');
    const avatar = fixture.nativeElement.querySelector('.c-top-nav__avatar');

    expect(trigger).toBeNull();
    expect(avatar).not.toBeNull();
  });

  it('should render a menu trigger when showAvatarMenu is true even without items', () => {
    fixture.componentRef.setInput('showAvatarMenu', true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.c-top-nav__avatar-trigger');
    const avatar = trigger?.querySelector('.c-top-nav__avatar');

    expect(trigger).not.toBeNull();
    expect(avatar?.getAttribute('tabindex')).toBeNull();
    expect(avatar?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render an avatar menu trigger when items are provided', () => {
    fixture.componentRef.setInput('avatarMenuItems', [
      { label: 'Export', icon: 'bi bi-download', id: 'session-export' },
    ]);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.c-top-nav__avatar-trigger');

    expect(trigger).not.toBeNull();
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should render avatar menu items with PrimeNG 21 classes and telemetry attrs', () => {
    fixture.componentRef.setInput('avatarMenuItems', [
      { label: 'Export', icon: 'bi bi-download', id: 'session-export' },
    ]);
    fixture.componentRef.setInput('telemetryLabelsEnabled', true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.c-top-nav__avatar-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const link = document.body.querySelector(
      '.p-menu-item-link[data-telemetry-id="session-export"]',
    ) as HTMLAnchorElement | null;

    expect(link).not.toBeNull();
    expect(link?.getAttribute('data-test')).toBe('Export');
    expect(link?.querySelector('.p-menu-item-icon')).not.toBeNull();
    expect(link?.querySelector('.p-menu-item-label')?.textContent).toBe('Export');
  });

  it('should invoke avatar menu item command only once per click', () => {
    const command = jasmine.createSpy('command');
    fixture.componentRef.setInput('avatarMenuItems', [
      { label: 'Démarrer la session test', icon: 'bi bi-play-circle', id: 'session-start', command },
    ]);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.c-top-nav__avatar-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const link = document.body.querySelector(
      '.p-menu-item-link[data-telemetry-id="session-start"]',
    ) as HTMLAnchorElement;
    link.click();

    expect(command).toHaveBeenCalledTimes(1);
  });

  it('should render the live timer label without changing the menu model', () => {
    fixture.componentRef.setInput('avatarMenuItems', [
      {
        label: 'Arrêter la session test',
        icon: 'bi bi-stop-circle',
        id: 'session-stop',
      },
    ]);
    fixture.componentRef.setInput('avatarMenuTimerItemId', 'session-stop');
    fixture.componentRef.setInput('avatarMenuTimerLabel', '02:34');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.c-top-nav__avatar-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const link = document.body.querySelector(
      '.p-menu-item-link[data-telemetry-id="session-stop"]',
    ) as HTMLAnchorElement | null;
    const label = link?.querySelector('.p-menu-item-label');

    expect(label?.textContent).toBe('Arrêter la session test');
    expect(link?.querySelector('.c-top-nav__menu-timer')?.textContent).toBe('02:34');
    expect(link?.getAttribute('aria-label')).toBe('Arrêter la session test (02:34)');

    fixture.componentRef.setInput('avatarMenuTimerLabel', '02:35');
    fixture.detectChanges();

    const updatedLink = document.body.querySelector(
      '.p-menu-item-link[data-telemetry-id="session-stop"]',
    ) as HTMLAnchorElement | null;

    expect(updatedLink?.querySelector('.c-top-nav__menu-timer')?.textContent).toBe('02:35');
    expect(updatedLink?.getAttribute('aria-label')).toBe('Arrêter la session test (02:35)');
  });

  it('should not render a timer on items that do not match the timer item id', () => {
    fixture.componentRef.setInput('avatarMenuItems', [
      { label: 'Démarrer la session test', icon: 'bi bi-play-circle', id: 'session-start' },
    ]);
    fixture.componentRef.setInput('avatarMenuTimerItemId', 'session-stop');
    fixture.componentRef.setInput('avatarMenuTimerLabel', '02:34');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.c-top-nav__avatar-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const link = document.body.querySelector(
      '.p-menu-item-link[data-telemetry-id="session-start"]',
    ) as HTMLAnchorElement | null;

    expect(link?.querySelector('.c-top-nav__menu-timer')).toBeNull();
    expect(link?.getAttribute('aria-label')).toBe('Démarrer la session test');
  });

  it('should hide the locale switcher by default', () => {
    expect(fixture.nativeElement.querySelector('.c-top-nav__locale')).toBeNull();
  });

  it('should render FR/NL and persist the locale when the switcher is shown', () => {
    const service = TestBed.inject(PdsLocaleService);
    fixture.componentRef.setInput('showLocaleSwitcher', true);
    fixture.detectChanges();

    const switcher = fixture.nativeElement.querySelector(
      '.c-top-nav__locale',
    ) as HTMLElement | null;
    const options = switcher?.querySelectorAll(
      '[role="button"], .p-togglebutton',
    );

    expect(switcher).not.toBeNull();
    expect(switcher?.textContent).toContain('FR');
    expect(switcher?.textContent).toContain('NL');
    expect(options?.length).toBeGreaterThanOrEqual(2);

    const nlOption = Array.from(options ?? []).find((option) =>
      (option.textContent ?? '').includes('NL'),
    ) as HTMLElement | undefined;
    nlOption?.click();
    fixture.detectChanges();

    expect(service.locale()).toBe('nl');
  });

  it('should name the locale switcher and keep FR/NL keyboard operable', () => {
    const service = TestBed.inject(PdsLocaleService);
    fixture.componentRef.setInput('showLocaleSwitcher', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector(
      '#top-nav-locale-label',
    ) as HTMLElement | null;
    const group = fixture.nativeElement.querySelector(
      '.c-top-nav__locale [role="group"]',
    ) as HTMLElement | null;
    const options = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.c-top-nav__locale [role="button"], .c-top-nav__locale .p-togglebutton',
      ),
    ) as HTMLElement[];

    expect(label?.textContent?.trim()).toBe('Langue');
    expect(group?.getAttribute('aria-labelledby')).toBe('top-nav-locale-label');
    expect(options.length).toBeGreaterThanOrEqual(2);

    const nlOption = options.find((option) =>
      (option.textContent ?? '').includes('NL'),
    );
    expect(nlOption).toBeTruthy();
    expect(nlOption?.getAttribute('tabindex')).not.toBe('-1');

    nlOption?.focus();
    expect(
      document.activeElement === nlOption ||
        nlOption?.contains(document.activeElement),
    ).toBe(true);

    nlOption?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();

    if (service.locale() !== 'nl') {
      nlOption?.click();
      fixture.detectChanges();
    }

    expect(service.locale()).toBe('nl');
  });

  it('should emit avatarMenuOpenChange when the avatar menu opens and closes', () => {
    const openSpy = jasmine.createSpy('avatarMenuOpenChange');
    fixture.componentRef.setInput('avatarMenuItems', [
      { label: 'Export', icon: 'bi bi-download', id: 'session-export' },
    ]);
    fixture.componentInstance.avatarMenuOpenChange.subscribe(openSpy);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.c-top-nav__avatar-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledWith(true);

    trigger.click();
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledWith(false);
  });
});

describe('TopNavComponent (nl)', () => {
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(async () => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [TopNavComponent],
      providers: providePdsLocale('nl'),
    }).compileComponents();

    fixture = TestBed.createComponent(TopNavComponent);
    fixture.componentRef.setInput('breadcrumbs', [{ label: 'Home' }]);
    fixture.componentRef.setInput('avatarInitials', 'IS');
    fixture.componentRef.setInput('showAvatarMenu', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  it('should use the Dutch avatar menu label', () => {
    const trigger = fixture.nativeElement.querySelector(
      '.c-top-nav__avatar-trigger',
    ) as HTMLButtonElement;

    expect(trigger.getAttribute('aria-label')).toBe('Gebruikersmenu');
  });
});
