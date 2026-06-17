import { Directive, HostBinding, inject, input } from '@angular/core';
import { TESTING_TELEMETRY_ENABLED } from './testing-telemetry-enabled.token';

/**
 * Dev-only: mirrors a visible UI label into `data-test` for moderated user-testing telemetry.
 * Gated by `TESTING_TELEMETRY_ENABLED` (provided by the host app when `enableTestingTelemetry` is true).
 */
@Directive({
  selector: '[pdsTelemetryLabel]',
  standalone: true,
})
export class PdsTelemetryLabelDirective {
  private readonly enabled = inject(TESTING_TELEMETRY_ENABLED);

  readonly label = input.required<string>({ alias: 'pdsTelemetryLabel' });

  @HostBinding('attr.data-test')
  get dataTest(): string | null {
    return this.enabled ? this.label() : null;
  }
}
