import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DOMHelper } from 'src/testing/dom-helper';

import { CurrencyPickerComponent } from './currency-picker.component';

describe('CurrencyPickerComponent', () => {
  let component: CurrencyPickerComponent;
  let fixture: ComponentFixture<CurrencyPickerComponent>;
  let dh: DOMHelper<CurrencyPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CurrencyPickerComponent
      ],
      imports: [
        HttpClientModule,
        FormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(CurrencyPickerComponent);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
    dh = new DOMHelper(fixture);
  });

  describe('Initial tests', () => {
    it('should create itself', () => {
      expect(component).toBeTruthy();
    });

    it('should have initial first currency index of 103 and code PLN', () => {
      expect(component.firstCurrencyIndex).toBe(103);
      expect(component.currencyList[103].code).toEqual('PLN');
    });

    it('should have initial second currency index of 40 and code EUR', () => {
      expect(component.secondCurrencyIndex).toBe(40);
      expect(component.currencyList[40].code).toEqual('EUR');
    });

    it('should have initial change currency buttons texts: PLN and EUR', () => {
      expect(dh.queryAll('.picker')[0].nativeElement.textContent).toEqual('PLN');
      expect(dh.queryAll('.picker')[1].nativeElement.textContent).toEqual('EUR');
    });

    it('should have currency full names', () => {
      expect(dh.queryAll('p')[1].nativeElement.textContent).toContain('złoty polski');
      expect(dh.queryAll('p')[2].nativeElement.textContent).toContain('euro');
    });

    it('should have 2 select currency buttons', () => {
      expect(dh.count('.picker')).toEqual(2);
    });

    it('should have 151 currencies in the list', () => {
      expect(component.currencyList.length).toBe(151);
    });

    it('should have 151 * 2 currency buttons to pick', () => {
      expect(dh.count('.item')).toEqual(302);
    });

    it('should have initial currency amounts of 0', () => {
      expect(component.firstCurrencyAmount).toBe(0);
      expect(component.secondCurrencyAmount).toBe(0);
    });

    it('should not be able to select the same currency', () => {
      const items = dh.queryAll('.item');
      expect(items[40].nativeElement.disabled).toBeTruthy();
      expect(items[151 + 103].nativeElement.disabled).toBeTruthy();
    });
  });

  describe('Functional tests', () => {
    it('should call getCurrency twice on ngOnInit', async () => {
      spyOn(component, 'getCurrency');
      await fixture.whenStable();
      expect(component.getCurrency).toHaveBeenCalledTimes(2);
    });

    it('should have change currency after picking another', () => {
      dh.queryOne('.item').triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.firstCurrencyIndex).toBe(0);
      expect(dh.queryOne('.picker').nativeElement.textContent).toEqual(component.currencyList[0].code);
    });

    it('should emit changes after first currency change', async () => {
      spyOn(component.firstCurrency, 'emit');
      dh.queryOne('.item').nativeElement.click();
      await fixture.whenStable();
      expect(component.firstCurrency.emit).toHaveBeenCalledWith(component.currencyList[0]);
    });

    it('should emit changes after second currency change', async () => {
      spyOn(component.secondCurrency, 'emit');
      dh.queryAll('.item')[151 + 3].nativeElement.click();
      await fixture.whenStable();
      expect(component.secondCurrency.emit).toHaveBeenCalledWith(component.currencyList[3]);
    });

    it('should change second currency amount on first currency change', () => {
      const input = dh.queryOne('#firstCurrencyAmount');
      input.nativeElement.value = 100;
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.secondCurrencyAmount).not.toBe(0);
    });

    it('should change first currency amount on second currency change', () => {
      const input = dh.queryOne('#secondCurrencyAmount');
      input.nativeElement.value = 100;
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.firstCurrencyAmount).not.toBe(0);
    });

    it('should change second currency amount on currency swap', async () => {
      const input = dh.queryOne('#secondCurrencyAmount');
      input.nativeElement.value = 100;
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      dh.queryOne('.swapCurrencies').triggerEventHandler('click', null);
      expect(component.secondCurrencyAmount).not.toBe(100);
    });
  });
});
