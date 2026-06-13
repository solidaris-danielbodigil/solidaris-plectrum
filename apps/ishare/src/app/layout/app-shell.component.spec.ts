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
    spyOn(component as unknown as { canNavigateBack: () => boolean }, 'canNavigateBack').and.returnValue(
      true,
    );
    const backSpy = spyOn(location, 'back');
    const navigateSpy = spyOn(router, 'navigate');

    component.onBackClick();

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should fall back to /home when there is no browser history', () => {
    spyOn(component as unknown as { canNavigateBack: () => boolean }, 'canNavigateBack').and.returnValue(
      false,
    );
    const backSpy = spyOn(location, 'back');
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    component.onBackClick();

    expect(backSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/home']);
  });
});
