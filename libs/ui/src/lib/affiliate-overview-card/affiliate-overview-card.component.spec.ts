import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import { getPlectrumAvatarIllustrationSrc } from '../plectrum-avatar/plectrum-avatar.assets';
import {
  AffiliateOverviewCardComponent,
  type AffiliateOverviewIdentifier,
} from './affiliate-overview-card.component';

const SAMPLE_IDENTIFIERS: AffiliateOverviewIdentifier[] = [
  { label: 'NISS', value: '85.12.30-123.45' },
  { label: 'Mutuelle', value: 'Solidaris Liège' },
];

describe('AffiliateOverviewCardComponent', () => {
  let component: AffiliateOverviewCardComponent;
  let fixture: ComponentFixture<AffiliateOverviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateOverviewCardComponent],
      providers: [
        {
          provide: IconRegistry,
          useFactory: () => {
            const registry = new IconRegistry();
            registerPlectrumIcons(registry);
            return registry;
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Dupont, Marie');
    fixture.componentRef.setInput('avatarInitials', 'DM');
    fixture.componentRef.setInput('identifiers', SAMPLE_IDENTIFIERS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render semantic article landmark', () => {
    const article = fixture.nativeElement.querySelector('article');
    expect(article).toBeTruthy();
  });

  it('should render h2 title when not loading', () => {
    const heading = fixture.nativeElement.querySelector(
      'h2.c-affiliate-overview-card__title',
    );
    expect(heading?.textContent?.trim()).toBe('Dupont, Marie');
  });

  it('should render large illustrated avatar when not loading', () => {
    const avatar = fixture.nativeElement.querySelector(
      'sds-plectrum-avatar.c-affiliate-overview-card__avatar',
    );
    expect(avatar).toBeTruthy();
    expect(avatar.classList.contains('c-plectrum-avatar--large')).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.c-plectrum-avatar__illustration'),
    ).toBeTruthy();
  });

  it('should pass avatar gender and variant to illustrated avatar', () => {
    fixture.componentRef.setInput('avatarGender', 'male');
    fixture.componentRef.setInput('avatarVariant', 2);
    fixture.detectChanges();

    const illustration = fixture.nativeElement.querySelector(
      '.c-plectrum-avatar__illustration',
    ) as HTMLImageElement;

    expect(illustration.getAttribute('src')).toBe(
      getPlectrumAvatarIllustrationSrc('male', 2),
    );
  });

  it('should render copy icon in identifier buttons', () => {
    const icons = fixture.nativeElement.querySelectorAll(
      'sds-icon.c-affiliate-overview-card__identifier-icon',
    );

    expect(icons.length).toBe(SAMPLE_IDENTIFIERS.length);
  });

  it('should mark copy icons as decorative aria-hidden', () => {
    const icons = fixture.nativeElement.querySelectorAll(
      'sds-icon.c-affiliate-overview-card__identifier-icon',
    );

    icons.forEach((icon: Element) => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should set avatar aria-label from title', () => {
    const avatar = fixture.nativeElement.querySelector(
      'sds-plectrum-avatar.c-affiliate-overview-card__avatar',
    );

    expect(avatar?.getAttribute('aria-label')).toBe('Dupont, Marie');
  });

  it('should apply host layout class', () => {
    expect(
      fixture.nativeElement.classList.contains('o-layout--full-width'),
    ).toBe(true);
  });

  it('should apply variant modifier class on card', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card--warning',
    );
    expect(card).toBeTruthy();
  });

  it('should apply in-order variant modifier class on card', () => {
    fixture.componentRef.setInput('variant', 'in-order');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card--in-order',
    );
    expect(card).toBeTruthy();
  });

  it('should apply is-loading modifier when loading input is set', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card.is-loading',
    );
    expect(card).toBeTruthy();
  });

  it('should render identifier copy buttons with values', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      '.c-affiliate-overview-card__identifier',
    );

    expect(buttons.length).toBe(SAMPLE_IDENTIFIERS.length);
    expect(buttons[0].textContent).toContain('NISS');
    expect(buttons[0].textContent).toContain('85.12.30-123.45');
  });

  it('should render bullet separators between identifier chips', () => {
    const separators = fixture.nativeElement.querySelectorAll(
      '.c-affiliate-overview-card__identifier-separator',
    );

    expect(separators.length).toBe(SAMPLE_IDENTIFIERS.length - 1);
    expect(separators[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('should set copy button aria-label', () => {
    const button = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__identifier',
    ) as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Copier NISS');
  });

  it('should emit identifierCopy when an identifier chip is clicked', () => {
    const onCopy = jasmine.createSpy('identifierCopy');
    component.identifierCopy.subscribe(onCopy);

    const button = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__identifier',
    ) as HTMLButtonElement;
    button.click();

    expect(onCopy).toHaveBeenCalledOnceWith(SAMPLE_IDENTIFIERS[0]);
  });

  it('should show status split button for warning variant with statusAction', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.componentRef.setInput('statusAction', {
      label: 'Action requise',
      icon: 'bi bi-exclamation-triangle-fill',
    });
    fixture.detectChanges();

    const splitButton = fixture.nativeElement.querySelector('p-splitbutton');
    expect(splitButton).toBeTruthy();
  });

  it('should not show status split button for default variant', () => {
    fixture.componentRef.setInput('statusAction', { label: 'Action requise' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-splitbutton')).toBeFalsy();
  });

  it('should hide status split button when loading', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.componentRef.setInput('statusAction', { label: 'Action requise' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p-splitbutton')).toBeTruthy();

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p-splitbutton')).toBeFalsy();
  });

  it('should emit statusActionClick when split button main action fires', () => {
    const onStatusAction = jasmine.createSpy('statusActionClick');
    component.statusActionClick.subscribe(onStatusAction);
    fixture.componentRef.setInput('variant', 'warning');
    fixture.componentRef.setInput('statusAction', { label: 'Action requise' });
    fixture.detectChanges();

    component.onStatusActionClick();

    expect(onStatusAction).toHaveBeenCalledTimes(1);
  });

  it('should emit statusMenuSelect when a menu item is selected', () => {
    const onMenuSelect = jasmine.createSpy('statusMenuSelect');
    component.statusMenuSelect.subscribe(onMenuSelect);
    const menuItem = { label: 'Relancer' };

    component.onStatusMenuItemClick(menuItem);

    expect(onMenuSelect).toHaveBeenCalledOnceWith(menuItem);
  });

  it('should emit primaryActionClick when primary button is clicked', () => {
    const onPrimary = jasmine.createSpy('primaryActionClick');
    component.primaryActionClick.subscribe(onPrimary);
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__primary-action',
    ) as HTMLButtonElement;
    button.click();

    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('should emit primaryActionClick when the primary action shortcut is pressed', () => {
    const onPrimary = jasmine.createSpy('primaryActionClick');
    component.primaryActionClick.subscribe(onPrimary);
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.detectChanges();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', bubbles: true }),
    );

    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('should expose aria-keyshortcuts on the primary action button', () => {
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__primary-action',
    ) as HTMLButtonElement;

    expect(button.getAttribute('aria-keyshortcuts')).toBe('Alt+A');
  });

  it('should not emit primaryActionClick for shortcut when loading', () => {
    const onPrimary = jasmine.createSpy('primaryActionClick');
    component.primaryActionClick.subscribe(onPrimary);
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', bubbles: true }),
    );

    expect(onPrimary).not.toHaveBeenCalled();
  });

  it('should not emit primaryActionClick for shortcut while typing in an input', () => {
    const onPrimary = jasmine.createSpy('primaryActionClick');
    component.primaryActionClick.subscribe(onPrimary);
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.detectChanges();

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.dispatchEvent(
      new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', bubbles: true }),
    );
    document.body.removeChild(input);

    expect(onPrimary).not.toHaveBeenCalled();
  });

  it('should hide primary action when loading', () => {
    fixture.componentRef.setInput('primaryAction', { label: 'Voir carte affilié' });
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__primary-action',
    );
    expect(button).toBeFalsy();
  });

  it('should set aria-labelledby when not loading', () => {
    const article = fixture.nativeElement.querySelector('article');
    expect(article.getAttribute('aria-labelledby')).toBeTruthy();
    expect(article.getAttribute('aria-busy')).toBeFalsy();
  });

  it('should set aria-label and aria-busy when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const article = fixture.nativeElement.querySelector('article');
    expect(article.getAttribute('aria-labelledby')).toBeNull();
    expect(article.getAttribute('aria-label')).toBe('Dupont, Marie');
    expect(article.getAttribute('aria-busy')).toBe('true');
  });

  it('should render filterable info tags as toggle buttons', () => {
    fixture.componentRef.setInput('infoTags', [
      { label: 'Documents actifs:', value: '3', filterKey: 'active-documents' },
    ]);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector(
      'p-togglebutton.c-affiliate-overview-card__info-tag',
    ) as HTMLElement;
    const value = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__info-tag-value',
    );

    expect(toggle).toBeTruthy();
    expect(toggle.classList.contains('p-togglebutton')).toBe(true);
    expect(toggle.classList.contains('p-togglebutton-sm')).toBe(true);
    expect(toggle.classList.contains('c-affiliate-overview-card__info-tag--filterable')).toBe(true);
    expect(toggle.getAttribute('role')).toBe('button');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Documents actifs: 3');
    expect(value?.textContent?.trim()).toBe('3');
  });

  it('should render display-only info tags without filter interaction', () => {
    fixture.componentRef.setInput('infoTags', [
      { label: 'Documents actifs:', value: '3' },
    ]);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button.c-affiliate-overview-card__info-tag',
    ) as HTMLButtonElement;

    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(button.classList.contains('c-affiliate-overview-card__info-tag--filterable')).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('p-togglebutton'),
    ).toBeFalsy();
  });

  it('should emit infoTagClick when a filterable info tag is clicked', () => {
    const onInfoTagClick = jasmine.createSpy('infoTagClick');
    component.infoTagClick.subscribe(onInfoTagClick);
    const tag = {
      label: 'Documents actifs:',
      value: '3',
      filterKey: 'active-documents' as const,
    };

    fixture.componentRef.setInput('infoTags', [tag]);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector(
      'p-togglebutton.c-affiliate-overview-card__info-tag',
    ) as HTMLElement;
    toggle.click();

    expect(onInfoTagClick).toHaveBeenCalledOnceWith(tag);
  });

  it('should mark active info tags as checked toggle buttons', async () => {
    fixture.componentRef.setInput('infoTags', [
      {
        label: 'Documents clôturés:',
        value: '3',
        filterKey: 'closed-documents',
        active: true,
      },
    ]);
    fixture.detectChanges();
    // ngModel writes the control value to the toggle on a microtask.
    await fixture.whenStable();
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector(
      'p-togglebutton.c-affiliate-overview-card__info-tag',
    ) as HTMLElement;

    expect(toggle.classList.contains('p-togglebutton-checked')).toBe(true);
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('should not emit infoTagClick when loading', () => {
    const onInfoTagClick = jasmine.createSpy('infoTagClick');
    component.infoTagClick.subscribe(onInfoTagClick);
    fixture.componentRef.setInput('infoTags', [
      {
        label: 'Documents actifs:',
        value: '3',
        filterKey: 'active-documents',
      },
    ]);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    component.onInfoTagClick({
      label: 'Documents actifs:',
      value: '3',
      filterKey: 'active-documents',
    });

    expect(onInfoTagClick).not.toHaveBeenCalled();
  });

  it('should mark shortcut badge as aria-hidden', () => {
    fixture.componentRef.setInput('primaryAction', {
      label: 'Voir carte affilié',
      shortcut: 'ALT + A',
    });
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector(
      '.c-affiliate-overview-card__shortcut-badge',
    );
    expect(badge.getAttribute('aria-hidden')).toBe('true');
  });

  it('should link article aria-labelledby to the title heading id', () => {
    const article = fixture.nativeElement.querySelector('article');
    const heading = fixture.nativeElement.querySelector(
      'h2.c-affiliate-overview-card__title',
    ) as HTMLHeadingElement;

    expect(article.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBeTruthy();
  });

  it('should set French expand aria-label on status split button menu toggle', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.componentRef.setInput('statusAction', {
      label: 'Action requise',
      icon: 'bi bi-exclamation-triangle-fill',
    });
    fixture.detectChanges();

    const menuToggle = fixture.nativeElement.querySelector(
      '.p-splitbutton-dropdown',
    ) as HTMLButtonElement;

    expect(menuToggle.getAttribute('aria-label')).toBe(
      'Afficher le menu pour Action requise',
    );
    expect(menuToggle.getAttribute('aria-haspopup')).toBe('true');
  });

  it('should show danger split button for danger variant with statusAction', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.componentRef.setInput('statusAction', {
      label: 'Critique',
      icon: 'bi bi-exclamation-octagon-fill',
    });
    fixture.detectChanges();

    const splitButton = fixture.nativeElement.querySelector('p-splitbutton');
    expect(splitButton).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.p-splitbutton-dropdown')?.getAttribute('aria-label'),
    ).toBe('Afficher le menu pour Critique');
  });

  it('should not emit identifierCopy when loading', () => {
    const onCopy = jasmine.createSpy('identifierCopy');
    component.identifierCopy.subscribe(onCopy);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    component.onIdentifierCopy(SAMPLE_IDENTIFIERS[0]);

    expect(onCopy).not.toHaveBeenCalled();
  });

  it('should not emit statusActionClick when loading', () => {
    const onStatusAction = jasmine.createSpy('statusActionClick');
    component.statusActionClick.subscribe(onStatusAction);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    component.onStatusActionClick();

    expect(onStatusAction).not.toHaveBeenCalled();
  });

  it('should not emit primaryActionClick when loading', () => {
    const onPrimary = jasmine.createSpy('primaryActionClick');
    component.primaryActionClick.subscribe(onPrimary);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    component.onPrimaryActionClick();

    expect(onPrimary).not.toHaveBeenCalled();
  });
});
