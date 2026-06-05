import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';
import { Observable, of } from 'rxjs';

export interface BorderList {
  type: string;
  status: Array<string>;
}

@Component({
  selector: 'fba-borders',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
  templateUrl: './borders.component.html',
})
export class BordersComponent implements OnInit {
  @Input() public type: any;

  @Input() public status: any;

  public borderTypeValue: string;

  public borderStatusValue: string;

  public directional: boolean;

  public borderRadiusValue: boolean;

  public borderDirectionValue: string;

  public isDirectional = true;

  public isDirectionalRadius: boolean;

  public selectedType: BorderList = { type: '', status: [] };

  // eslint-disable-next-line class-methods-use-this

  public typesList: Array<{ id: string; label: string }> = [];

  public statusList: Array<{
    id: string;
    label: string;
    directional: boolean;
  }> = [];

  public directionsList: Array<{ id: string; label: string }> = [];

  public selectedOptions: Observable<string>;

  public radiusOptions: Array<{ id: number; label: string }> = [
    { id: 1, label: 'Direction' },
    { id: 2, label: 'Radius Direction' },
  ];

  public directions = [
    { id: 'horizontal', label: 'horizontal', icon: 'direction-horizontal' },
    { id: 'vertical', label: 'vertical', icon: 'direction-vertical' },
    { id: 'top', label: 'top', icon: 'direction-top' },
    { id: 'right', label: 'right', icon: 'direction-right' },
    { id: 'bottom', label: 'bottom', icon: 'direction-bottom' },
    { id: 'left', label: 'left', icon: 'direction-left' },
    { id: 'no-right', label: 'no-right', icon: 'direction-no-right' },
    { id: 'no-left', label: 'no-left', icon: 'direction-no-left' },
    { id: 'no-top', label: 'no-top', icon: 'direction-no-top' },
    { id: 'no-bottom', label: 'no-bottom', icon: 'direction-no-bottom' },
    { id: 'corner-1', label: 'corner-1', icon: 'direction-corner-1' },
    { id: 'corner-2', label: 'corner-2', icon: 'direction-corner-2' },
    { id: 'corner-3', label: 'corner-3', icon: 'direction-corner-3' },
    { id: 'corner-4', label: 'corner-4', icon: 'direction-corner-4' },
  ];

  public radiusDirections = [
    { id: 'top', label: 'top', icon: 'radius-direction-top' },
    { id: 'right', label: 'right', icon: 'radius-direction-right' },
    { id: 'bottom', label: 'bottom', icon: 'radius-direction-bottom' },
    { id: 'left', label: 'left', icon: 'radius-direction-left' },
    { id: 'corner-1', label: 'corner-1', icon: 'radius-direction-corner-1' },
    { id: 'corner-2', label: 'corner-2', icon: 'radius-direction-corner-2' },
    { id: 'corner-3', label: 'corner-3', icon: 'radius-direction-corner-3' },
    { id: 'corner-4', label: 'corner-4', icon: 'radius-direction-corner-4' },
  ];

  public borderList = [
    {
      type: [{ id: 'default', label: 'default' }],
      status: [],
      directional: true,
    },
    {
      type: [{ id: 'divider', label: 'divider' }],
      status: [
        { id: 'blue', label: 'blue', directional: true },
        { id: 'primary', label: 'primary', directional: true },
      ],
      directional: true,
    },
    {
      type: [{ id: 'special', label: 'special' }],
      status: [
        { id: 'circle', label: 'circle', directional: false },
        { id: 'dark', label: 'dark', directional: true },
        { id: 'none', label: 'none', directional: false },
        { id: 'rounded', label: 'rounded', directional: false },
      ],
      directional: true,
    },
    {
      type: [{ id: 'input', label: 'input' }],
      status: [
        { id: 'error', label: 'error', directional: true },
        { id: 'error-focus', label: 'error-focus', directional: false },
        { id: 'focus', label: 'focus', directional: false },
        { id: 'hover', label: 'hover', directional: true },
        { id: 'disabled', label: 'disabled', directional: true },
        { id: 'pressed', label: 'pressed', directional: true },
        { id: 'success', label: 'success', directional: true },
        { id: 'warning', label: 'warning', directional: true },
        { id: 'warning-focus', label: 'warning-focus', directional: false },
      ],
      directional: true,
    },
    {
      type: [{ id: 'button', label: 'button' }],
      status: [
        { id: 'active', label: 'active', directional: true },
        { id: 'danger', label: 'danger', directional: true },
        { id: 'primary', label: 'primary', directional: true },
      ],
      directional: true,
    },
    {
      type: [{ id: 'checkbox', label: 'checkbox' }],
      status: [
        { id: 'checked', label: 'checked', directional: false },
        { id: 'hover', label: 'hover', directional: false },
      ],
      directional: false,
    },
    {
      type: [{ id: 'tag', label: 'tag' }],
      status: [
        { id: 'dashed', label: 'dashed', directional: false },
        { id: 'error', label: 'error', directional: false },
        { id: 'processing', label: 'processing', directional: false },
        { id: 'success', label: 'success', directional: false },
        { id: 'warning', label: 'warning', directional: false },
        { id: 'sticker', label: 'sticker', directional: false },
        { id: 'magenta', label: 'magenta', directional: false },
        { id: 'orange', label: 'orange', directional: false },
        { id: 'lime', label: 'lime', directional: false },
        { id: 'cyan', label: 'cyan', directional: false },
        { id: 'blue', label: 'blue', directional: false },
        { id: 'purple', label: 'purple', directional: false },
        { id: 'selection', label: 'selection', directional: false },
        { id: 'gold', label: 'gold', directional: false },
      ],
      directional: false,
    },
    {
      type: [{ id: 'card', label: 'card' }],
      status: [
        { id: 'outlined', label: 'outlined', directional: true },
        { id: 'outlined-none', label: 'outlined-none', directional: true },
        { id: 'elevated', label: 'elevated', directional: false },
        { id: 'both', label: 'both', directional: false },
        { id: 'clickable', label: 'clickable', directional: false },
        { id: 'dashed', label: 'dashed', directional: false },
      ],
      directional: true,
    },
    {
      type: [{ id: 'alert', label: 'alert' }],
      status: [
        { id: 'error', label: 'error', directional: false },
        { id: 'info', label: 'info', directional: false },
        { id: 'success', label: 'success', directional: false },
        { id: 'warning', label: 'warning', directional: false },
        { id: 'warning-empty', label: 'warning-empty', directional: false },
      ],
      directional: false,
    },
    {
      type: [{ id: 'badge', label: 'badge' }],
      status: [{ id: 'ghost-dark', label: 'ghost-dark', directional: false }],
      directional: false,
    },
  ];

  protected readonly of = of;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public allowDirections(value: boolean) {
    this.isDirectional = value;
  }

  public getBorderStatus(value: string | null) {
    this.borderStatusValue = '';
    for (const border of this.borderList) {
      if (border.type[0].id === value) {
        this.statusList = border.status;
        if (value !== 'special') {
          this.allowDirections(border.directional);
        }
        if (!border.directional) {
          this.borderDirectionValue = '';
        }
        return value;
      }
    }
    return null;
  }

  public getBorderStatusValue(value: string | null) {
    for (const status of this.statusList) {
      if (status.id === value) {
        this.allowDirections(status.directional);
        if (!status.directional) {
          this.borderDirectionValue = '';
        }
        return value;
      }
    }
    return null;
  }

  public radiusValue(value: number): void {
    this.borderDirectionValue = '';
    if (value === 2) {
      this.borderRadiusValue = true;
      this.directionsList = this.radiusDirections;
    } else {
      this.borderRadiusValue = false;
      this.directionsList = this.directions;
    }
  }

  public ngOnInit(): void {
    for (const border of this.borderList) {
      this.typesList = [...this.typesList, ...border.type];
    }
    this.directionsList = this.directions;
  }

  public removeTypeValue() {
    this.borderTypeValue = '';
    this.borderStatusValue = '';
  }

  public removeStatusValue() {
    this.borderStatusValue = '';
  }

  public removeDirectionValue() {
    this.borderDirectionValue = '';
  }

  public copyBorderValue(border: string): void {
    this.clipboard.copy(border);
    this.toast.pushToast(`Copied "${border}" to clipboard`, ToastType.success);
  }
}
