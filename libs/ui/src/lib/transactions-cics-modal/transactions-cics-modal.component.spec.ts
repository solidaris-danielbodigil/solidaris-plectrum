import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PDS_LOCALE } from '../i18n';
import { TransactionsCicsModalComponent } from './transactions-cics-modal.component';

describe('TransactionsCicsModalComponent', () => {
  let fixture: ComponentFixture<TransactionsCicsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsCicsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsCicsModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the French header by default', () => {
    const dialog = document.body.querySelector('.p-dialog-title');
    expect(dialog?.textContent?.trim()).toBe('Transactions CICS');
  });
});

describe('TransactionsCicsModalComponent (nl)', () => {
  let fixture: ComponentFixture<TransactionsCicsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsCicsModalComponent],
      providers: [{ provide: PDS_LOCALE, useValue: 'nl' }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsCicsModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the Dutch header', () => {
    const dialog = document.body.querySelector('.p-dialog-title');
    expect(dialog?.textContent?.trim()).toBe('CICS-transacties');
  });
});
