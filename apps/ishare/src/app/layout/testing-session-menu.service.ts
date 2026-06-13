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
  private readonly menuOpen = signal(false);

  readonly enabled = environment.enableTestingTelemetry;

  readonly menuItems = computed<MenuItem[]>(() => {
    this.menuTick();
    const isCapturing = this.telemetry.capturing();

    return [
      {
        label: isCapturing
          ? 'Arrêter la session test'
          : 'Démarrer la session test',
        icon: isCapturing ? 'bi bi-stop-circle' : 'bi bi-play-circle',
        id: isCapturing ? 'session-stop' : 'session-start',
        badge: isCapturing ? this.formatCaptureElapsed() : undefined,
        command: () => this.toggleCapture(),
      },
      {
        label: 'Exporter les données',
        icon: 'bi bi-download',
        id: 'session-export',
        command: () => this.onExport(),
      },
    ];
  });

  constructor() {
    effect(() => {
      if (
        !this.enabled ||
        !this.telemetry.capturing() ||
        this.menuOpen()
      ) {
        return;
      }

      const subscription = interval(1000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.menuTick.update((value) => value + 1));

      return () => subscription.unsubscribe();
    });
  }

  /** Pauses live timer updates while the avatar menu is open to keep item targets stable. */
  setMenuOpen(open: boolean): void {
    this.menuOpen.set(open);
  }

  toggleCapture(): void {
    if (this.telemetry.capturing()) {
      this.telemetry.stopCapture();
      this.showToast('Enregistrement arrêté');
      return;
    }

    this.telemetry.startCapture();
    this.showToast('Enregistrement de la session démarré');
  }

  onExport(): void {
    const filename = this.telemetry.downloadSession('ishare', {
      production: environment.production,
      telemetryEnabled: environment.enableTestingTelemetry,
    });
    this.showToast('Données exportées', filename);
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
