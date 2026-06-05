import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface InterfaceTypoClass {
  key: string;
  type: 'semantic' | 'generic';
}

@Component({
  selector: 'fba-typography',
  templateUrl: './typography.component.html',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
})
export class TypographyComponent implements OnInit, OnDestroy {
  @Input() public typoType: string;

  public categories: { [category: string]: Array<InterfaceTypoClass> } = {};

  public typoClasses: Array<InterfaceTypoClass>;

  public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public createCategories(): void {
    this.categories = {}; // clear the categories object before regrouping
    const searchLower = this.search$.getValue().toLowerCase();

    this.typoClasses.forEach((typoClass) => {
      if (
        typoClass.type === this.typoType &&
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

  public getTypoClasses(): Array<InterfaceTypoClass> {
    const genericClassRegex = /^\.typo__\w+--\w+--\w+$/;

    return Array.from(document.styleSheets)
      .filter(
        (sheet) =>
          sheet.href === null || sheet.href.startsWith(window.location.origin),
      )
      .reduce((acc: Array<InterfaceTypoClass>, sheet: CSSStyleSheet) => {
        const typoClasses = Array.from(sheet.cssRules).reduce(
          (acc: Array<string>, rule: CSSRule) => {
            if (rule instanceof CSSStyleRule) {
              const selectors = rule.selectorText
                .split(',')
                .map((s) => s.trim());
              const typoSelectors = selectors.filter((sel) =>
                sel.startsWith('.typo__'),
              );

              return acc.concat(typoSelectors);
            }
            return acc;
          },
          [],
        );

        const classTags = typoClasses.map((selector) => ({
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
    this.typoClasses = this.getTypoClasses();
    this.search$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.createCategories();
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
