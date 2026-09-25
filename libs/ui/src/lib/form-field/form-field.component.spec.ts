import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <pds-form-field
      label="O.A."
      [layout]="layout()"
      [required]="required()"
      [invalid]="invalid()"
      [errorMessage]="errorMessage()"
      [hint]="hint()"
      [requiredLabel]="requiredLabel()"
      [inputId]="inputId()"
    >
      <input type="text" [id]="inputId()" />
    </pds-form-field>
  `,
})
class HostComponent {
  readonly layout = signal<'vertical' | 'horizontal'>('vertical');
  readonly required = signal(true);
  readonly invalid = signal(false);
  readonly errorMessage = signal<string | null>('Sélectionnez une O.A.');
  readonly hint = signal<string | undefined>(undefined);
  readonly requiredLabel = signal<string>('required');
  readonly inputId = signal<string | undefined>('oa');
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const label = (): HTMLLabelElement =>
    fixture.nativeElement.querySelector('.c-form-field__label');
  const input = (): HTMLInputElement =>
    fixture.nativeElement.querySelector('.c-form-field__control input');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should associate the label with the projected control via for/id', () => {
    expect(input().id).toBe('oa');
    expect(label().getAttribute('for')).toBe('oa');
    expect(input().labels?.[0]).toBe(label());
  });

  it('should drop the for attribute when inputId is not set', () => {
    host.inputId.set(undefined);
    fixture.detectChanges();

    expect(label().hasAttribute('for')).toBe(false);
    expect(label().id).toMatch(/^pds-form-field-label-\d+$/);
  });

  it('should render the required marker with the screen-reader label in parentheses', () => {
    host.requiredLabel.set('obligatoire');
    fixture.detectChanges();

    const marker = label().querySelector('.c-form-field__required');
    expect(marker?.getAttribute('aria-hidden')).toBe('true');
    expect(label().querySelector('.u-sr-only')?.textContent).toBe(
      '(obligatoire)',
    );
    expect(input().getAttribute('aria-required')).toBe('true');
  });

  it('should not render empty parentheses when requiredLabel is empty', () => {
    host.requiredLabel.set('');
    fixture.detectChanges();

    expect(label().querySelector('.c-form-field__required')).not.toBeNull();
    expect(label().querySelector('.u-sr-only')).toBeNull();
    expect(label().textContent).not.toMatch(/\(\s*\)/);
    expect(input().getAttribute('aria-required')).toBe('true');
  });

  it('should not render empty parentheses when requiredLabel is bound to undefined', () => {
    host.requiredLabel.set(undefined as unknown as string);
    fixture.detectChanges();

    expect(label().textContent).not.toMatch(/\(\s*\)/);
    expect(label().querySelector('.u-sr-only')).toBeNull();
  });

  it('should render no required marker when required is false', () => {
    host.required.set(false);
    fixture.detectChanges();

    expect(label().querySelector('.c-form-field__required')).toBeNull();
    expect(label().querySelector('.u-sr-only')).toBeNull();
    expect(input().hasAttribute('aria-required')).toBe(false);
  });

  it('should reflect the invalid state on the control and describe the error', () => {
    expect(input().getAttribute('aria-invalid')).toBe('false');

    host.invalid.set(true);
    fixture.detectChanges();

    const field = fixture.nativeElement.querySelector('.c-form-field');
    expect(field.classList.contains('is-invalid')).toBe(true);
    expect(input().getAttribute('aria-invalid')).toBe('true');

    const describedBy = input().getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const error = fixture.nativeElement.querySelector(`#${describedBy}`);
    expect(error?.textContent).toContain('Sélectionnez une O.A.');
  });

  it('should describe the hint only while the field is valid', () => {
    host.hint.set('Trois chiffres');
    fixture.detectChanges();

    const hintId = input().getAttribute('aria-describedby');
    expect(hintId).toMatch(/-hint$/);
    expect(fixture.nativeElement.querySelector(`#${hintId}`)?.textContent).toBe(
      'Trois chiffres',
    );

    host.invalid.set(true);
    fixture.detectChanges();

    expect(input().getAttribute('aria-describedby')).toMatch(/-error$/);
    expect(fixture.nativeElement.querySelector('.c-form-field__hint')).toBeNull();
  });
});
