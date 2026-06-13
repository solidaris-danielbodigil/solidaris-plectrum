import {
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TestingTelemetryService } from '@solidaris/ui';
import { interval } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestingSessionMenuService {
  private readonly telemetry = inject(TestingTelemetryService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuTick = signal(0);

  readonly enabled = environment.enableTestingTelemetry;

  /**
   * Menu model only changes when capture starts/stops, keeping a stable object identity
   * between ticks. The live timer is published separately via {@link captureElapsedLabel}
   * so the seconds counter never rebuilds (and re-renders) the PrimeNG menu.
   */
  readonly menuItems = computed<MenuItem[]>(() => {
    const isCapturing = this.telemetry.capturing();

    return [
      {
        label: isCapturing
          ? 'Arrêter la session test'
          : 'Démarrer la session test',
        icon: isCapturing ? 'bi bi-stop-circle' : 'bi bi-play-circle',
        id: isCapturing ? 'session-stop' : 'session-start',
        command: () => this.toggleCapture(),
      },
    ];
  });

  /** Live `mm:ss` (or `h:mm:ss`) elapsed label for the active capture; `null` when idle. */
  readonly captureElapsedLabel = computed<string | null>(() => {
    this.menuTick();
    if (!this.telemetry.capturing()) {
      return null;
    }

    return this.formatCaptureElapsed();
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.enabled || !this.telemetry.capturing()) {
        return;
      }

      const subscription = interval(1000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.menuTick.update((value) => value + 1));

      onCleanup(() => subscription.unsubscribe());
    });
  }

  toggleCapture(): void {
    if (this.telemetry.capturing()) {
      this.telemetry.stopCapture();
      const filename = this.telemetry.downloadSession('ishare', {
        production: environment.production,
        telemetryEnabled: environment.enableTestingTelemetry,
      });
      this.showToast('Enregistrement arrêté — données exportées', filename);
      return;
    }

    this.telemetry.startCapture();
    this.showToast('Enregistrement de la session démarré');
  }

  private showToast(summary: string, detail?: string): void {
    if (!this.enabled) {
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary,
      detail,
    });
  }

  private formatCaptureElapsed(): string {
    const startedAt = this.telemetry.captureStartedAt();
    if (startedAt === null) {
      return '00:00';
    }

    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
