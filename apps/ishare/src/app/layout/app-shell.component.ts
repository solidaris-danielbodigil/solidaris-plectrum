import { DOCUMENT, Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import type { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {
  AffiliateOverviewCardComponent,
  NavShellComponent,
  TopNavComponent,
  type AffiliateOverviewIdentifier,
  type AffiliateOverviewInfoTag,
} from '@solidaris/ui';
import { AffiliateHeaderService, type AffiliateHeaderData } from './affiliate-header.service';
import { BreadcrumbService } from './breadcrumb.service';
import { ISHARE_NAV_ITEMS } from './nav-items';
import { TestingSessionMenuService } from './testing-session-menu.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavShellComponent, TopNavComponent, AffiliateOverviewCardComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);
  private readonly messageService = inject(MessageService);
  private readonly testingSessionMenu = inject(TestingSessionMenuService);

  readonly navItems = ISHARE_NAV_ITEMS;
  readonly testingTelemetryEnabled = environment.enableTestingTelemetry;
  readonly testingMenuItems = this.testingSessionMenu.menuItems;

  readonly homeBreadcrumb: MenuItem = {
    icon: 'bi bi-house',
    routerLink: '/home',
  };

  readonly breadcrumbs = this.breadcrumbService.breadcrumbs;
  readonly affiliateHeader = this.affiliateHeaderService.header;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly showBackButton = computed(() =>
    (this.currentUrl() ?? '').includes('/affiliate/'),
  );

  onAvatarMenuOpenChange(open: boolean): void {
    if (this.testingTelemetryEnabled) {
      this.testingSessionMenu.setMenuOpen(open);
    }
  }

  onBackClick(): void {
    if (this.canNavigateBack()) {
      this.location.back();
      return;
    }

    void this.router.navigate(['/home']);
  }

  private canNavigateBack(): boolean {
    return (this.document.defaultView?.history.length ?? 1) > 1;
  }

  onIdentifierCopy(identifier: AffiliateOverviewIdentifier): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
    });
  }

  onPrimaryActionClick(header: AffiliateHeaderData): void {
    header.onPrimaryActionClick?.();
  }

  onStatusActionClick(header: AffiliateHeaderData): void {
    header.onStatusActionClick?.();
  }

  onInfoTagClick(header: AffiliateHeaderData, tag: AffiliateOverviewInfoTag): void {
    header.onInfoTagClick?.(tag);
  }
}
