import { Clipboard } from '@angular/cdk/clipboard';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';
import { getColors } from '@fleetbridge-app/util';
import { background } from '@storybook/theming';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'fba-colors-palette',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
  template: `
    <div class="o-flex o-flex--col o-layout o-layout--gap-3">
      <fba-search-bar>
        <fba-input-search>
          <fba-search
            placeHolderText="Search for a Color"
            [value]="search$.asObservable() | async"
            (valueChange)="search$.next($event)"
          ></fba-search>
        </fba-input-search>
      </fba-search-bar>
      @for (category of getCategories(); track category) {
        <div class="semantic-colors__categories">
          @if (
            (paletteType === 'palette' && category === 'palette') ||
            (paletteType !== 'palette' && category !== 'palette')
          ) {
            <h2 class="typo__h2 css-wzniqs" id="{{ category }}">
              <a
                aria-hidden="true"
                href="#{{ category }}"
                tabindex="-1"
                target="_self"
                class="css-1ofkq6d"
                ><svg
                  viewBox="0 0 14 14"
                  width="14px"
                  height="14px"
                  class="css-149xqrd"
                >
                  <path
                    d="M11.84 2.16a2.25 2.25 0 0 0-3.18 0l-2.5 2.5c-.88.88-.88 2.3 0 3.18a.5.5 0 0 1-.7.7 3.25 3.25 0 0 1 0-4.59l2.5-2.5a3.25 3.25 0 0 1 4.59 4.6L10.48 8.1c.04-.44.01-.89-.09-1.32l1.45-1.45c.88-.88.88-2.3 0-3.18Z"
                  ></path>
                  <path
                    d="M3.6 7.2c-.1-.42-.12-.87-.08-1.31L1.45 7.95a3.25 3.25 0 1 0 4.6 4.6l2.5-2.5a3.25 3.25 0 0 0 0-4.6.5.5 0 0 0-.7.7c.87.89.87 2.31 0 3.2l-2.5 2.5a2.25 2.25 0 1 1-3.2-3.2l1.46-1.44Z"
                  ></path></svg
              ></a>
              {{ category }}
            </h2>
            @for (
              subcategory of getSubCategories(category);
              track subcategory
            ) {
              <div class="semantic-colors__subcategories">
                <h3 class="typo__h3 css-wzniqs" id="{{ subcategory }}">
                  <a
                    aria-hidden="true"
                    href="#{{ subcategory }}"
                    tabindex="-1"
                    target="_self"
                    class="css-1ofkq6d"
                    ><svg
                      viewBox="0 0 14 14"
                      width="14px"
                      height="14px"
                      class="css-149xqrd"
                    >
                      <path
                        d="M11.84 2.16a2.25 2.25 0 0 0-3.18 0l-2.5 2.5c-.88.88-.88 2.3 0 3.18a.5.5 0 0 1-.7.7 3.25 3.25 0 0 1 0-4.59l2.5-2.5a3.25 3.25 0 0 1 4.59 4.6L10.48 8.1c.04-.44.01-.89-.09-1.32l1.45-1.45c.88-.88.88-2.3 0-3.18Z"
                      ></path>
                      <path
                        d="M3.6 7.2c-.1-.42-.12-.87-.08-1.31L1.45 7.95a3.25 3.25 0 1 0 4.6 4.6l2.5-2.5a3.25 3.25 0 0 0 0-4.6.5.5 0 0 0-.7.7c.87.89.87 2.31 0 3.2l-2.5 2.5a2.25 2.25 0 1 1-3.2-3.2l1.46-1.44Z"
                      ></path></svg
                  ></a>
                  {{ subcategory }}
                </h3>
                <fba-card [elevated]="true" class="foundations-tokens__wrapper">
                  @for (
                    colorProperty of getColorProperties(category, subcategory);
                    track colorProperty
                  ) {
                    <fba-card
                      class="foundations-tokens__item o-flex o-flex--col"
                      [clickable]="true"
                      [outlined]="true"
                      (click)="copyColorValue(colorProperty[0])"
                    >
                      <div class="o-flex o-layout o-layout--gap-3">
                        <div
                          class="o-flex o-flex--y o-flex__item o-layout o-layout--gap-1"
                        >
                          <label class="foundations-tokens__theme-label"
                            >Light</label
                          >
                          <fba-card
                            [outlined]="true"
                            class="foundations-tokens__value o-flex__item"
                            [style.background]="colorProperty[0]"
                          >
                          </fba-card>
                        </div>
                        <div
                          class="o-flex o-flex--y o-flex__item o-layout o-layout--gap-1"
                        >
                          <label class="foundations-tokens__theme-label"
                            >Dark</label
                          >
                          <fba-card
                            [outlined]="true"
                            class="storybook-dark-theme foundations-tokens__value o-flex__item"
                            [style.background]="colorProperty[0]"
                          >
                          </fba-card>
                        </div>
                      </div>
                      <button
                        class="foundations-tokens__copy-btn"
                        [fbaButton]="'primary'"
                        [size]="'small'"
                      >
                        <fba-icon icon="copy"></fba-icon>
                      </button>
                      <label class="foundations-tokens__token"
                        >{{ colorProperty[0] }}
                      </label>
                    </fba-card>
                  }
                </fba-card>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
})
export class ColorsPaletteComponent implements OnInit {
  @HostBinding('class.semantic-colors') public baseClass = true;

  @Input() public paletteType: string;

  public colors: any;

  public args: any;

  public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  protected readonly background = background;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public copyColorValue(color: string): void {
    this.clipboard.copy(color);
    this.toast.pushToast(`Copied "${color}" to clipboard`, ToastType.success);
  }

  public ngOnInit() {
    this.colors = getColors();
  }

  public matchedColors(): unknown {
    let colorsCopy = JSON.parse(JSON.stringify(this.colors)); // deep copy original colors
    const search = this.search$.getValue();
    if (search) {
      colorsCopy = this.filterColors(colorsCopy, search);
    }
    return colorsCopy;
  }

  public getCategories() {
    return Object.keys(this.matchedColors());
  }

  public getSubCategories(category: string) {
    return Object.keys(this.matchedColors()[category]);
  }

  public getColorProperties(category: string, subcategory: string): Array<any> {
    return Object.entries(this.matchedColors()[category][subcategory]);
  }

  private filterColors(inputColors, search): unknown {
    const colors = { ...inputColors }; // Make a shallow copy to avoid mutating input parameter
    const searchLower = search.toLowerCase();

    for (const cat in colors) {
      if (Object.prototype.hasOwnProperty.call(colors, cat)) {
        for (const subcat in colors[cat]) {
          if (Object.prototype.hasOwnProperty.call(colors[cat], subcat)) {
            const subColors = colors[cat][subcat];
            const keysToRemove = Object.keys(subColors).filter(
              (key) => !key.toLowerCase().includes(searchLower),
            );

            keysToRemove.forEach((key) => delete subColors[key]);

            if (Object.keys(subColors).length === 0) {
              delete colors[cat][subcat];
            }
          }
        }

        if (Object.keys(colors[cat]).length === 0) {
          delete colors[cat];
        }
      }
    }

    return colors;
  }
}
