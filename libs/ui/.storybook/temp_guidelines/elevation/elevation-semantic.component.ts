import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';
import { of } from 'rxjs';
/*
interface InterfaceElevationClass {
  key: string;
  type: 'semantic' | 'generic';
} */

@Component({
  selector: 'fba-elevation-semantic',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
  templateUrl: './elevation-semantic.component.html',
})
export class ElevationSemanticComponent {
  /* @Input() public elevationType: string;

  public categories: { [category: string]: Array<InterfaceElevationClass> } =
    {};

  public elevationClasses: Array<InterfaceElevationClass>;

  public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public createCategories(): void {
    this.categories = {}; // clear the categories object before regrouping
    const searchLower = this.search$.getValue().toLowerCase();

    this.elevationClasses.forEach((typoClass) => {
      if (
        typoClass.type === this.elevationType &&
        typoClass.key.toLowerCase().includes(searchLower)
      ) {
        const category =
          typoClass.type === 'generic'
            ? typoClass.key.split('__')[1].split('--')[0]
            : typoClass.key.split('__')[1];

        if (this.categories[category]) {
          this.categories[category].push(typoClass);
        } else {
          this.categories[category] = [typoClass];
        }
      }
    });
  }

  public getBemBlock(className: string): Array<string> {
    const baseClass = className.substr(0, className.indexOf('--'));
    return [className, baseClass];
  }

  public copyTypoClassName(className: string): void {
    this.clipboard.copy(className);
    this.toast.pushToast(
      `Copied "${className}" to clipboard`,
      ToastType.success,
    );
  }

  public getElevationClasses(): Array<InterfaceElevationClass> {
    const genericClassRegex = /^\.elevation__w+$/;

    return Array.from(document.styleSheets)
      .filter(
        (sheet) =>
          sheet.href === null || sheet.href.startsWith(window.location.origin),
      )
      .reduce((acc: Array<InterfaceElevationClass>, sheet: CSSStyleSheet) => {
        const elevationClasses = Array.from(sheet.cssRules).reduce(
          (acc: Array<string>, rule: CSSRule) => {
            if (rule instanceof CSSStyleRule) {
              const selectors = rule.selectorText
                .split(',')
                .map((s) => s.trim());
              const typoSelectors = selectors.filter((sel) =>
                sel.startsWith('.elevation__'),
              );

              return acc.concat(typoSelectors);
            }
            return acc;
          },
          [],
        );

        const classTags = elevationClasses.map((selector) => ({
          key: selector,
          type: genericClassRegex.test(selector)
            ? ('generic' as const)
            : ('semantic' as const),
        }));

        classTags.forEach((tag) => {
          if (!acc.find((item) => item.key === tag.key)) {
            acc.push(tag);
          }
        });

        return acc;
      }, []);
  }

  public ngOnInit() {
    this.elevationClasses = this.getElevationClasses();
    this.search$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.createCategories();
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  } */

  public elevationsList = [
    { id: 'card', label: 'card' },
    { id: 'card-clickable', label: 'card-clickable' },
    { id: 'header-elevated', label: 'header-elevated' },
    { id: 'overlay', label: 'overlay' },
    { id: 'comment', label: 'comment' },
    { id: 'panel-right', label: 'panel-right' },
    { id: 'router-tab', label: 'router-tab' },
    { id: 'scroll', label: 'scroll' },
    { id: 'sidenav', label: 'sidenav' },
  ];

  public elevationTypeValue: string;

  protected readonly of = of;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public copyElevationValue(elevation: string): void {
    this.clipboard.copy(elevation);
    this.toast.pushToast(
      `Copied "${elevation}" to clipboard`,
      ToastType.success,
    );
  }
}
