import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DOMHelper } from 'src/testing/dom-helper';

import { PageComponent } from './page.component';

describe('PageComponent', () => {

  @Component({selector: 'app-currency-picker', template: ''})
  class MockCurrencyPickerComponent {}

  @Component({selector: 'app-history-viewer', template: ''})
  class MockHistoryViewerComponent {
    @Input() firstCurrency: any;
    @Input() secondCurrency: any;
  }

  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let dh: DOMHelper<PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PageComponent,
        MockCurrencyPickerComponent,
        MockHistoryViewerComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dh = new DOMHelper(fixture);
  });

  describe('Initial tests', () => {
    it('should create itself', () => {
      expect(component).toBeTruthy();
    });

    it(`should have as title 'Kalkulator Walut Online'`, () => {
      expect(dh.queryOne('h1').nativeElement.textContent).toBe('Kalkulator Walut Online');
    });
  });

  describe('Functional tests', () => {
    it('should change first currency on call onChangeFirstCurrency()' , () => {
      const peso = {code: 'DOP', name: 'peso dominikańskie', table: 'B'};
      expect(component.firstCurrency).not.toBe(peso);
      component.onChangeFirstCurrency(peso);
      expect(component.firstCurrency).toBe(peso);
    });

    it('should change second currency on call onChangeSecondCurrency()' , () => {
      const peso = {code: 'DOP', name: 'peso dominikańskie', table: 'B'};
      expect(component.secondCurrency).not.toBe(peso);
      component.onChangeSecondCurrency(peso);
      expect(component.secondCurrency).toBe(peso);
    });
  });
});
