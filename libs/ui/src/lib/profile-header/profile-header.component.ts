import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  computed,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { SplitButton } from 'primeng/splitbutton';
import { Tag } from 'primeng/tag';
import { ToggleButton } from 'primeng/togglebutton';
import { Tooltip } from 'primeng/tooltip';
import { CopyableTextComponent } from '../copyable-text';
import { injectPdsMessages } from '../i18n';
import {
  isEditableShortcutTarget,
  matchesKeyboardShortcut,
  toAriaKeyShortcuts,
} from '../internal/keyboard-shortcut';
import { PlectrumAvatarComponent } from '../plectrum-avatar';
import type {
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '../plectrum-avatar/plectrum-avatar.types';
import { PdsTelemetryLabelDirective } from '../testing-telemetry/telemetry-label.directive';
import { ProfileHeaderMessages } from './profile-header.i18n';
import type {
  ProfileHeaderIdentifier,
  ProfileHeaderInfoTag,
  ProfileHeaderInfoTagFilterKey,
  ProfileHeaderPrimaryAction,
  ProfileHeaderStatusAction,
  ProfileHeaderStatusSeverity,
  ProfileHeaderVariant,
} from './profile-header.types';

const STATUS_SEVERITY_TO_VARIANT: Record<
  ProfileHeaderStatusSeverity,
  ProfileHeaderVariant
> = {
  success: 'in-order',
  warn: 'warning',
  danger: 'danger',
};

/** Figma status splitbutton states — node 2371:3075. */
const STATUS_SEVERITY_ICON: Record<ProfileHeaderStatusSeverity, string> = {
  success: 'bi bi-check-lg',
  warn: 'bi bi-exclamation-triangle',
  danger: 'bi bi-exclamation-octagon',
};

/** Figma name button right icon — node 2443:6004. */
const DEFAULT_PRIMARY_ACTION_ICON = 'bi bi-person-square';

let nextTitleId = 0;

/** SplitButton half that opened the status menu — focus returns there on close. */
type StatusMenuOpener = 'main' | 'dropdown';

/**
 * ProfileHeaderComponent — shell header for one person.
 *
 * Top bar: avatar, name (outlined primary Button opening the profile), status
 * action (Button / SplitButton), quick-filter info tags and an `actions` slot.
 * Bottom row: copyable identifiers and an `aside` slot. Optional nav row:
 * `nav` (shell tabs) and `nav-end` slots. Figma node 2438:10587.
 */
@Component({
  selector: 'pds-profile-header',
  standalone: true,
  imports: [
    BadgeModule,
    ButtonModule,
    Card,
    CopyableTextComponent,
    FormsModule,
    PdsTelemetryLabelDirective,
    PlectrumAvatarComponent,
    Skeleton,
    SplitButton,
    Tag,
    ToggleButton,
    Tooltip,
  ],
  templateUrl: './profile-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-profile-header o-layout o-layout--block o-layout--full-width',
    '[class.c-profile-header--default]': "effectiveVariant() === 'default'",
    '[class.c-profile-header--in-order]': "effectiveVariant() === 'in-order'",
    '[class.c-profile-header--warning]': "effectiveVariant() === 'warning'",
    '[class.c-profile-header--danger]': "effectiveVariant() === 'danger'",
    '[class.is-loading]': 'loading()',
  },
})
export class ProfileHeaderComponent {
  private readonly messages = injectPdsMessages(ProfileHeaderMessages);
  private readonly statusSplitButton =
    viewChild<SplitButton>('statusSplitButton');
  private readonly statusSplitButtonEl = viewChild<
    unknown,
    ElementRef<HTMLElement>
  >('statusSplitButton', { read: ElementRef });
  /** Which SplitButton half opened the menu (C1 — WCAG 2.4.3 focus order). */
  private statusMenuOpener: StatusMenuOpener = 'main';

  readonly title = input.required<string>();
  readonly avatarInitials = input<string>('');
  readonly avatarGender = input<PlectrumAvatarGender>('female');
  readonly avatarVariant = input<PlectrumAvatarVariant>(1);
  readonly variant = input<ProfileHeaderVariant>('default');
  readonly statusAction = input<ProfileHeaderStatusAction | null>(null);
  readonly infoTags = input<ProfileHeaderInfoTag[]>([]);
  readonly identifiers = input<ProfileHeaderIdentifier[]>([]);
  readonly primaryAction = input<ProfileHeaderPrimaryAction | null>(null);
  readonly loading = input<boolean>(false);

  readonly primaryActionClick = output<void>();
  readonly statusActionClick = output<void>();
  readonly infoTagClick = output<ProfileHeaderInfoTag>();
  readonly identifierCopy = output<ProfileHeaderIdentifier>();
  readonly statusMenuSelect = output<MenuItem>();

  protected readonly titleId = `pds-profile-header-title-${nextTitleId++}`;
  protected readonly skeletonIdentifierSlots = [1, 2, 3, 4] as const;
  protected readonly statusActionTagPrefix = computed(
    () => this.messages().statusActionPrefix,
  );
  protected readonly statusActionsMultipleLabel = computed(
    () => this.messages().statusActionsMultiple,
  );
  protected readonly infoTagsLabel = computed(
    () => this.messages().infoTagsLabel,
  );

  /** True while the status SplitButton menu is open. */
  protected readonly statusMenuExpanded = signal(false);

  /** Pressed quick filter — seeded from `active`, toggled locally on click. */
  protected readonly selectedInfoTagFilterKey = linkedSignal(
    (): ProfileHeaderInfoTagFilterKey | null =>
      this.infoTags().find((tag) => tag.filterKey && tag.active)?.filterKey ??
      null,
  );

  protected readonly effectiveVariant = computed((): ProfileHeaderVariant => {
    const severity = this.statusAction()?.severity;

    return severity ? STATUS_SEVERITY_TO_VARIANT[severity] : this.variant();
  });

  protected readonly showStatusAction = computed(
    () => !!this.statusAction() && !this.loading(),
  );

  protected readonly statusActionIcon = computed((): string | null => {
    const action = this.statusAction();

    if (action?.icon) {
      return action.icon;
    }

    return action?.severity ? STATUS_SEVERITY_ICON[action.severity] : null;
  });

  protected readonly statusActionMenuItems = computed(
    () => this.statusAction()?.menuItems ?? [],
  );

  /** More than one menu entry → SplitButton; otherwise a plain Button. */
  protected readonly hasMultipleStatusActions = computed(
    () => this.statusActionMenuItems().length > 1,
  );

  /** Exactly one menu entry → the plain Button runs that item instead of dropping it. */
  protected readonly singleStatusMenuItem = computed((): MenuItem | null => {
    const items = this.statusActionMenuItems();

    return items.length === 1 ? items[0] : null;
  });

  protected readonly statusActionDisabled = computed(
    () =>
      !!this.statusAction()?.disabled || !!this.singleStatusMenuItem()?.disabled,
  );

  protected readonly statusActionCount = computed(() =>
    this.hasMultipleStatusActions() ? this.statusActionMenuItems().length : 1,
  );

  /** SplitButton model — wraps each command so the original item is reported. */
  protected readonly statusMenuModel = computed((): MenuItem[] =>
    this.statusActionMenuItems().map((item) => ({
      ...item,
      command: (event: MenuItemCommandEvent) => {
        item.command?.(event);
        this.onStatusMenuItemSelect(item);
      },
    })),
  );

  protected readonly statusActionAriaLabel = computed((): string => {
    const action = this.statusAction();

    if (action?.ariaLabel) {
      return action.ariaLabel;
    }

    // Label in name (WCAG 2.5.3): the name starts with the visible text.
    if (this.hasMultipleStatusActions()) {
      return this.messages().statusActionCount(this.statusActionCount());
    }

    if (action?.tagValue) {
      return `${this.messages().statusActionPrefix}${action.tagValue} — ${action.label}`;
    }

    return action?.label ?? this.messages().actionFallback;
  });

  protected readonly statusButtonProps = computed(() => ({
    ariaLabel: this.statusActionAriaLabel(),
  }));

  /**
   * The SplitButton main button opens the menu too, so it carries the popup
   * state. PrimeNG only forwards `buttonProps.ariaLabel` to it; the pass-through
   * `pcButton.root` attributes are bound by the Button directive's pBind.
   */
  protected readonly statusSplitButtonPt = computed(() => ({
    pcButton: {
      root: {
        'aria-haspopup': 'menu',
        'aria-expanded': this.statusMenuExpanded() ? 'true' : 'false',
      },
    },
  }));

  protected readonly statusActionExpandAriaLabel = computed((): string => {
    const label = this.statusAction()?.label;

    return label
      ? this.messages().showMenu(label)
      : this.messages().showMenuFallback;
  });

  protected readonly primaryActionIcon = computed(
    () => this.primaryAction()?.icon ?? DEFAULT_PRIMARY_ACTION_ICON,
  );

  protected readonly primaryActionAriaKeyShortcuts = computed(
    (): string | null => {
      const shortcut = this.primaryAction()?.shortcut;

      return shortcut ? toAriaKeyShortcuts(shortcut) : null;
    },
  );

  protected readonly primaryActionAriaLabel = computed((): string => {
    const action = this.primaryAction();

    return action ? `${this.title()} — ${action.label}` : this.title();
  });

  /** The action name (and shortcut) — the button's visible text is the person's name. */
  protected readonly primaryActionTooltip = computed((): string => {
    const action = this.primaryAction();

    if (!action) {
      return '';
    }

    const shortcut = this.primaryActionAriaKeyShortcuts();

    return shortcut ? `${action.label} (${shortcut})` : action.label;
  });

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

  /**
   * Single status action (plain Button). With exactly one `menuItems` entry the
   * button stands for that item: it runs its command and emits statusMenuSelect.
   */
  onStatusActionClick(event?: Event): void {
    if (this.loading() || this.statusActionDisabled()) {
      return;
    }

    const item = this.singleStatusMenuItem();

    if (item) {
      item.command?.({ originalEvent: event, item });
      this.onStatusMenuItemSelect(item);
      return;
    }

    this.statusActionClick.emit();
  }

  /**
   * SplitButton main button: opens the same menu as the dropdown toggle, as the
   * Profile Card status chip did. SplitButton hides its menu right after this
   * handler runs, so opening is deferred; a click while open just closes it.
   */
  onStatusSplitMainClick(): void {
    if (this.loading() || this.statusAction()?.disabled) {
      return;
    }

    const splitButton = this.statusSplitButton();

    if (!splitButton || this.statusMenuExpanded()) {
      return;
    }

    setTimeout(() => {
      splitButton.onDropdownButtonClick(undefined);
      // onDropdownButtonClick emits onDropdownClick — the main button opened it.
      this.statusMenuOpener = 'main';
    });
  }

  onStatusDropdownClick(): void {
    this.statusMenuOpener = 'dropdown';
  }

  onStatusMenuShow(): void {
    this.statusMenuExpanded.set(true);
  }

  /**
   * TieredMenu hands focus back to its target on close, but SplitButton passes
   * the non-focusable p-splitbutton host as target, so focus would drop to the
   * body. Unless the user (or the item command) moved focus elsewhere, return it
   * to the half that opened the menu.
   */
  onStatusMenuHide(): void {
    this.statusMenuExpanded.set(false);

    const host = this.statusSplitButtonEl()?.nativeElement;
    const doc = host?.ownerDocument;
    const active = doc?.activeElement;

    if (!host || !doc) {
      return;
    }

    const focusLost =
      !active || active === doc.body || !!active.closest('.p-tieredmenu');

    if (!focusLost) {
      return;
    }

    const selector =
      this.statusMenuOpener === 'dropdown'
        ? '.p-splitbutton-dropdown'
        : '.p-splitbutton-button';
    host.querySelector<HTMLElement>(selector)?.focus();
  }

  onStatusMenuItemSelect(item: MenuItem): void {
    if (this.loading() || item.disabled) {
      return;
    }

    this.statusMenuSelect.emit(item);
  }

  onInfoTagClick(tag: ProfileHeaderInfoTag): void {
    if (this.loading() || !tag.filterKey) {
      return;
    }

    const key = tag.filterKey;
    this.selectedInfoTagFilterKey.update((current) =>
      current === key ? null : key,
    );
    this.infoTagClick.emit(tag);
  }

  onIdentifierCopy(identifier: ProfileHeaderIdentifier): void {
    if (this.loading()) {
      return;
    }

    this.identifierCopy.emit(identifier);
  }

  protected isInfoTagPressed(tag: ProfileHeaderInfoTag): boolean {
    return (
      !!tag.filterKey && this.selectedInfoTagFilterKey() === tag.filterKey
    );
  }
}
