import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppShellComponent } from './app-shell.component';
import { AffiliateHeaderService } from './affiliate-header.service';
import { BreadcrumbService } from './breadcrumb.service';
import { TestingSessionMenuService } from './testing-session-menu.service';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let router: Router;
  let location: Location;

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
