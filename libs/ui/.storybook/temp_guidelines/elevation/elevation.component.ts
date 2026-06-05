import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { ToastService, ToastType } from '@fba/event';
import { of } from 'rxjs';

export interface ElevationList {
  type: string;
  status: Array<string>;
}
@Component({
  selector: 'fba-elevation',
  templateUrl: './elevation.component.html',
  /* eslint-disable @angular-eslint/prefer-standalone */
  standalone: false,
})
export class ElevationComponent implements OnInit {
  public selectedType: ElevationList = { type: '', status: [] };

  public elevationTypeValue: string;

  public elevationScaleValue: string;

  public elevationDirectionValue: string;

  public directionsList: Array<{ id: string; label: string }> = [];

  public typesList: Array<{ id: string; label: string }> = [];

  public elevationClass: string;

  public directions = [
    { id: 'top', label: 'top', icon: 'direction-top' },
    { id: 'right', label: 'right', icon: 'direction-right' },
    { id: 'bottom', label: 'bottom', icon: 'direction-bottom' },
    { id: 'left', label: 'left', icon: 'direction-left' },
    { id: 'corner-1', label: 'corner-1', icon: 'direction-corner-1' },
    { id: 'corner-2', label: 'corner-2', icon: 'direction-corner-2' },
    { id: 'corner-3', label: 'corner-3', icon: 'direction-corner-3' },
    { id: 'corner-4', label: 'corner-4', icon: 'direction-corner-4' },
  ];

  public shadow = true;

  public shadowsList = [
    { id: 'default', label: 'default' },
    { id: 'focus', label: 'focus' },
    { id: 'warning', label: 'warning' },
    { id: 'error', label: 'error' },
  ];

  public scaleList = [
    { id: '1', label: '1' },
    { id: '2', label: '2' },
    { id: '3', label: '3' },
    { id: '4', label: '4' },
    { id: '5', label: '5' },
  ];

  public elevationList = [
    {
      type: [{ id: 'under', label: 'under' }],
    },
    {
      type: [{ id: 'raised', label: 'raised' }],
    },
    {
      type: [{ id: 'sticky', label: 'sticky' }],
    },
    {
      type: [{ id: 'high-raised', label: 'high-raised' }],
    },
    {
      type: [{ id: 'overlays', label: 'overlays' }],
    },
    {
      type: [{ id: 'blocking-overlays', label: 'blocking-overlays' }],
    },
  ];

  protected readonly of = of;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastService,
  ) {}

  public isElevationShadow() {
    this.shadow = !this.shadow;
    this.getElevationClass();
    if (!this.shadow) {
      this.removeDirectionValue();
    }
  }

  public getElevationClass() {
    this.elevationClass =
      (this.elevationTypeValue ? this.elevationTypeValue : '') +
      (this.elevationScaleValue &&
      this.elevationTypeValue &&
      this.elevationScaleValue !== '1'
        ? `-${this.elevationScaleValue}`
        : '') +
      (!this.shadow ? '-shadow-none' : '') +
      (this.elevationDirectionValue ? `-${this.elevationDirectionValue}` : '');
  }

  public removeElevationClass() {
    if (this.elevationTypeValue || this.elevationScaleValue) {
      const oldItems = document.querySelectorAll(
        '.storybook__elevation-example-item',
      );

      for (const oldItem of oldItems) {
        if (
          oldItem.classList.contains(
            'storybook__elevation-example-item--active',
          )
        ) {
          oldItem.classList.remove('storybook__elevation-example-item--active');
        }
      }
    }
  }

  public addElevationClass() {
    const exampleItem = document.querySelector(
      `.storybook__elevation-example-${this.elevationTypeValue}-${this.elevationScaleValue}`,
    );
    exampleItem.classList.add('storybook__elevation-example-item--active');
  }

  public getElevationType(value: string | null) {
    this.elevationScaleValue = '1';
    this.elevationTypeValue = value;
    this.elevationDirectionValue = 'bottom';
    this.removeElevationClass();
    this.getElevationClass();
    for (const elevation of this.elevationList) {
      if (elevation.type[0].id === value) {
        this.addElevationClass();
        return value;
      }
    }
    return null;
  }

  public getElevationScale(value: string | null) {
    this.elevationScaleValue = value;
    this.getElevationClass();
    this.removeElevationClass();
    this.addElevationClass();

    for (const scale of this.scaleList) {
      if (scale.id === value) {
        return value;
      }
    }
    return null;
  }

  public getElevationDirection(value: string | null) {
    for (const direction of this.directions) {
      if (direction.id === value) {
        this.elevationDirectionValue = value;
        this.getElevationClass();
        return value;
      }
    }
    return null;
  }

  public ngOnInit(): void {
    for (const elevation of this.elevationList) {
      this.typesList = [...this.typesList, ...elevation.type];
    }
    this.directionsList = this.directions;
    this.getElevationClass();
  }

  public removeTypeValue() {
    this.elevationTypeValue = '';
    this.elevationDirectionValue = '';
    this.elevationScaleValue = '';
    this.shadow = true;
    this.getElevationClass();
    this.removeElevationClass();
  }

  public removeScaleValue() {
    this.elevationScaleValue = '';
    this.shadow = true;
    this.elevationDirectionValue = '';
    this.getElevationClass();
    this.removeElevationClass();
  }

  public removeDirectionValue() {
    this.elevationDirectionValue = '';
    this.getElevationClass();
  }

  public copyElevationValue(elevation: string): void {
    this.clipboard.copy(elevation);
    this.toast.pushToast(
      `Copied "${elevation}" to clipboard`,
      ToastType.success,
    );
  }
}
