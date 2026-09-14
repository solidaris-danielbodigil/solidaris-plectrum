import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { EmptyStateComponent } from '@solidaris/ui';
import { injectIgedMessages } from '../i18n';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import {
  activeSubNavItemIdFromUrl,
  buildSubNavSections,
  domainIdFromUrl,
} from '../layout/nav.config';

@Component({
  selector: 'app-stub-page',
  standalone: true,
  imports: [EmptyStateComponent],
  templateUrl: './stub-page.component.html',
  host: {
    class:
      'o-flex o-flex--y o-flex--align-items-center o-flex--justify-content-center o-flex__item o-flex__item--grow-1 o-layout o-layout--min-h-0',
  },
})
export class StubPageComponent {
  private readonly router = inject(Router);
  private readonly breadcrumbs = inject(BreadcrumbService);
  readonly copy = injectIgedMessages();

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly pageTitle = computed(() => {
    const copy = this.copy();
    const url = this.currentUrl() ?? '';
    const domainId = domainIdFromUrl(url);
    const itemId = activeSubNavItemIdFromUrl(url);
    const item = buildSubNavSections(copy)
      .flatMap((section) => section.items)
      .find((entry) => entry.id === itemId);
    return item?.label ?? copy.comingSoonItem;
  });

  constructor() {
    effect(() => {
      const messages = this.copy();
      this.breadcrumbs.setBreadcrumbs([
        { label: messages.domains[domainIdFromUrl(this.currentUrl() ?? '')] },
        { label: this.pageTitle() },
      ]);
    });
  }
}
