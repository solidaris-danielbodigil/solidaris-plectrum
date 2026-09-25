import { DOCUMENT, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import type { MenuItem } from 'primeng/api';
import {
  NavShellComponent,
  SubNavShellComponent,
  TopNavComponent,
  plectrumAppsNavItems,
} from '@solidaris-danielbodigil/ui';
import { injectIgedMessages } from '../i18n';
import { BreadcrumbService } from './breadcrumb.service';
import { activeSubNavItemIdFromUrl, buildSubNavSections } from './nav.config';
import { ShellSearchService } from './shell-search.service';

const HOME_PATH = '/dashboard/vue-ensemble';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    NavShellComponent,
    SubNavShellComponent,
    TopNavComponent,
  ],
  templateUrl: './app-shell.component.html',
  host: {
    class:
      'o-layout o-layout--block o-layout--full-dvh o-layout--contain-paint o-layout--min-h-0 o-layout--overflow-hidden',
  },
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly search = inject(ShellSearchService);
  readonly copy = injectIgedMessages();

  readonly navItems = plectrumAppsNavItems('iged');
  readonly activeAppId = 'iged';

  readonly subNavExpanded = signal(true);
  readonly subNavControlsId = 'iged-sub-nav';

  readonly homeBreadcrumb: MenuItem = {
    icon: 'bi bi-house',
    routerLink: '/dashboard/vue-ensemble',
  };

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly activeSubNavItemId = computed(() =>
    activeSubNavItemIdFromUrl(this.currentUrl() ?? ''),
  );

  readonly subNavSections = computed(() => buildSubNavSections(this.copy()));

  readonly subNavTitle = computed(() => this.copy().appTitle);

  readonly breadcrumbs = this.breadcrumbService.breadcrumbs;

  readonly showBackButton = computed(() => {
    const path = (this.currentUrl() ?? '').split('?')[0] ?? '';
    return path !== HOME_PATH && path !== '/' && path !== '';
  });

  onBackClick(): void {
    if (this.canNavigateBack()) {
      this.location.back();
      return;
    }

    void this.router.navigateByUrl(HOME_PATH);
  }

  private canNavigateBack(): boolean {
    return (this.document.defaultView?.history.length ?? 1) > 1;
  }

  onSubNavExpandedChange(next: boolean): void {
    this.subNavExpanded.set(next);
  }

  onSearchQueryChange(query: string): void {
    this.search.setQuery(query);
  }

  onSearchSubmit(query: string): void {
    this.search.setQuery(query);
  }
}
