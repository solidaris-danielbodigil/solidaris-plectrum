import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavShellComponent, TopNavComponent, AffiliateOverviewCardComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);
  private readonly messageService = inject(MessageService);

  readonly navItems = ISHARE_NAV_ITEMS;

  readonly homeBreadcrumb: MenuItem = {
    icon: 'bi bi-house',
    routerLink: '/home',
  };

  readonly breadcrumbs = this.breadcrumbService.breadcrumbs;
  readonly affiliateHeader = this.affiliateHeaderService.header;

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
