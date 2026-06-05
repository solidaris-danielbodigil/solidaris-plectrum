import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';
import { of } from 'rxjs';

@Component({
  selector: 'fba-shadows',
  templateUrl: './shadows.component.html',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
})
export class ShadowsComponent {
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

  public shadowsList = [
    { id: 'default', label: 'default' },
    { id: 'focus', label: 'focus' },
    { id: 'warning', label: 'warning' },
    { id: 'error', label: 'error' },
  ];

  public shadowTypeValue: string;

  protected readonly of = of;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public copyShadowValue(shadow: string): void {
    this.clipboard.copy(shadow);
    this.toast.pushToast(`Copied "${shadow}" to clipboard`, ToastType.success);
  }
}
