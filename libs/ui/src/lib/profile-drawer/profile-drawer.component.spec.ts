import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Accordion } from 'primeng/accordion';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { PDS_LOCALE } from '../i18n';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import {
  ProfileDrawerComponent,
  type ProfileDrawerData,
} from './profile-drawer.component';

const SAMPLE_DATA: ProfileDrawerData = {
  name: 'Eva Martinez',
  avatarInitials: 'EM',
  avatarGender: 'female',
  avatarVariant: 1,
  identifiers: [
    { label: 'Territoire', value: '315' },
    { label: 'NSI', value: '00004212182' },
  ],
  generalRows: [
    { label: 'NSI', value: '00004212182' },
    { label: 'Date de naissance', value: '14/08/1989 (36 ans)' },
  ],
  contactRows: [
    { label: 'E-mail', value: 'lies.verhoeven@gmail.com' },
  ],
  relatedMembers: [
    { initials: 'Q', name: 'Quinten Mota', relationship: 'partenaire', color: 'blue' },
    { initials: 'S', name: 'Shiloh Mota', relationship: 'enfant à charge', color: 'green' },
    { initials: 'J', name: 'Jack Mota', relationship: 'enfant à charge', color: 'yellow' },
  ],
  notes: [
    {
      author: 'Eva de Moyer',
      timestamp: '11/11/2022, 09:10',
      body: 'Personne agressive',
      tagLabel: 'Informations sensibles',
      severity: 'sensitive',
    },
    {
      author: 'Bert Luyckx',
      timestamp: '02/12/2023, 16:18',
      body: 'Remarque',
      tagLabel: 'Remarque libre',
      severity: 'neutral',
    },
  ],
};

describe('ProfileDrawerComponent', () => {
  let component: ProfileDrawerComponent;
  let fixture: ComponentFixture<ProfileDrawerComponent>;

  async function openDrawer(): Promise<void> {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDrawerComponent],
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

    fixture = TestBed.createComponent(ProfileDrawerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', SAMPLE_DATA);
    fixture.componentRef.setInput('modal', false);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: jasmine
          .createSpy('writeText')
          .and.returnValue(Promise.resolve()),
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the drawer content when not visible', () => {
    expect(
      document.querySelector('.p-drawer .o-layout--full-height'),
    ).toBeFalsy();
  });

  it('should render the affiliate name when visible', async () => {
    await openDrawer();

    const name = document.querySelector('.p-drawer h2');
    expect(name?.textContent?.trim()).toBe('Eva Martinez');
  });

  it('should render the large illustrated avatar', async () => {
    await openDrawer();

    const avatar = document.querySelector(
      'pds-plectrum-avatar.c-drawer__profile-avatar',
    );
    expect(avatar).toBeTruthy();
    expect(avatar?.classList.contains('c-plectrum-avatar--large')).toBe(true);
  });

  it('should render copyable identifier buttons with label and value', async () => {
    await openDrawer();

    const identifiers = document.querySelectorAll(
      '.c-copyable-text',
    );
    expect(identifiers.length).toBe(SAMPLE_DATA.identifiers.length);
    expect(identifiers[0].textContent).toContain('Territoire');
    expect(identifiers[0].textContent).toContain('315');
  });

  it('should set the copy aria-label on identifier buttons', async () => {
    await openDrawer();

    const button = document.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Copier Territoire');
  });

  it('should emit identifierCopy when an identifier button is clicked', async () => {
    await openDrawer();
    const onCopy = jasmine.createSpy('identifierCopy');
    component.identifierCopy.subscribe(onCopy);

    const button = document.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(onCopy).toHaveBeenCalledOnceWith(SAMPLE_DATA.identifiers[0]);
  });

  it('should render the Détails/Documents select button', async () => {
    await openDrawer();

    const selectButton = fixture.debugElement.query(By.directive(SelectButton));
    expect(selectButton).toBeTruthy();
  });

  it('should render the Famille and Notes accordions', async () => {
    await openDrawer();

    const accordions = fixture.debugElement.queryAll(By.directive(Accordion));
    expect(accordions.length).toBe(2);
  });

  it('should render family members with their coloured avatars and initials', async () => {
    await openDrawer();

    const avatars = document.querySelectorAll(
      'pds-plectrum-avatar.c-drawer__profile-family-avatar',
    );
    expect(avatars.length).toBe(3);
    expect(avatars[0].classList.contains('c-plectrum-avatar--color-blue')).toBe(true);
    expect(avatars[1].classList.contains('c-plectrum-avatar--color-green')).toBe(true);
    expect(avatars[2].classList.contains('c-plectrum-avatar--color-yellow')).toBe(true);

    const initials = document.querySelectorAll(
      '.c-drawer__profile-family-avatar .c-plectrum-avatar__initials',
    );
    expect(initials[0].textContent?.trim()).toBe('Q');
    expect(initials[2].textContent?.trim()).toBe('J');
  });

  it('should render family member names and relationships', async () => {
    await openDrawer();

    const names = document.querySelectorAll(
      '.c-drawer__profile-family-name',
    );
    const relationships = document.querySelectorAll(
      '.c-drawer__profile-family-relationship',
    );
    expect(names[0].textContent?.trim()).toBe('Quinten Mota');
    expect(relationships[0].textContent?.trim()).toBe('(partenaire)');
  });

  it('should hide the Notes accordion when showNotes is false', async () => {
    fixture.componentRef.setInput('showNotes', false);
    await openDrawer();

    const accordions = fixture.debugElement.queryAll(By.directive(Accordion));
    expect(accordions.length).toBe(1);
    expect(
      document.querySelector('.c-drawer__profile-notes'),
    ).toBeFalsy();
    expect(
      Array.from(
        document.querySelectorAll('.c-drawer__section-title'),
      ).some((title) => title.textContent?.trim() === 'Notes'),
    ).toBe(false);
  });

  it('should render notes with author, timestamp and body', async () => {
    await openDrawer();

    const notes = document.querySelectorAll('.c-drawer__profile-note');
    expect(notes.length).toBe(2);
    expect(
      notes[0].querySelector('.c-drawer__profile-note-author')
        ?.textContent?.trim(),
    ).toBe('Eva de Moyer');
    expect(
      notes[0].querySelector('.c-drawer__profile-note-body')
        ?.textContent?.trim(),
    ).toBe('Personne agressive');
  });

  it('should map note severity to the correct tag treatment', async () => {
    await openDrawer();

    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.length).toBe(2);
    expect(tags[0].componentInstance.severity).toBe('danger');
    expect(tags[1].componentInstance.severity).toBe('secondary');

    const sensitiveTag = document.querySelector('.c-drawer__profile-note p-tag.p-tag-danger');
    expect(sensitiveTag).toBeTruthy();
  });

  it('should render header menu and close buttons', async () => {
    await openDrawer();

    expect(
      document.querySelector('[aria-label="Plus d\'actions"]'),
    ).toBeTruthy();
    expect(document.querySelector('[aria-label="Fermer"]')).toBeTruthy();
  });

  it('should emit visibleChange when the close button is clicked', async () => {
    await openDrawer();
    const onVisibleChange = jasmine.createSpy('visibleChange');
    component.visible.subscribe(onVisibleChange);

    const closeButton = document.querySelector(
      '[aria-label="Fermer"]',
    ) as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    expect(onVisibleChange).toHaveBeenCalledWith(false);
    expect(component.visible()).toBe(false);
  });

  it('should emit viewChange when the Documents option is selected', async () => {
    await openDrawer();
    const onViewChange = jasmine.createSpy('viewChange');
    component.viewChange.subscribe(onViewChange);

    const selectButton = fixture.debugElement.query(By.directive(SelectButton));
    selectButton.triggerEventHandler('onChange', { value: 'documents' });

    expect(onViewChange).toHaveBeenCalledOnceWith('documents');
    expect(component['selectedView']()).toBe('details');
  });

  it('should emit menuClick, quickActionsClick, callClick and emailClick', async () => {
    await openDrawer();
    const onMenu = jasmine.createSpy('menuClick');
    const onQuick = jasmine.createSpy('quickActionsClick');
    const onCall = jasmine.createSpy('callClick');
    const onEmail = jasmine.createSpy('emailClick');
    component.menuClick.subscribe(onMenu);
    component.quickActionsClick.subscribe(onQuick);
    component.callClick.subscribe(onCall);
    component.emailClick.subscribe(onEmail);

    (document.querySelector('[aria-label="Plus d\'actions"]') as HTMLButtonElement).click();
    (document.querySelector('.c-drawer__profile-quick-actions') as HTMLButtonElement).click();
    const contactActions = document.querySelectorAll(
      '.c-drawer__profile-contact-action',
    );
    (contactActions[0] as HTMLButtonElement).click();
    (contactActions[1] as HTMLButtonElement).click();

    expect(onMenu).toHaveBeenCalledTimes(1);
    expect(onQuick).toHaveBeenCalledTimes(1);
    expect(onCall).toHaveBeenCalledTimes(1);
    expect(onEmail).toHaveBeenCalledTimes(1);
  });

  it('should emit familyMemberSelect when a family tile is clicked', async () => {
    await openDrawer();
    const onSelect = jasmine.createSpy('familyMemberSelect');
    component.familyMemberSelect.subscribe(onSelect);

    const tile = document.querySelector(
      '.c-drawer__profile-family-tile',
    ) as HTMLButtonElement;
    tile.click();

    expect(onSelect).toHaveBeenCalledOnceWith(SAMPLE_DATA.relatedMembers[0]);
  });

  it('should expose an accessible label on each family tile', async () => {
    await openDrawer();

    const tiles = document.querySelectorAll(
      '.c-drawer__profile-family-tile',
    );
    expect(tiles[0].getAttribute('aria-label')).toBe('Quinten Mota (partenaire)');
    expect(tiles[2].getAttribute('aria-label')).toBe('Jack Mota (enfant à charge)');
  });

  it('should emit familyMemberSelect when clicking anywhere on the family tile', async () => {
    await openDrawer();
    const onSelect = jasmine.createSpy('familyMemberSelect');
    component.familyMemberSelect.subscribe(onSelect);

    const name = document.querySelector(
      '.c-drawer__profile-family-name',
    ) as HTMLSpanElement;
    name.click();

    expect(onSelect).toHaveBeenCalledOnceWith(SAMPLE_DATA.relatedMembers[0]);
  });

  describe('dialog semantics and focus management', () => {
    let trigger: HTMLButtonElement;

    const surface = (): HTMLElement | null =>
      document.querySelector('[data-pc-name="drawer"]');
    const heading = (): HTMLHeadingElement | null =>
      document.querySelector('.p-drawer h2');

    beforeEach(() => {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.textContent = 'Ouvrir';
      document.body.appendChild(trigger);
      trigger.focus();
    });

    afterEach(() => {
      trigger.remove();
    });

    it('should expose a labelled modal dialog when modal is true', async () => {
      fixture.componentRef.setInput('modal', true);
      await openDrawer();

      const root = surface();
      expect(root).withContext('drawer root').not.toBeNull();
      expect(root?.getAttribute('role')).toBe('dialog');
      expect(root?.getAttribute('aria-modal')).toBe('true');
      expect(heading()?.id).toBeTruthy();
      expect(root?.getAttribute('aria-labelledby')).toBe(heading()?.id);
    });

    it('should stay a labelled complementary region when modal is false', async () => {
      await openDrawer();

      const root = surface();
      expect(root?.getAttribute('role')).toBe('complementary');
      expect(root?.hasAttribute('aria-modal')).toBe(false);
      expect(root?.getAttribute('aria-labelledby')).toBe(heading()?.id);
    });

    it('should move focus onto the drawer heading when opened', async () => {
      expect(document.activeElement).toBe(trigger);

      await openDrawer();

      const title = heading();
      expect(title?.getAttribute('tabindex')).toBe('-1');
      expect(document.activeElement).toBe(title);
      expect(surface()?.contains(document.activeElement)).toBe(true);
    });

    it('should return focus to the trigger when closed from inside the drawer', async () => {
      await openDrawer();

      const closeButton = document.querySelector(
        '[aria-label="Fermer"]',
      ) as HTMLButtonElement;
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);

      closeButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.visible()).toBe(false);
      expect(document.activeElement).toBe(trigger);
    });

    it('should return focus to the trigger when the host sets visible to false', async () => {
      await openDrawer();
      expect(document.activeElement).toBe(heading());

      fixture.componentRef.setInput('visible', false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.activeElement).toBe(trigger);
    });

    it('should not steal focus back when the user already left the drawer', async () => {
      await openDrawer();

      const elsewhere = document.createElement('input');
      document.body.appendChild(elsewhere);
      elsewhere.focus();

      fixture.componentRef.setInput('visible', false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.activeElement).toBe(elsewhere);
      elsewhere.remove();
    });
  });
});

describe('ProfileDrawerComponent (nl)', () => {
  let fixture: ComponentFixture<ProfileDrawerComponent>;

  async function openDrawer(): Promise<void> {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDrawerComponent],
      providers: [
        { provide: PDS_LOCALE, useValue: 'nl' },
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

    fixture = TestBed.createComponent(ProfileDrawerComponent);
    fixture.componentRef.setInput('data', SAMPLE_DATA);
    fixture.componentRef.setInput('modal', false);
    fixture.detectChanges();
  });

  it('should render Dutch section titles', async () => {
    await openDrawer();

    const general = document.querySelector('#c-profile-drawer-general');
    expect(general?.textContent?.trim()).toBe('Algemene informatie');
  });
});
