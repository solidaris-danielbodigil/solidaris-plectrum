import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { MenuItem } from 'primeng/api';
import { PDS_LOCALE_STORAGE_KEY, providePdsLocale } from '../i18n';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { getPlectrumAvatarIllustrationSrc } from '../plectrum-avatar/plectrum-avatar.assets';
import { ProfileHeaderComponent } from './profile-header.component';
import type {
  ProfileHeaderIdentifier,
  ProfileHeaderInfoTag,
  ProfileHeaderStatusAction,
} from './profile-header.types';

const IDENTIFIERS: ProfileHeaderIdentifier[] = [
  { label: 'NISS', value: '85.12.30-123.45' },
  { label: 'Mutuelle', value: 'Solidaris Liège' },
];

const INFO_TAGS: ProfileHeaderInfoTag[] = [
  { label: 'Dernière action:', value: '02/06/2026', filterKey: 'last-action' },
  { label: 'Documents actifs:', value: '2', filterKey: 'active-documents', active: true },
  { label: 'Mutuelle:', value: 'Liège' },
];

const STATUS_MENU: MenuItem[] = [
  { id: 'c4', label: 'C4 non reçu' },
  { id: 'other', label: 'Autre action', disabled: true },
];

const iconProviders = [
  {
    provide: IconRegistry,
    useFactory: () => {
      const registry = new IconRegistry();
      registerPlectrumIcons(registry);
      return registry;
    },
  },
];

function query<T extends Element = HTMLElement>(
  fixture: ComponentFixture<unknown>,
  selector: string,
): T | null {
  return (fixture.nativeElement as HTMLElement).querySelector<T>(selector);
}

function queryAll<T extends Element = HTMLElement>(
  fixture: ComponentFixture<unknown>,
  selector: string,
): T[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<T>(selector),
  );
}

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async () => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
      providers: iconProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Dupont, Marie');
    fixture.componentRef.setInput('avatarInitials', 'DM');
    fixture.componentRef.setInput('identifiers', IDENTIFIERS);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockReturnValue(Promise.resolve()) },
    });
    fixture.detectChanges();
  });

  function setStatus(action: ProfileHeaderStatusAction | null): void {
    fixture.componentRef.setInput('statusAction', action);
    fixture.detectChanges();
  }

  function setPrimaryAction(): void {
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.detectChanges();
  }

  describe('frame', () => {
    it('applies the BEM host and full-width layout classes', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList).toContain('c-profile-header');
      expect(host.classList).toContain('c-profile-header--default');
      expect(host.classList).toContain('o-layout--full-width');
    });

    it('renders an article labelled by the h2 title', () => {
      const article = query(fixture, 'article');
      const heading = query(fixture, 'h2.c-profile-header__title');
      expect(heading?.textContent?.trim()).toBe('Dupont, Marie');
      expect(article?.getAttribute('aria-labelledby')).toBe(heading?.id);
      expect(article?.getAttribute('aria-busy')).toBeNull();
    });

    it('renders the large illustrated avatar as decoration (no tab stop, no second name)', () => {
      fixture.componentRef.setInput('avatarGender', 'male');
      fixture.componentRef.setInput('avatarVariant', 2);
      fixture.detectChanges();
      const avatar = query(fixture, 'pds-plectrum-avatar.c-profile-header__avatar');
      expect(avatar?.classList).toContain('c-plectrum-avatar--large');
      expect(avatar?.getAttribute('tabindex')).toBeNull();
      expect(avatar?.getAttribute('aria-label')).toBeNull();
      expect(avatar?.getAttribute('aria-hidden')).toBe('true');
      expect(
        query<HTMLImageElement>(fixture, '.c-plectrum-avatar__illustration')?.getAttribute('src'),
      ).toBe(getPlectrumAvatarIllustrationSrc('male', 2));
    });

    it('takes the variant modifier when no status severity is set', () => {
      fixture.componentRef.setInput('variant', 'in-order');
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).classList).toContain(
        'c-profile-header--in-order',
      );
    });

    it('derives the gradient modifier from statusAction.severity', () => {
      fixture.componentRef.setInput('variant', 'in-order');
      setStatus({ label: 'C4 non reçu', severity: 'warn' });
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList).toContain('c-profile-header--warning');
      expect(host.classList).not.toContain('c-profile-header--in-order');
      setStatus({ label: 'Critique', severity: 'danger' });
      expect(host.classList).toContain('c-profile-header--danger');
    });
  });

  describe('name action', () => {
    it('renders an outlined primary button with the name and the person-square icon', () => {
      setPrimaryAction();
      const button = query<HTMLButtonElement>(fixture, 'h2 button.c-profile-header__name');
      expect(button?.classList).toContain('p-button-outlined');
      expect(button?.querySelector('.c-profile-header__name-text')?.textContent?.trim()).toBe(
        'Dupont, Marie',
      );
      expect(button?.querySelector('.c-profile-header__name-icon')?.classList).toContain(
        'bi-person-square',
      );
      expect(button?.getAttribute('aria-label')).toBe('Dupont, Marie — Voir carte affilié');
      expect(button?.getAttribute('aria-keyshortcuts')).toBe('Alt+A');
      expect(button?.getAttribute('data-telemetry-id')).toBe('profile-header-name-action');
    });

    it('uses primaryAction.icon when set', () => {
      fixture.componentRef.setInput('primaryAction', { label: 'Voir', icon: 'bi bi-eye' });
      fixture.detectChanges();
      expect(query(fixture, '.c-profile-header__name-icon')?.classList).toContain('bi-eye');
    });

    it('emits primaryActionClick on click and on the shortcut', () => {
      setPrimaryAction();
      const spy = vi.fn();
      component.primaryActionClick.subscribe(spy);
      query<HTMLButtonElement>(fixture, '.c-profile-header__name')?.click();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', key: 'a', bubbles: true }),
      );
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('ignores the shortcut while typing and while loading', () => {
      setPrimaryAction();
      const spy = vi.fn();
      component.primaryActionClick.subscribe(spy);
      const input = document.createElement('input');
      document.body.append(input);
      input.dispatchEvent(
        new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', key: 'a', bubbles: true }),
      );
      input.remove();
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', key: 'a', bubbles: true }),
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('status action', () => {
    it('is absent without statusAction', () => {
      expect(query(fixture, '.c-profile-header__status-action')).toBeNull();
    });

    it('renders a single action as a Button with the severity icon and emits statusActionClick', () => {
      setStatus({ label: 'En ordre', severity: 'success' });
      const button = query<HTMLButtonElement>(fixture, 'button.c-profile-header__status-action');
      expect(button?.classList).toContain('p-button-success');
      expect(button?.querySelector('.c-profile-header__status-icon')?.classList).toContain(
        'bi-check-lg',
      );
      expect(button?.getAttribute('aria-label')).toBe('En ordre');
      const spy = vi.fn();
      component.statusActionClick.subscribe(spy);
      button?.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('uses the warn and danger Figma icons', () => {
      setStatus({ label: 'C4', severity: 'warn' });
      expect(query(fixture, '.c-profile-header__status-icon')?.classList).toContain(
        'bi-exclamation-triangle',
      );
      setStatus({ label: 'Critique', severity: 'danger' });
      expect(query(fixture, '.c-profile-header__status-icon')?.classList).toContain(
        'bi-exclamation-octagon',
      );
    });

    it('renders the locale prefix and a contrast badge for tagValue', () => {
      setStatus({ label: 'C4 non reçu', tagValue: 'C4', severity: 'warn', ariaLabel: 'Voir C4' });
      const button = query(fixture, 'button.c-profile-header__status-action');
      expect(button?.textContent).toContain('Actions à réaliser:');
      const badge = button?.querySelector('p-badge');
      expect(badge?.textContent?.trim()).toBe('C4');
      expect(badge?.classList).toContain('p-badge-contrast');
      expect(button?.getAttribute('aria-label')).toBe('Voir C4');
    });

    it('names a tagValue action after its visible text, then the label (WCAG 2.5.3)', () => {
      setStatus({ label: 'C4 non reçu', tagValue: 'C4', severity: 'warn' });
      expect(
        query(fixture, 'button.c-profile-header__status-action')?.getAttribute('aria-label'),
      ).toBe('Actions à réaliser: C4 — C4 non reçu');
    });

    it('runs the only menu item from the plain Button instead of dropping it', () => {
      const command = vi.fn();
      const item: MenuItem = { id: 'c4', label: 'C4 non reçu', command };
      setStatus({ label: 'Actions à réaliser', severity: 'warn', menuItems: [item] });
      expect(query(fixture, 'p-splitbutton')).toBeNull();
      const selectSpy = vi.fn();
      const clickSpy = vi.fn();
      component.statusMenuSelect.subscribe(selectSpy);
      component.statusActionClick.subscribe(clickSpy);
      query<HTMLButtonElement>(fixture, 'button.c-profile-header__status-action')?.click();
      expect(command).toHaveBeenCalledWith(expect.objectContaining({ item }));
      expect(selectSpy).toHaveBeenCalledWith(item);
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('disables the plain Button when its only menu item is disabled', () => {
      setStatus({
        label: 'Actions à réaliser',
        severity: 'warn',
        menuItems: [{ id: 'c4', label: 'C4 non reçu', disabled: true }],
      });
      expect(
        query<HTMLButtonElement>(fixture, 'button.c-profile-header__status-action')?.disabled,
      ).toBe(true);
    });

    it('does not emit when disabled', () => {
      setStatus({ label: 'C4', severity: 'warn', disabled: true });
      const button = query<HTMLButtonElement>(fixture, 'button.c-profile-header__status-action');
      expect(button?.disabled).toBe(true);
      const spy = vi.fn();
      component.statusActionClick.subscribe(spy);
      component.onStatusActionClick();
      expect(spy).not.toHaveBeenCalled();
    });

    it('renders a SplitButton with the count when menuItems has more than one entry', () => {
      setStatus({ label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU });
      const split = query(fixture, 'p-splitbutton.c-profile-header__status-action');
      expect(split).not.toBeNull();
      const [main, toggle] = Array.from(split!.querySelectorAll('button'));
      expect(main.getAttribute('aria-label')).toBe('Actions à réaliser (2)');
      expect(main.getAttribute('aria-haspopup')).toBe('menu');
      expect(main.getAttribute('aria-expanded')).toBe('false');
      expect(main.textContent).toContain('Actions à réaliser');
      expect(main.querySelector('p-badge')?.textContent?.trim()).toBe('2');
      expect(toggle.getAttribute('aria-label')).toBe('Afficher le menu pour Actions à réaliser');
      expect(toggle.getAttribute('aria-haspopup')).toBe('true');
      expect(toggle.querySelector('.bi-chevron-down')).not.toBeNull();
    });

    it('opens the menu from the main button without emitting statusActionClick', async () => {
      vi.useFakeTimers();
      try {
        setStatus({ label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU });
        const clickSpy = vi.fn();
        component.statusActionClick.subscribe(clickSpy);
        const main = query<HTMLButtonElement>(fixture, 'p-splitbutton button');
        main?.click();
        vi.runAllTimers();
        fixture.detectChanges();
        await vi.waitFor(() =>
          expect(document.body.querySelector('.p-tieredmenu')).not.toBeNull(),
        );
        expect(document.body.textContent).toContain('C4 non reçu');
        expect(clickSpy).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('returns focus to the half that opened the menu when it closes (WCAG 2.4.3)', async () => {
      setStatus({ label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU });
      const [main, toggle] = Array.from(
        query(fixture, 'p-splitbutton')!.querySelectorAll<HTMLButtonElement>('button'),
      );
      const menuList = () =>
        document.body.querySelector<HTMLElement>('.p-tieredmenu [role="menu"]');
      // TieredMenu moves focus into its list once open; Escape there closes it.
      const escapeFromMenu = async () => {
        await vi.waitFor(() => {
          fixture.detectChanges();
          expect(menuList()).not.toBeNull();
        });
        fixture.detectChanges();
        menuList()!.focus();
        menuList()!.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }),
        );
        fixture.detectChanges();
      };

      main.focus();
      main.click();
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(main.getAttribute('aria-expanded')).toBe('true');
      });
      await escapeFromMenu();
      expect(document.activeElement).toBe(main);
      expect(main.getAttribute('aria-expanded')).toBe('false');

      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(menuList()).toBeNull();
      });
      toggle.focus();
      toggle.click();
      await escapeFromMenu();
      expect(document.activeElement).toBe(toggle);
    });

    it('leaves focus alone when an item command moved it elsewhere', () => {
      setStatus({ label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU });
      const outside = document.createElement('button');
      document.body.append(outside);
      try {
        outside.focus();
        (component as unknown as { onStatusMenuHide: () => void }).onStatusMenuHide();
        expect(document.activeElement).toBe(outside);
      } finally {
        outside.remove();
      }
    });

    it('emits statusMenuSelect with the original item and skips disabled items', () => {
      setStatus({ label: 'Actions à réaliser', severity: 'warn', menuItems: STATUS_MENU });
      const spy = vi.fn();
      component.statusMenuSelect.subscribe(spy);
      const model = (component as unknown as { statusMenuModel: () => MenuItem[] }).statusMenuModel();
      model[0].command?.({ item: model[0] });
      component.onStatusMenuItemSelect(STATUS_MENU[1]);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(STATUS_MENU[0]);
    });

    it('is replaced by skeletons while loading', () => {
      setStatus({ label: 'C4', severity: 'warn' });
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(query(fixture, '.c-profile-header__status-action')).toBeNull();
      expect(query(fixture, '.c-profile-header__skeleton-slot--status')).not.toBeNull();
    });
  });

  describe('info tags', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('infoTags', INFO_TAGS);
      fixture.detectChanges();
    });

    async function settle(): Promise<void> {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    function toggles(): HTMLElement[] {
      return queryAll(fixture, 'p-togglebutton.c-profile-header__info-tag');
    }

    it('renders filterable tags as PrimeNG ToggleButtons in a named group', async () => {
      await settle();
      const group = query(fixture, '.c-profile-header__info-tags');
      expect(group?.getAttribute('role')).toBe('group');
      expect(group?.getAttribute('aria-label')).toBe('Filtres rapides');
      const buttons = toggles();
      expect(buttons.length).toBe(2);
      expect(buttons.map((b) => b.getAttribute('role'))).toEqual(['button', 'button']);
      expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
      expect(buttons[1].classList).toContain('p-togglebutton-checked');
      expect(buttons[1].classList).toContain('p-togglebutton-sm');
      // Accessible name = visible text (no aria-label).
      expect(buttons[0].getAttribute('aria-label')).toBeNull();
      expect(buttons[0].querySelector('.c-profile-header__info-tag-label')?.textContent).toBe(
        'Dernière action:',
      );
      expect(buttons[0].querySelector('.c-profile-header__info-tag-value')?.textContent).toBe(
        '02/06/2026',
      );
    });

    it('marks only the pressed toggle with a check icon (not colour alone)', async () => {
      await settle();
      const [lastAction, active] = toggles();
      expect(lastAction.querySelector('.c-profile-header__info-tag-icon')).toBeNull();
      const icon = active.querySelector('.c-profile-header__info-tag-icon');
      expect(icon?.classList).toContain('bi-check-lg');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders display-only tags as plain secondary Tags', () => {
      const tag = query(fixture, 'p-tag.c-profile-header__info-tag-static');
      expect(tag?.textContent).toContain('Liège');
      expect(tag?.closest('button')).toBeNull();
    });

    it('toggles one pressed tag at a time and emits infoTagClick', async () => {
      await settle();
      const spy = vi.fn();
      component.infoTagClick.subscribe(spy);
      const [lastAction, active] = toggles();
      lastAction.click();
      await settle();
      expect(lastAction.getAttribute('aria-pressed')).toBe('true');
      expect(active.getAttribute('aria-pressed')).toBe('false');
      lastAction.click();
      await settle();
      expect(lastAction.getAttribute('aria-pressed')).toBe('false');
      expect(active.getAttribute('aria-pressed')).toBe('false');
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(INFO_TAGS[0]);
    });

    it('re-seeds the pressed tag when the input changes', async () => {
      fixture.componentRef.setInput('infoTags', [
        { ...INFO_TAGS[0], active: true },
        { ...INFO_TAGS[1], active: false },
      ]);
      await settle();
      const buttons = toggles();
      expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
    });

    it('does not emit while loading', () => {
      const spy = vi.fn();
      component.infoTagClick.subscribe(spy);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      component.onInfoTagClick(INFO_TAGS[0]);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('identifiers', () => {
    it('renders copy chips with the icon at the end, a regular label and bullet separators', () => {
      const chips = queryAll(fixture, 'pds-copyable-text');
      expect(chips.length).toBe(2);
      const button = chips[0].querySelector('button')!;
      expect(button.classList).toContain('c-copyable-text--label-regular');
      expect(button.lastElementChild?.classList).toContain('c-copyable-text__icon');
      expect(button.getAttribute('aria-label')).toBe('Copier NISS');
      const separators = queryAll(fixture, '.c-profile-header__identifiers .c-profile-header__identifier-separator');
      expect(separators.length).toBe(1);
      expect(separators[0].getAttribute('aria-hidden')).toBe('true');
    });

    it('emits identifierCopy after a copy', async () => {
      const spy = vi.fn();
      component.identifierCopy.subscribe(spy);
      query<HTMLButtonElement>(fixture, 'pds-copyable-text button')?.click();
      await vi.waitFor(() => expect(spy).toHaveBeenCalledWith(IDENTIFIERS[0]));
    });

    it('does not emit while loading', () => {
      const spy = vi.fn();
      component.identifierCopy.subscribe(spy);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      component.onIdentifierCopy(IDENTIFIERS[0]);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('marks the article busy and shows skeleton blocks', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const article = query(fixture, 'article');
      expect(article?.getAttribute('aria-busy')).toBe('true');
      expect(article?.getAttribute('aria-label')).toBe('Dupont, Marie');
      expect(article?.getAttribute('aria-labelledby')).toBeNull();
      expect((fixture.nativeElement as HTMLElement).classList).toContain('is-loading');
      expect(queryAll(fixture, '.c-profile-header__skeleton-slot--identifier').length).toBe(4);
      expect(query(fixture, '.c-profile-header__skeleton-slot--name')).not.toBeNull();
      expect(query(fixture, 'pds-copyable-text')).toBeNull();
    });
  });
});

@Component({
  standalone: true,
  imports: [ProfileHeaderComponent],
  template: `
    <pds-profile-header title="Eva Martinez">
      <button slot="actions" type="button">Action</button>
      <span slot="aside">A-valoir</span>
      <nav slot="nav">Tabs</nav>
    </pds-profile-header>
  `,
})
class SlotsHostComponent {}

describe('ProfileHeaderComponent slots', () => {
  it('projects actions, aside and nav and leaves empty slots empty', async () => {
    await TestBed.configureTestingModule({
      imports: [SlotsHostComponent],
      providers: iconProviders,
    }).compileComponents();
    const fixture = TestBed.createComponent(SlotsHostComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.c-profile-header__actions')?.textContent).toContain('Action');
    expect(root.querySelector('.c-profile-header__aside')?.textContent).toContain('A-valoir');
    expect(root.querySelector('.c-profile-header__nav')?.textContent).toContain('Tabs');
    expect(root.querySelector('.c-profile-header__nav-end')?.childElementCount).toBe(0);
    expect(
      getComputedStyle(root.querySelector('.c-profile-header__nav-end')!).display,
    ).toBe('none');
  });
});

describe('ProfileHeaderComponent (nl)', () => {
  it('renders Dutch copy', async () => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
      providers: [...iconProviders, providePdsLocale('nl')],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProfileHeaderComponent);
    fixture.componentRef.setInput('title', 'Eva Martinez');
    fixture.componentRef.setInput('infoTags', INFO_TAGS);
    fixture.componentRef.setInput('statusAction', {
      label: 'C4 niet ontvangen',
      tagValue: 'C4',
      severity: 'warn',
    });
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.c-profile-header__status-action')?.textContent).toContain(
      'Uit te voeren acties:',
    );
    expect(root.querySelector('.c-profile-header__info-tags')?.getAttribute('aria-label')).toBe(
      'Snelfilters',
    );
  });
});
