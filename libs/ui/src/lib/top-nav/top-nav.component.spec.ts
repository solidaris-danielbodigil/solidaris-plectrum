import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavComponent } from './top-nav.component';
import type { MenuItem } from 'primeng/api';

describe('TopNavComponent', () => {
  let fixture: ComponentFixture<TopNavComponent>;
  let component: TopNavComponent;

  const breadcrumbs: MenuItem[] = [{ label: 'Home' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
    fixture.componentRef.setInput('avatarInitials', 'IS');
    fixture.detectChanges();
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

  it('should render capture timer as a separate badge with a stable label', () => {
    fixture.componentRef.setInput('avatarMenuItems', [
      {
        label: 'Arrêter la session test',
        icon: 'bi bi-stop-circle',
        id: 'session-stop',
        badge: '02:34',
      },
    ]);
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
    const timer = link?.querySelector('.c-top-nav__menu-timer');

    expect(label?.textContent).toBe('Arrêter la session test');
    expect(timer?.textContent).toBe('02:34');
    expect(link?.getAttribute('aria-label')).toBe('Arrêter la session test (02:34)');
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
