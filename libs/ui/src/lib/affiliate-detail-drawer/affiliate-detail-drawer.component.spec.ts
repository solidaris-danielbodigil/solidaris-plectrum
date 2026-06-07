import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Accordion } from 'primeng/accordion';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { IconRegistry, registerPlectrumIcons } from '../icon';
import {
  AffiliateDetailDrawerComponent,
  type AffiliateDetailDrawerData,
} from './affiliate-detail-drawer.component';

const SAMPLE_DATA: AffiliateDetailDrawerData = {
  name: 'Eva Martinez',
  avatarInitials: 'EM',
  avatarGender: 'female',
  avatarVariant: 1,
  identifiers: [
    { label: 'Territoire', value: '315' },
    { label: 'NSI', value: '00004212182' },
  ],
  generalInfo: [
    { label: 'NSI', value: '00004212182' },
    { label: 'Date de naissance', value: '14/08/1989 (36 ans)' },
  ],
  contactInfo: [
    { label: 'E-mail', value: 'lies.verhoeven@gmail.com' },
  ],
  family: [
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

describe('AffiliateDetailDrawerComponent', () => {
  let component: AffiliateDetailDrawerComponent;
  let fixture: ComponentFixture<AffiliateDetailDrawerComponent>;

  async function openDrawer(): Promise<void> {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateDetailDrawerComponent],
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

    fixture = TestBed.createComponent(AffiliateDetailDrawerComponent);
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
      document.querySelector('.c-affiliate-detail-drawer__panel'),
    ).toBeFalsy();
  });

  it('should render the affiliate name when visible', async () => {
    await openDrawer();

    const name = document.querySelector('.c-affiliate-detail-drawer__name');
    expect(name?.textContent?.trim()).toBe('Eva Martinez');
  });

  it('should render the large illustrated avatar', async () => {
    await openDrawer();

    const avatar = document.querySelector(
      'sds-plectrum-avatar.c-affiliate-detail-drawer__avatar',
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
      'sds-plectrum-avatar.c-affiliate-detail-drawer__family-avatar',
    );
    expect(avatars.length).toBe(3);
    expect(avatars[0].classList.contains('c-plectrum-avatar--color-blue')).toBe(true);
    expect(avatars[1].classList.contains('c-plectrum-avatar--color-green')).toBe(true);
    expect(avatars[2].classList.contains('c-plectrum-avatar--color-yellow')).toBe(true);

    const initials = document.querySelectorAll(
      '.c-affiliate-detail-drawer__family-avatar .c-plectrum-avatar__initials',
    );
    expect(initials[0].textContent?.trim()).toBe('Q');
    expect(initials[2].textContent?.trim()).toBe('J');
  });

  it('should render family member names and relationships', async () => {
    await openDrawer();

    const names = document.querySelectorAll(
      '.c-affiliate-detail-drawer__family-name',
    );
    const relationships = document.querySelectorAll(
      '.c-affiliate-detail-drawer__family-relationship',
    );
    expect(names[0].textContent?.trim()).toBe('Quinten Mota');
    expect(relationships[0].textContent?.trim()).toBe('(partenaire)');
  });

  it('should render notes with author, timestamp and body', async () => {
    await openDrawer();

    const notes = document.querySelectorAll('.c-affiliate-detail-drawer__note');
    expect(notes.length).toBe(2);
    expect(
      notes[0].querySelector('.c-affiliate-detail-drawer__note-author')
        ?.textContent?.trim(),
    ).toBe('Eva de Moyer');
    expect(
      notes[0].querySelector('.c-affiliate-detail-drawer__note-body')
        ?.textContent?.trim(),
    ).toBe('Personne agressive');
  });

  it('should map note severity to the correct tag treatment', async () => {
    await openDrawer();

    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.length).toBe(2);
    expect(tags[0].componentInstance.severity).toBe('danger');
    expect(tags[1].componentInstance.severity).toBe('secondary');

    const sensitiveTag = document.querySelector(
      '.c-affiliate-detail-drawer__note-tag--sensitive',
    );
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
    (document.querySelector('.c-affiliate-detail-drawer__quick-actions') as HTMLButtonElement).click();
    const contactActions = document.querySelectorAll(
      '.c-affiliate-detail-drawer__contact-action',
    );
    (contactActions[0] as HTMLButtonElement).click();
    (contactActions[1] as HTMLButtonElement).click();

    expect(onMenu).toHaveBeenCalledTimes(1);
    expect(onQuick).toHaveBeenCalledTimes(1);
    expect(onCall).toHaveBeenCalledTimes(1);
    expect(onEmail).toHaveBeenCalledTimes(1);
  });

  it('should emit familyMemberSelect when a family arrow button is clicked', async () => {
    await openDrawer();
    const onSelect = jasmine.createSpy('familyMemberSelect');
    component.familyMemberSelect.subscribe(onSelect);

    const arrow = document.querySelector(
      '.c-affiliate-detail-drawer__family-tile .c-affiliate-detail-drawer__icon-button',
    ) as HTMLButtonElement;
    arrow.click();

    expect(onSelect).toHaveBeenCalledOnceWith(SAMPLE_DATA.family[0]);
  });
});
