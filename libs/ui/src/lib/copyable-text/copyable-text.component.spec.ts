import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyableTextComponent } from './copyable-text.component';

function mockClipboard(
  writeText: jasmine.Spy = jasmine
    .createSpy('writeText')
    .and.returnValue(Promise.resolve()),
): jasmine.Spy {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

describe('CopyableTextComponent', () => {
  let fixture: ComponentFixture<CopyableTextComponent>;
  let component: CopyableTextComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyableTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyableTextComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Territoire');
    fixture.componentRef.setInput('value', '319');
    mockClipboard();
    fixture.detectChanges();
  });

  it('should render label and value', () => {
    const button = fixture.nativeElement.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;

    expect(button.textContent).toContain('Territoire');
    expect(button.textContent).toContain('319');
  });

  it('should set the default French copy aria-label', () => {
    const button = fixture.nativeElement.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Copier Territoire');
  });

  it('should use a custom aria-label when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Copier le territoire 319');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Copier le territoire 319');
  });

  it('should copy the value and emit copied on click', async () => {
    const writeText = mockClipboard();
    const onCopied = jasmine.createSpy('copied');
    component.copied.subscribe(onCopied);

    const button = fixture.nativeElement.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledOnceWith('319');
    expect(onCopied).toHaveBeenCalledOnceWith('319');
  });

  it('should not emit copied when clipboard write fails', async () => {
    mockClipboard(
      jasmine.createSpy('writeText').and.returnValue(Promise.reject(new Error('denied'))),
    );
    const onCopied = jasmine.createSpy('copied');
    component.copied.subscribe(onCopied);

    const button = fixture.nativeElement.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(onCopied).not.toHaveBeenCalled();
  });

  it('should not copy when disabled', async () => {
    const writeText = mockClipboard();
    const onCopied = jasmine.createSpy('copied');
    component.copied.subscribe(onCopied);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.c-copyable-text',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(writeText).not.toHaveBeenCalled();
    expect(onCopied).not.toHaveBeenCalled();
  });
});
