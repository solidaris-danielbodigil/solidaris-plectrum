import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { SplitButton } from 'primeng/splitbutton';
import { ToggleButton } from 'primeng/togglebutton';
import { CopyableTextComponent } from '../copyable-text';
import { PlectrumAvatarComponent } from '../plectrum-avatar';
import type {
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '../plectrum-avatar/plectrum-avatar.types';

export type AffiliateOverviewCardVariant = 'default' | 'in-order' | 'warning' | 'danger';

export type AffiliateOverviewInfoTagFilterKey =
  | 'last-action'
  | 'active-documents'
  | 'closed-documents';

export interface AffiliateOverviewInfoTag {
  label: string;
  value: string;
  filterKey?: AffiliateOverviewInfoTagFilterKey;
  active?: boolean;
}

export interface AffiliateOverviewIdentifier {
  label: string;
  value: string;
}

export interface AffiliateOverviewStatusAction {
  label: string;
  icon?: string;
  menuItems?: MenuItem[];
}

export interface AffiliateOverviewPrimaryAction {
  label: string;
  icon?: string;
  shortcut?: string;
}

type AffiliateOverviewStatusSeverity = 'warn' | 'danger';

const VARIANT_STATUS_ACTION_SEVERITY: Record<
  Extract<AffiliateOverviewCardVariant, 'warning' | 'danger'>,
  AffiliateOverviewStatusSeverity
> = {
  warning: 'warn',
  danger: 'danger',
};

let nextTitleId = 0;

const SHORTCUT_MODIFIER_KEYS = ['ALT', 'CTRL', 'SHIFT', 'META'] as const;

function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function matchesKeyboardShortcut(event: KeyboardEvent, shortcut: string): boolean {
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

  if (modifiers.some((modifier) => !SHORTCUT_MODIFIER_KEYS.includes(modifier as (typeof SHORTCUT_MODIFIER_KEYS)[number]))) {
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
 * AffiliateOverviewCardComponent — iSHARE affiliate audit summary card.
 *
 * Horizontal layout: avatar, header row (title, status action, info tags, primary action),
 * and a copyable identifier chip row.
 */
@Component({
  selector: 'sds-affiliate-overview-card',
  standalone: true,
  imports: [
    ButtonModule,
    Card,
    CopyableTextComponent,
    FormsModule,
    PlectrumAvatarComponent,
    SplitButton,
    ToggleButton,
  ],
  templateUrl: './affiliate-overview-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'o-layout--full-width',
  },
})
export class AffiliateOverviewCardComponent {
  readonly title = input.required<string>();
  readonly avatarInitials = input<string>('');
  readonly avatarGender = input<PlectrumAvatarGender>('female');
  readonly avatarVariant = input<PlectrumAvatarVariant>(1);
  readonly variant = input<AffiliateOverviewCardVariant>('default');
  readonly statusAction = input<AffiliateOverviewStatusAction | null>(null);
  readonly infoTags = input<AffiliateOverviewInfoTag[]>([]);
  readonly identifiers = input<AffiliateOverviewIdentifier[]>([]);
  readonly primaryAction = input<AffiliateOverviewPrimaryAction | null>(null);
  readonly loading = input<boolean>(false);

  readonly primaryActionClick = output<void>();
  readonly statusActionClick = output<void>();
  readonly infoTagClick = output<AffiliateOverviewInfoTag>();
  readonly identifierCopy = output<AffiliateOverviewIdentifier>();
  readonly statusMenuSelect = output<MenuItem>();

  protected readonly titleId = `sds-affiliate-overview-card-title-${nextTitleId++}`;

  readonly cardStyleClass = computed(() => {
    const classes = [
      'c-affiliate-overview-card',
      `c-affiliate-overview-card--${this.variant()}`,
    ];

    if (this.loading()) {
      classes.push('is-loading');
    }

    return classes.join(' ');
  });

  readonly showStatusAction = computed(() => {
    const variant = this.variant();
    return (
      !!this.statusAction() &&
      !this.loading() &&
      (variant === 'warning' || variant === 'danger')
    );
  });

  readonly statusActionSeverity = computed((): AffiliateOverviewStatusSeverity | null => {
    const variant = this.variant();

    if (variant === 'warning' || variant === 'danger') {
      return VARIANT_STATUS_ACTION_SEVERITY[variant];
    }

    return null;
  });

  readonly statusActionMenuItems = computed(
    () => this.statusAction()?.menuItems ?? [],
  );

  onStatusActionClick(): void {
    if (this.loading()) {
      return;
    }

    this.statusActionClick.emit();
  }

  onStatusMenuItemClick(item: MenuItem): void {
    if (this.loading()) {
      return;
    }

    this.statusMenuSelect.emit(item);
  }

  onIdentifierCopy(identifier: AffiliateOverviewIdentifier): void {
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

  onInfoTagClick(tag: AffiliateOverviewInfoTag): void {
    if (this.loading() || !tag.filterKey) {
      return;
    }

    this.infoTagClick.emit(tag);
  }

  infoTagAriaLabel(tag: AffiliateOverviewInfoTag): string {
    return `${tag.label} ${tag.value}`.trim();
  }

  statusActionExpandAriaLabel(): string {
    const label = this.statusAction()?.label;

    return label ? `Afficher le menu pour ${label}` : 'Afficher le menu';
  }
}
