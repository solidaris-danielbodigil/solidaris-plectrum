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
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Drawer, type DrawerPassThrough } from 'primeng/drawer';
import {
  SelectButton,
  type SelectButtonChangeEvent,
} from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { CopyableTextComponent } from '../copyable-text';
import { injectPdsMessages } from '../i18n';
import {
  PDS_DRAWER_CONTENT_STYLE,
  PDS_PANEL_BORDER_BOTTOM_STYLE,
  pdsOverlayAppendTo,
  type DetailListRow,
  type DrawerPosition,
} from '../drawer';
import { PlectrumAvatarComponent } from '../plectrum-avatar';
import { PdsTelemetryLabelDirective } from '../testing-telemetry/telemetry-label.directive';
import {
  ProfileDrawerMessages,
  type ProfileDrawerLabelSet,
} from './profile-drawer.i18n';
import type {
  PlectrumAvatarColor,
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '../plectrum-avatar/plectrum-avatar.types';

/** @deprecated Use `DrawerPosition` from `@solidaris/ui`. */
export type ProfileDrawerPosition = DrawerPosition;

/** Segmented control selection (Détails / Documents). */
export type ProfileDrawerView = 'details' | 'documents';

/** Severity treatment for a note tag. */
export type ProfileDrawerNoteSeverity = 'sensitive' | 'neutral';

/** Copyable identifier shown as a header tag (Territoire, NSI, …). */
export interface ProfileDrawerIdentifier {
  label: string;
  value: string;
}

/** @deprecated Use `DetailListRow` from `@solidaris/ui`. */
export type ProfileDrawerInfoRow = DetailListRow;

/** A related person rendered as a Famille tile. */
export interface ProfileDrawerRelatedMember {
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
export interface ProfileDrawerNote {
  /** Stable id used for tracking (falls back to author + timestamp). */
  id?: string;
  author: string;
  timestamp: string;
  body: string;
  tagLabel: string;
  severity: ProfileDrawerNoteSeverity;
}

/** Full data model rendered inside the drawer. */
export interface ProfileDrawerData {
  /** Profile display name (drawer heading). */
  name: string;
  avatarInitials?: string;
  avatarGender?: PlectrumAvatarGender;
  avatarVariant?: PlectrumAvatarVariant;
  /** Copyable identifier tags in the header. */
  identifiers: ProfileDrawerIdentifier[];
  /** General-information rows. */
  generalRows: DetailListRow[];
  /** Contact rows. */
  contactRows: DetailListRow[];
  /** Related-people accordion members. */
  relatedMembers: ProfileDrawerRelatedMember[];
  /** Notes accordion entries. */
  notes: ProfileDrawerNote[];
}

/** Partial override for section and action copy. Unset keys use `PDS_LOCALE` messages. */
export type ProfileDrawerLabels = Partial<ProfileDrawerLabelSet>;

interface ProfileDrawerViewOption {
  label: string;
  value: ProfileDrawerView;
}

const FAMILY_PANEL_VALUE = 'family';
const NOTES_PANEL_VALUE = 'notes';

const NOTE_TAG_SEVERITY: Record<
  ProfileDrawerNoteSeverity,
  'danger' | 'secondary'
> = {
  sensitive: 'danger',
  neutral: 'secondary',
};

const NOTE_TAG_ICON: Record<ProfileDrawerNoteSeverity, string> = {
  sensitive: 'bi bi-eye-fill',
  neutral: 'bi bi-chat-right-text-fill',
};

/**
 * ProfileDrawerComponent — iSHARE "Carte affilié" detail drawer.
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
  selector: 'pds-profile-drawer',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    CopyableTextComponent,
    Drawer,
    FormsModule,
    PlectrumAvatarComponent,
    PdsTelemetryLabelDirective,
    SelectButton,
    TagModule,
  ],
  templateUrl: './profile-drawer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-drawer',
  },
})
export class ProfileDrawerComponent {
  private static nextId = 0;

  private readonly messages = injectPdsMessages(ProfileDrawerMessages);
  private readonly document = inject(DOCUMENT);
  protected readonly drawerAppendTo = pdsOverlayAppendTo();
  protected readonly drawerPanelStyle = PDS_DRAWER_CONTENT_STYLE;
  protected readonly drawerPanelBorderStyle = PDS_PANEL_BORDER_BOTTOM_STYLE;

  /** Heading id — the drawer surface is labelled by the profile name. */
  protected readonly headingId = `pds-profile-drawer-title-${ProfileDrawerComponent.nextId++}`;

  /** Element focused before the drawer opened; focus returns there on close. */
  private focusOrigin: HTMLElement | null = null;

  /**
   * PrimeNG renders the drawer root as `role="complementary"` with no name and
   * no `aria-modal`, even in modal mode. The pass-through API is the sanctioned
   * way to change those root attributes (PrimeNG Drawer → Accessibility).
   */
  protected readonly drawerPassThrough = computed<DrawerPassThrough>(() => {
    const modal = this.modal();
    return {
      root: {
        role: modal ? 'dialog' : 'complementary',
        'aria-modal': modal ? 'true' : undefined,
        'aria-labelledby': this.headingId,
      },
    };
  });

  /** Affiliate content rendered inside the drawer. */
  readonly data = input.required<ProfileDrawerData>();

  /** Two-way visibility — callers control open/close via `[(visible)]`. */
  readonly visible = model<boolean>(false);

  /** Edge the drawer slides in from. */
  readonly position = input<DrawerPosition>('right');

  /** Whether a backdrop mask is shown behind the drawer. */
  readonly modal = input<boolean>(true);

  /** Active segmented-control view; controlled by the host when provided. */
  readonly view = input<ProfileDrawerView>('details');

  /** Whether the Notes accordion section is rendered. */
  readonly showNotes = input<boolean>(true);

  /** Partial copy override. Unset keys use the active locale messages. */
  readonly labels = input<ProfileDrawerLabels>({});

  readonly identifierCopy = output<ProfileDrawerIdentifier>();
  readonly viewChange = output<ProfileDrawerView>();
  readonly menuClick = output<void>();
  readonly quickActionsClick = output<void>();
  readonly callClick = output<void>();
  readonly emailClick = output<void>();
  readonly familyMemberSelect = output<ProfileDrawerRelatedMember>();

  protected readonly familyPanelValue = signal<string | undefined>(
    FAMILY_PANEL_VALUE,
  );
  protected readonly notesPanelValue = signal<string | undefined>(
    NOTES_PANEL_VALUE,
  );

  private readonly internalView = signal<ProfileDrawerView | null>(
    null,
  );

  protected readonly selectedView = computed<ProfileDrawerView>(
    () => this.internalView() ?? this.view(),
  );

  protected readonly resolvedLabels = computed<ProfileDrawerLabelSet>(() => ({
    ...this.messages,
    ...this.labels(),
  }));

  protected readonly viewOptions = computed<ProfileDrawerViewOption[]>(() => [
    { label: this.resolvedLabels().details, value: 'details' },
    { label: this.resolvedLabels().documents, value: 'documents' },
  ]);

  protected readonly familyPanel = FAMILY_PANEL_VALUE;
  protected readonly notesPanel = NOTES_PANEL_VALUE;

  /**
   * Remembers the trigger while opening and hands focus back to it on close.
   * Runs on the `visible` model rather than `(onHide)`, which PrimeNG only
   * emits for its own close paths (Escape, mask) and not for `visible = false`.
   */
  private readonly focusReturn = effect(() => {
    const visible = this.visible();
    untracked(() => {
      if (visible) {
        this.captureFocusOrigin();
      } else {
        this.restoreFocusOrigin();
      }
    });
  });

  /** `(onShow)` — the surface is rendered; move focus onto the heading. */
  protected onDrawerShow(): void {
    const heading = this.resolveOverlayDocument().getElementById(
      this.headingId,
    );
    heading?.focus({ preventScroll: true });
  }

  private captureFocusOrigin(): void {
    const active = this.document.activeElement;
    this.focusOrigin =
      active instanceof HTMLElement && active !== this.document.body
        ? active
        : null;
  }

  private restoreFocusOrigin(): void {
    const origin = this.focusOrigin;
    this.focusOrigin = null;
    if (!origin?.isConnected) {
      return;
    }
    // Hand focus back only when it is still inside the drawer or was lost to
    // the body (Escape, mask click) — never when the user already moved on.
    const active = this.document.activeElement;
    const focusIsFree =
      !active || active === this.document.body || this.isInsideDrawer(active);
    if (focusIsFree) {
      origin.focus({ preventScroll: true });
    }
  }

  private isInsideDrawer(element: Element): boolean {
    const heading = this.resolveOverlayDocument().getElementById(this.headingId);
    return !!heading?.closest('[data-pc-name="drawer"]')?.contains(element);
  }

  /** Document hosting the drawer surface — the preview frame in Storybook docs, otherwise ours. */
  private resolveOverlayDocument(): Document {
    return this.drawerAppendTo === 'body'
      ? this.document
      : this.drawerAppendTo.ownerDocument;
  }

  protected noteTagSeverity(
    note: ProfileDrawerNote,
  ): 'danger' | 'secondary' {
    return NOTE_TAG_SEVERITY[note.severity];
  }

  protected noteTagIcon(note: ProfileDrawerNote): string {
    return NOTE_TAG_ICON[note.severity];
  }

  protected familyMemberAriaLabel(
    member: ProfileDrawerRelatedMember,
  ): string {
    return `${member.name} (${member.relationship})`;
  }

  protected onClose(): void {
    this.visible.set(false);
  }

  protected onViewChange(event: SelectButtonChangeEvent): void {
    const value = event.value as ProfileDrawerView | null;
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
    identifier: ProfileDrawerIdentifier,
  ): void {
    this.identifierCopy.emit(identifier);
  }

  protected onFamilyMemberSelect(
    member: ProfileDrawerRelatedMember,
  ): void {
    this.familyMemberSelect.emit(member);
  }

  protected trackIdentifier(
    _index: number,
    identifier: ProfileDrawerIdentifier,
  ): string {
    return identifier.label;
  }

  protected trackFamilyMember(
    index: number,
    member: ProfileDrawerRelatedMember,
  ): string {
    return member.id ?? `${member.name}-${index}`;
  }

  protected trackNote(index: number, note: ProfileDrawerNote): string {
    return note.id ?? `${note.author}-${note.timestamp}-${index}`;
  }
}
