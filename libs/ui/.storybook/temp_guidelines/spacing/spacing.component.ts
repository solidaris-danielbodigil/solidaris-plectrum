import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';

@Component({
  selector: 'fba-spacing',
  templateUrl: './spacing.component.html',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
})
export class SpacingComponent implements OnInit {
  public spacingClasses: Array<string>;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public copySpacingClassName(className: string): void {
    this.clipboard.copy(className);
    this.toast.pushToast(
      `Copied "${className}" to clipboard`,
      ToastType.success,
    );
  }

  public collectSpacingRootVariables(cssRules: CSSRuleList): Array<string> {
    return Array.from(cssRules).reduce((acc, rule) => {
      if (rule instanceof CSSStyleRule) {
        const selectors = rule.selectorText.split(',').map((sel) => sel.trim());
        if (selectors.includes(':root')) {
          return [
            ...acc,
            ...Array.from(rule.style).filter((name) =>
              name.startsWith('--spacing-'),
            ),
          ];
        }
      }
      return acc;
    }, [] as Array<string>);
  }

  public getSpacingClasses(): Array<string> {
    return Array.from(document.styleSheets)
      .filter(
        (sheet) =>
          sheet.href === null || sheet.href.startsWith(window.location.origin),
      )
      .reduce((acc, sheet) => {
        const rootVars = this.collectSpacingRootVariables(sheet.cssRules);
        const newAcc = [...acc];

        rootVars?.forEach((varName) => {
          if (!newAcc.includes(varName)) {
            newAcc.push(varName);
          }
        });

        return newAcc;
      }, [] as Array<string>);
  }

  public ngOnInit() {
    this.spacingClasses = this.getSpacingClasses();
  }
}
