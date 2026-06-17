import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import {
  SelectButton,
  type SelectButtonChangeEvent,
} from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { CopyableTextComponent } from '../copyable-text';
import { PlectrumAvatarComponent } from '../plectrum-avatar';
import { SdsTelemetryLabelDirective } from '../testing-telemetry/telemetry-label.directive';
import type {
  PlectrumAvatarColor,
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '../plectrum-avatar/plectrum-avatar.types';

/** Edge the drawer slides in from. */
export type AffiliateDetailDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/** Segmented control selection (Détails / Documents). */
export type AffiliateDetailDrawerView = 'details' | 'documents';

/** Severity treatment for a note tag. */
export type AffiliateDetailDrawerNoteSeverity = 'sensitive' | 'neutral';

/** Copyable identifier shown as a header tag (Territoire, NSI, …). */
export interface AffiliateDetailDrawerIdentifier {
  label: string;
  value: string;
}

/** A label / value row in an information section. */
export interface AffiliateDetailDrawerInfoRow {
  label: string;
  value: string;
}

/** A related person rendered as a Famille tile. */
export interface AffiliateDetailDrawerFamilyMember {
  /** Stable id used for tracking / selection (falls back to name). */
  id?: string;
  /** Initials shown in the small coloured avatar. */
  initials: string;
  name: string;
  /** Relationship label, e.g. `partenaire`, rendered as `(partenaire)`. */
  relationship: string;
  /** Avatar colour — defaults to the Solidaris red when omitted. */
  color?: PlectrumAvatarColor;
}

/** A free-text note with author, timestamp and a category tag. */
export interface AffiliateDetailDrawerNote {
  /** Stable id used for tracking (falls back to author + timestamp). */
  id?: string;
  author: string;
  timestamp: string;
  body: string;
  tagLabel: string;
  severity: AffiliateDetailDrawerNoteSeverity;
}

/** Full data model rendered inside the drawer. */
export interface AffiliateDetailDrawerData {
  /** Affiliate display name (drawer heading). */
  name: string;
  avatarInitials?: string;
  avatarGender?: PlectrumAvatarGender;
  avatarVariant?: PlectrumAvatarVariant;
  /** Copyable identifier tags in the header. */
  identifiers: AffiliateDetailDrawerIdentifier[];
  /** "Informations générales" rows. */
  generalInfo: AffiliateDetailDrawerInfoRow[];
  /** "Coordonnées" rows. */
  contactInfo: AffiliateDetailDrawerInfoRow[];
  /** "Famille" accordion members. */
  family: AffiliateDetailDrawerFamilyMember[];
  /** "Notes" accordion entries. */
  notes: AffiliateDetailDrawerNote[];
}

interface AffiliateDetailDrawerViewOption {
  label: string;
  value: AffiliateDetailDrawerView;
}

const FAMILY_PANEL_VALUE = 'family';
const NOTES_PANEL_VALUE = 'notes';

const NOTE_TAG_SEVERITY: Record<
  AffiliateDetailDrawerNoteSeverity,
  'danger' | 'secondary'
> = {
  sensitive: 'danger',
  neutral: 'secondary',
};

const NOTE_TAG_ICON: Record<AffiliateDetailDrawerNoteSeverity, string> = {
  sensitive: 'bi bi-eye-fill',
  neutral: 'bi bi-chat-right-text-fill',
};

/**
 * AffiliateDetailDrawerComponent — iSHARE "Carte affilié" detail drawer.
 *
 * Wraps PrimeNG `p-drawer` (headless) and renders the affiliate header
 * (illustrated avatar, name, copyable identifier tags, menu + close), a
 * Détails/Documents segmented control, quick actions, "Informations
 * générales" / "Coordonnées" sections, and the "Famille" and "Notes"
 * accordions.
 *
 * ## Figma
 * Node 7:1012 — "Carte affilié"
 * https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=7-1012
 */
@Component({
  selector: 'sds-affiliate-detail-drawer',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    CopyableTextComponent,
    Drawer,
    FormsModule,
    PlectrumAvatarComponent,
    SdsTelemetryLabelDirective,
    SelectButton,
    TagModule,
  ],
  templateUrl: './affiliate-detail-drawer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-affiliate-detail-drawer',
  },
})
export class AffiliateDetailDrawerComponent {
  /** Affiliate content rendered inside the drawer. */
  readonly data = input.required<AffiliateDetailDrawerData>();

  /** Two-way visibility — callers control open/close via `[(visible)]`. */
  readonly visible = model<boolean>(false);

  /** Edge the drawer slides in from. */
  readonly position = input<AffiliateDetailDrawerPosition>('right');

  /** Whether a backdrop mask is shown behind the drawer. */
  readonly modal = input<boolean>(true);

  /** Active segmented-control view; controlled by the host when provided. */
  readonly view = input<AffiliateDetailDrawerView>('details');

  /** Whether the Notes accordion section is rendered. */
  readonly showNotes = input<boolean>(true);

  readonly identifierCopy = output<AffiliateDetailDrawerIdentifier>();
  readonly viewChange = output<AffiliateDetailDrawerView>();
  readonly menuClick = output<void>();
  readonly quickActionsClick = output<void>();
  readonly callClick = output<void>();
  readonly emailClick = output<void>();
  readonly familyMemberSelect = output<AffiliateDetailDrawerFamilyMember>();

  protected readonly familyPanelValue = signal<string | undefined>(
    FAMILY_PANEL_VALUE,
  );
  protected readonly notesPanelValue = signal<string | undefined>(
    NOTES_PANEL_VALUE,
  );

  private readonly internalView = signal<AffiliateDetailDrawerView | null>(
    null,
  );

  protected readonly selectedView = computed<AffiliateDetailDrawerView>(
    () => this.internalView() ?? this.view(),
  );

  protected readonly viewOptions: AffiliateDetailDrawerViewOption[] = [
    { label: 'Détails', value: 'details' },
    { label: 'Documents', value: 'documents' },
  ];

  protected readonly familyPanel = FAMILY_PANEL_VALUE;
  protected readonly notesPanel = NOTES_PANEL_VALUE;

  protected noteTagSeverity(
    note: AffiliateDetailDrawerNote,
  ): 'danger' | 'secondary' {
    return NOTE_TAG_SEVERITY[note.severity];
  }

  protected noteTagIcon(note: AffiliateDetailDrawerNote): string {
    return NOTE_TAG_ICON[note.severity];
  }

  protected familyMemberAriaLabel(
    member: AffiliateDetailDrawerFamilyMember,
  ): string {
    return `${member.name} (${member.relationship})`;
  }

  protected onClose(): void {
    this.visible.set(false);
  }

  protected onViewChange(event: SelectButtonChangeEvent): void {
    const value = event.value as AffiliateDetailDrawerView | null;
    if (value !== 'details' && value !== 'documents') {
      return;
    }

    this.viewChange.emit(value);

    // Documents is host-controlled — keep Détails selected until the host switches view.
    if (value === 'documents') {
      return;
    }

    this.internalView.set(value);
  }

  protected onIdentifierCopy(
    identifier: AffiliateDetailDrawerIdentifier,
  ): void {
    this.identifierCopy.emit(identifier);
  }

  protected onMenuClick(): void {
    this.menuClick.emit();
  }

  protected onQuickActionsClick(): void {
    this.quickActionsClick.emit();
  }

  protected onCallClick(): void {
    this.callClick.emit();
  }

  protected onEmailClick(): void {
    this.emailClick.emit();
  }

  protected onFamilyMemberSelect(
    member: AffiliateDetailDrawerFamilyMember,
  ): void {
    this.familyMemberSelect.emit(member);
  }

  protected trackIdentifier(
    _index: number,
    identifier: AffiliateDetailDrawerIdentifier,
  ): string {
    return identifier.label;
  }

  protected trackFamilyMember(
    index: number,
    member: AffiliateDetailDrawerFamilyMember,
  ): string {
    return member.id ?? `${member.name}-${index}`;
  }

  protected trackNote(index: number, note: AffiliateDetailDrawerNote): string {
    return note.id ?? `${note.author}-${note.timestamp}-${index}`;
  }
}
