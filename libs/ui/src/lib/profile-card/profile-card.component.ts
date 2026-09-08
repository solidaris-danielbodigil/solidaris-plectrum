import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { Popover } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import {
  SelectButton,
  type SelectButtonChangeEvent,
} from 'primeng/selectbutton';
import { CopyableTextComponent } from '../copyable-text';
import { injectPdsMessages } from '../i18n';
import { PDS_PANEL_BORDER_BOTTOM_STYLE } from '../drawer';
import { PlectrumAvatarComponent } from '../plectrum-avatar';
import { PdsTelemetryLabelDirective } from '../testing-telemetry/telemetry-label.directive';
import type {
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '../plectrum-avatar/plectrum-avatar.types';
import { ProfileCardMessages } from './profile-card.i18n';

export type ProfileCardVariant =
  | 'default'
  | 'in-order'
  | 'warning'
  | 'danger';

export type ProfileCardInfoTagFilterKey =
  | 'last-action'
  | 'active-documents'
  | 'closed-documents';

export interface ProfileCardInfoTag {
  label: string;
  value: string;
  filterKey?: ProfileCardInfoTagFilterKey;
  active?: boolean;
}

export interface ProfileCardIdentifier {
  label: string;
  value: string;
}

export type ProfileCardStatusSeverity = 'success' | 'warn' | 'danger';

export interface ProfileCardStatusAction {
  label: string;
  /** Short code shown in the status action tag (e.g. « C4 »). */
  tagValue?: string;
  icon?: string;
  /** Drives card gradient and status button severity when set. */
  severity?: ProfileCardStatusSeverity;
  /** Accessible name for deep-link controls; falls back to {@link label}. */
  ariaLabel?: string;
  /** When true, renders as a non-interactive status chip (no menu). */
  disabled?: boolean;
  menuItems?: MenuItem[];
}

export interface ProfileCardPrimaryAction {
  label: string;
  icon?: string;
  shortcut?: string;
}

const STATUS_SEVERITY_TO_VARIANT: Record<
  ProfileCardStatusSeverity,
  ProfileCardVariant
> = {
  success: 'in-order',
  warn: 'warning',
  danger: 'danger',
};

let nextTitleId = 0;

/** @deprecated Use locale messages via `PDS_LOCALE`. French fallback for callers. */
export const PROFILE_CARD_STATUS_ACTION_TAG_PREFIX =
  ProfileCardMessages.fr.statusActionPrefix;

/** @deprecated Use locale messages via `PDS_LOCALE`. French fallback for callers. */
export const PROFILE_CARD_STATUS_ACTIONS_MULTIPLE_LABEL =
  ProfileCardMessages.fr.statusActionsMultiple;

const SHORTCUT_MODIFIER_KEYS = ['ALT', 'CTRL', 'SHIFT', 'META'] as const;

function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

function matchesKeyboardShortcut(
  event: KeyboardEvent,
  shortcut: string,
): boolean {
  const parts = shortcut.split('+').map((part) => part.trim().toUpperCase());

  if (parts.length < 2) {
    return false;
  }

  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);
  const needsAlt = modifiers.includes('ALT');
  const needsCtrl = modifiers.includes('CTRL');
  const needsShift = modifiers.includes('SHIFT');
  const needsMeta = modifiers.includes('META');

  if (
    event.altKey !== needsAlt ||
    event.ctrlKey !== needsCtrl ||
    event.shiftKey !== needsShift ||
    event.metaKey !== needsMeta
  ) {
    return false;
  }

  if (
    modifiers.some(
      (modifier) =>
        !SHORTCUT_MODIFIER_KEYS.includes(
          modifier as (typeof SHORTCUT_MODIFIER_KEYS)[number],
        ),
    )
  ) {
    return false;
  }

  return event.code === `Key${key}` || event.key.toUpperCase() === key;
}

function toAriaKeyShortcuts(shortcut: string): string {
  return shortcut
    .split('+')
    .map((part) => part.trim())
    .map((part) => {
      const upper = part.toUpperCase();

      if (upper === 'ALT') {
        return 'Alt';
      }

      if (upper === 'CTRL') {
        return 'Control';
      }

      if (upper === 'SHIFT') {
        return 'Shift';
      }

      if (upper === 'META') {
        return 'Meta';
      }

      return part.length === 1 ? part.toUpperCase() : part;
    })
    .join('+');
}

/**
 * ProfileCardComponent — iSHARE affiliate audit summary card.
 *
 * Horizontal layout: avatar, header row (title, status action, info tags, primary action),
 * and a copyable identifier chip row.
 */
@Component({
  selector: 'pds-profile-card',
  standalone: true,
  imports: [
    ButtonModule,
    Card,
    CopyableTextComponent,
    FormsModule,
    PlectrumAvatarComponent,
    PdsTelemetryLabelDirective,
    Popover,
    Ripple,
    SelectButton,
    BadgeModule,
    Skeleton,
  ],
  templateUrl: './profile-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'o-layout--full-width',
  },
})
export class ProfileCardComponent {
  private readonly messages = injectPdsMessages(ProfileCardMessages);
  private readonly statusActionsPopover = viewChild<Popover>(
    'statusActionsPopover',
  );

  readonly title = input.required<string>();
  readonly avatarInitials = input<string>('');
  readonly avatarGender = input<PlectrumAvatarGender>('female');
  readonly avatarVariant = input<PlectrumAvatarVariant>(1);
  readonly variant = input<ProfileCardVariant>('default');
  readonly statusAction = input<ProfileCardStatusAction | null>(null);
  readonly infoTags = input<ProfileCardInfoTag[]>([]);
  readonly identifiers = input<ProfileCardIdentifier[]>([]);
  readonly primaryAction = input<ProfileCardPrimaryAction | null>(null);
  readonly loading = input<boolean>(false);

  readonly primaryActionClick = output<void>();
  readonly statusActionClick = output<void>();
  readonly infoTagClick = output<ProfileCardInfoTag>();
  readonly identifierCopy = output<ProfileCardIdentifier>();
  readonly statusMenuSelect = output<MenuItem>();

  protected readonly titleId = `pds-profile-card-title-${nextTitleId++}`;
  protected readonly statusActionTagPrefix = this.messages.statusActionPrefix;
  protected readonly statusActionsMultipleLabel =
    this.messages.statusActionsMultiple;
  protected readonly skeletonIdentifierSlots = [1, 2, 3, 4] as const;
  protected readonly cardPanelBorderStyle = PDS_PANEL_BORDER_BOTTOM_STYLE;

  readonly statusActionsPopoverStyle = signal<
    Record<string, string> | undefined
  >(undefined);
  readonly statusActionsPopoverExpanded = signal(false);
  private readonly statusActionAnchorRect = signal<DOMRectReadOnly | null>(
    null,
  );

  readonly effectiveVariant = computed((): ProfileCardVariant => {
    const severity = this.statusAction()?.severity;

    if (severity) {
      return STATUS_SEVERITY_TO_VARIANT[severity];
    }

    return this.variant();
  });

  readonly cardStyleClass = computed(() => {
    const classes = [
      'c-profile-card',
      'u-border-bottom',
      `c-profile-card--${this.effectiveVariant()}`,
    ];

    if (this.loading()) {
      classes.push('is-loading');
    }

    return classes.join(' ');
  });

  readonly showStatusAction = computed(
    () => !!this.statusAction() && !this.loading(),
  );

  readonly statusActionSeverity = computed(
    (): ProfileCardStatusSeverity | null =>
      this.statusAction()?.severity ?? null,
  );

  readonly statusActionMenuItems = computed(
    () => this.statusAction()?.menuItems ?? [],
  );

  readonly hasMultipleStatusActions = computed(
    () => this.statusActionMenuItems().length > 1,
  );

  readonly statusActionCount = computed(() =>
    this.hasMultipleStatusActions() ? this.statusActionMenuItems().length : 1,
  );

  readonly firstFilterableInfoTagIndex = computed(() =>
    this.infoTags().findIndex((tag) => !!tag.filterKey),
  );

  readonly filterableInfoTagOptions = computed(() =>
    this.infoTags()
      .filter(
        (
          tag,
        ): tag is ProfileCardInfoTag & {
          filterKey: ProfileCardInfoTagFilterKey;
        } => !!tag.filterKey,
      )
      .map((tag) => ({
        ...tag,
        ariaLabel: this.infoTagAriaLabel(tag),
      })),
  );

  readonly activeInfoTagFilterKey = computed(
    (): ProfileCardInfoTagFilterKey | null => {
      const activeTag = this.filterableInfoTagOptions().find(
        (tag) => tag.active,
      );

      return activeTag?.filterKey ?? null;
    },
  );

  protected selectedInfoTagFilterKey: ProfileCardInfoTagFilterKey | null =
    null;

  constructor() {
    effect(() => {
      this.selectedInfoTagFilterKey = this.activeInfoTagFilterKey();
    });
  }

  onStatusActionClick(event?: MouseEvent | KeyboardEvent): void {
    if (this.loading() || this.statusAction()?.disabled) {
      return;
    }

    if (this.hasMultipleStatusActions()) {
      if (!event) {
        return;
      }

      this.toggleStatusActionsPopover(event);
      return;
    }

    this.statusActionClick.emit();
  }

  onStatusActionKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.onStatusActionClick(event);
  }

  onStatusMenuItemClick(item: MenuItem): void {
    if (this.loading() || item.disabled) {
      return;
    }

    this.statusMenuSelect.emit(item);
    this.statusActionsPopover()?.hide();
  }

  onStatusMenuItemKeydown(event: KeyboardEvent, item: MenuItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onStatusMenuItemClick(item);
    }
  }

  onStatusActionsPopoverShow(): void {
    this.statusActionsPopoverExpanded.set(true);
    this.scheduleStatusActionsPopoverReposition();
  }

  onStatusActionsPopoverHide(): void {
    this.statusActionsPopoverExpanded.set(false);
    this.statusActionAnchorRect.set(null);
    this.statusActionsPopoverStyle.set(undefined);
  }

  private toggleStatusActionsPopover(event: MouseEvent | KeyboardEvent): void {
    const anchor = this.resolveStatusActionAnchor(event);
    if (!anchor) {
      return;
    }

    const popover = this.statusActionsPopover();
    if (!popover) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    this.statusActionAnchorRect.set(rect);
    this.statusActionsPopoverStyle.set(this.popoverStyleFromRect(rect));
    popover.toggle(event, anchor);
    this.scheduleStatusActionsPopoverReposition();
  }

  private resolveStatusActionAnchor(
    event: MouseEvent | KeyboardEvent,
  ): HTMLElement | undefined {
    if (event.currentTarget instanceof HTMLElement) {
      return event.currentTarget;
    }

    const target = event.target;
    if (target instanceof Element) {
      return (
        target.closest<HTMLButtonElement>(
          '.c-profile-card__status-action',
        ) ?? undefined
      );
    }

    return undefined;
  }

  private scheduleStatusActionsPopoverReposition(): void {
    const apply = () => this.repositionStatusActionsPopover();

    requestAnimationFrame(() => {
      apply();
      requestAnimationFrame(() => {
        apply();
        setTimeout(apply, 0);
        setTimeout(apply, 50);
      });
    });
  }

  private popoverStyleFromRect(rect: DOMRectReadOnly): Record<string, string> {
    const gutter = 4;

    return {
      position: 'fixed',
      top: `${rect.bottom + gutter}px`,
      left: `${rect.left}px`,
      insetInlineStart: `${rect.left}px`,
      marginTop: '0',
      transform: 'none',
    };
  }

  private repositionStatusActionsPopover(): void {
    const rect = this.statusActionAnchorRect();
    if (!rect) {
      return;
    }

    const style = this.popoverStyleFromRect(rect);
    this.statusActionsPopoverStyle.set(style);

    const panel = document.body.querySelector('.p-popover') as HTMLElement | null;
    if (!panel) {
      return;
    }

    Object.assign(panel.style, style);
  }

  onIdentifierCopy(identifier: ProfileCardIdentifier): void {
    if (this.loading()) {
      return;
    }

    this.identifierCopy.emit(identifier);
  }

  onPrimaryActionClick(): void {
    if (this.loading()) {
      return;
    }

    this.primaryActionClick.emit();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    const shortcut = this.primaryAction()?.shortcut;

    if (!shortcut || this.loading() || isEditableShortcutTarget(event.target)) {
      return;
    }

    if (!matchesKeyboardShortcut(event, shortcut)) {
      return;
    }

    event.preventDefault();
    this.onPrimaryActionClick();
  }

  primaryActionAriaKeyShortcuts(): string | null {
    const shortcut = this.primaryAction()?.shortcut;

    return shortcut ? toAriaKeyShortcuts(shortcut) : null;
  }

  primaryActionAriaLabel(): string {
    const action = this.primaryAction();

    return action ? `${this.title()} — ${action.label}` : this.title();
  }

  onInfoTagFilterChange(event: SelectButtonChangeEvent): void {
    if (this.loading()) {
      return;
    }

    const value = event.value as ProfileCardInfoTagFilterKey | null;

    if (value) {
      const tag = this.infoTags().find((option) => option.filterKey === value);

      if (tag) {
        this.infoTagClick.emit(tag);
      }

      return;
    }

    const previouslyActive = this.infoTags().find(
      (tag) => tag.active && tag.filterKey,
    );

    if (previouslyActive) {
      this.infoTagClick.emit(previouslyActive);
    }
  }

  onInfoTagClick(tag: ProfileCardInfoTag): void {
    if (this.loading() || !tag.filterKey) {
      return;
    }

    this.infoTagClick.emit(tag);
  }

  infoTagAriaLabel(tag: ProfileCardInfoTag): string {
    return `${tag.label} ${tag.value}`.trim();
  }

  statusActionAriaLabel(): string {
    const action = this.statusAction();

    if (action?.ariaLabel) {
      return action.ariaLabel;
    }

    if (this.hasMultipleStatusActions()) {
      return this.messages.statusActionCount(this.statusActionCount());
    }

    return action?.label ?? this.messages.actionFallback;
  }

  statusActionExpandAriaLabel(): string {
    const label = this.statusAction()?.label;

    return label
      ? this.messages.showMenu(label)
      : this.messages.showMenuFallback;
  }
}
