import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { pdsOverlayAppendTo, injectPdsMessages } from '@solidaris-danielbodigil/pds-ui';
import { TransactionsCicsModalMessages } from './transactions-cics-modal.i18n';
import type { TransactionsCicsRow } from './transactions-cics-modal.types';

/** Default mock rows — legacy iShare Transactions CICS modal (Scenario 4). */
export const DEFAULT_TRANSACTIONS_CICS_ROWS: TransactionsCicsRow[] = [
  {
    code: 'UA38',
    description: 'Consultation jours vacances ONVA',
    launchUrl: 'https://example.com/cics/UA38',
  },
  {
    code: 'UALG',
    description: 'Liste des allocations',
    launchUrl: 'https://example.com/cics/UALG',
  },
  {
    code: 'UBET',
    description: 'Bénéficiaire — état du dossier',
    launchUrl: 'https://example.com/cics/UBET',
  },
  {
    code: 'UCAB',
    description: 'Consultation absences',
    launchUrl: 'https://example.com/cics/UCAB',
  },
  {
    code: 'UCCT',
    description: 'Consultation certificats',
    launchUrl: 'https://example.com/cics/UCCT',
  },
  {
    code: 'UCDM',
    description: 'Demande médicale',
    launchUrl: 'https://example.com/cics/UCDM',
  },
  {
    code: 'UCFI',
    description: 'Fiche indemnités',
    launchUrl: 'https://example.com/cics/UCFI',
  },
];

/**
 * Transactions CICS modal — searchable transaction list with per-row CICS launch CTA.
 * Legacy iShare parity for moderated user testing (Scenario 4).
 */
@Component({
  selector: 'pds-transactions-cics-modal',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MessageModule,
    TableModule,
  ],
  templateUrl: './transactions-cics-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-transactions-cics-modal' },
})
export class TransactionsCicsModalComponent {
  protected readonly messages = injectPdsMessages(TransactionsCicsModalMessages);
  protected readonly dialogAppendTo = pdsOverlayAppendTo();

  readonly visible = model(false);
  readonly rows = input<TransactionsCicsRow[]>(DEFAULT_TRANSACTIONS_CICS_ROWS);

  readonly transactionLaunch = output<TransactionsCicsRow>();

  private readonly document = inject(DOCUMENT);

  /** Element focused before the dialog opened; PrimeNG Dialog does not hand focus back on close. */
  private focusOrigin: HTMLElement | null = null;

  private readonly focusReturn = effect(() => {
    const visible = this.visible();
    untracked(() => (visible ? this.captureFocusOrigin() : this.restoreFocusOrigin()));
  });

  readonly searchQuery = signal('');

  readonly filteredRows = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.rows();
    }

    return this.rows().filter(
      (row) =>
        row.code.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query),
    );
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onLaunch(row: TransactionsCicsRow): void {
    this.transactionLaunch.emit(row);
    window.open(row.launchUrl, '_blank', 'noopener,noreferrer');
  }

  onHide(): void {
    this.searchQuery.set('');
  }

  private captureFocusOrigin(): void {
    const active = this.document.activeElement;
    this.focusOrigin = active instanceof HTMLElement && active !== this.document.body ? active : null;
  }

  /** Return focus to the trigger unless the user already moved it somewhere else. */
  private restoreFocusOrigin(): void {
    const origin = this.focusOrigin;
    this.focusOrigin = null;
    if (!origin?.isConnected) return;
    const active = this.document.activeElement;
    if (!active || active === this.document.body || active.closest('.p-dialog, .p-dialog-mask')) {
      origin.focus({ preventScroll: true });
    }
  }
}
