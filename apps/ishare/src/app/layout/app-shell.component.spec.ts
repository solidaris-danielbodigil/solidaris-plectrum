import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppShellComponent } from './app-shell.component';
import {
  AffiliateHeaderService,
  type AffiliateHeaderData,
} from './affiliate-header.service';
import { BreadcrumbService } from './breadcrumb.service';
import { TestingSessionMenuService } from './testing-session-menu.service';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let router: Router;
  let location: Location;
  let affiliateHeaderService: AffiliateHeaderService;

  const headerData = (
    overrides: Partial<AffiliateHeaderData> = {},
  ): AffiliateHeaderData => ({
    title: 'Eva Martinez',
    variant: 'default',
    avatarGender: 'female',
    avatarVariant: 1,
    avatarInitials: 'EM',
    statusAction: {
      label: 'Actions à réaliser',
      severity: 'warn',
      menuItems: [
        { id: 'c4', label: 'C4 non reçu' },
        { id: 'other', label: 'Autre action', disabled: true },
      ],
    },
    infoTags: [
      {
        label: 'Documents actifs:',
        value: '6',
        filterKey: 'active-documents',
        active: false,
      },
    ],
    identifiers: [{ label: 'NISS', value: '63092814612' }],
    primaryAction: { label: 'Voir carte affilié', shortcut: 'ALT + A' },
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter([]),
        BreadcrumbService,
        AffiliateHeaderService,
        MessageService,
        TestingSessionMenuService,
      ],
    }).compileComponents();

    component = TestBed.createComponent(AppShellComponent).componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    affiliateHeaderService = TestBed.inject(AffiliateHeaderService);
  });

  function renderShell() {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should render the affiliate profile header with Figma default icons', () => {
    affiliateHeaderService.setHeader(headerData());
    const fixture = renderShell();
    const host: HTMLElement = fixture.nativeElement;

    const header = host.querySelector('pds-profile-header');
    expect(header).toBeTruthy();
    expect(header?.classList).toContain('c-profile-header--warning');
    expect(host.querySelector('pds-profile-card')).toBeNull();

    const name = host.querySelector(
      '[data-telemetry-id="profile-header-name-action"]',
    );
    expect(name?.textContent).toContain('Eva Martinez');
    expect(name?.getAttribute('aria-keyshortcuts')).toBe('Alt+A');
    expect(
      name?.querySelector('.c-profile-header__name-icon')?.classList,
    ).toContain('bi-person-square');

    const status = host.querySelector(
      '[data-telemetry-id="profile-header-status-action"]',
    );
    expect(
      status?.querySelector('.c-profile-header__status-icon')?.classList,
    ).toContain('bi-exclamation-triangle');
    expect(host.querySelector('.bi-exclamation-triangle-fill')).toBeNull();
    expect(host.querySelector('.bi-eye')).toBeNull();
  });

  it('should forward the profile header outputs to the header callbacks', async () => {
    const onPrimaryActionClick = vi.fn();
    const onInfoTagClick = vi.fn();
    affiliateHeaderService.setHeader(
      headerData({ onPrimaryActionClick, onInfoTagClick }),
    );
    const fixture = renderShell();
    const host: HTMLElement = fixture.nativeElement;

    (
      host.querySelector(
        '[data-telemetry-id="profile-header-name-action"]',
      ) as HTMLButtonElement
    ).click();
    expect(onPrimaryActionClick).toHaveBeenCalledTimes(1);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', altKey: true }),
    );
    expect(onPrimaryActionClick).toHaveBeenCalledTimes(2);

    // Quick filters are PrimeNG ToggleButtons (role=button, aria-pressed).
    const filterToggle = host.querySelector(
      'p-togglebutton.c-profile-header__info-tag',
    ) as HTMLElement;
    expect(filterToggle.getAttribute('role')).toBe('button');
    filterToggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(onInfoTagClick).toHaveBeenCalledWith(
      expect.objectContaining({ filterKey: 'active-documents' }),
    );
    expect(filterToggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('should render a loading profile header while the affiliate loads', () => {
    affiliateHeaderService.setHeaderLoading(true);
    const fixture = renderShell();

    const header = fixture.nativeElement.querySelector('pds-profile-header');
    expect(header?.classList).toContain('is-loading');
    expect(header?.classList).toContain('c-profile-header--warning');
  });

  it('should navigate back in browser history when history exists', () => {
    vi.spyOn(
      component as unknown as {
        canNavigateBack: () => boolean;
      },
      'canNavigateBack',
    ).mockReturnValue(true);
    const backSpy = vi.spyOn(location, 'back').mockImplementation(() => undefined);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onBackClick();

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should fall back to /home when there is no browser history', () => {
    vi.spyOn(
      component as unknown as {
        canNavigateBack: () => boolean;
      },
      'canNavigateBack',
    ).mockReturnValue(false);
    const backSpy = vi.spyOn(location, 'back').mockImplementation(() => undefined);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onBackClick();

    expect(backSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
