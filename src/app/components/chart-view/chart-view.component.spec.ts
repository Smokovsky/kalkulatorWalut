import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartsModule } from 'ng2-charts';
import { DOMHelper } from 'src/testing/dom-helper';

import { ChartViewComponent } from './chart-view.component';

describe('ChartViewComponent', () => {
  let component: ChartViewComponent;
  let fixture: ComponentFixture<ChartViewComponent>;
  let dh: DOMHelper<ChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartViewComponent ],
      imports: [
        ChartsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dh = new DOMHelper(fixture);
  });

  describe('Initial tests', () => {
    beforeEach(() => {
      component.firstCurrency = {code: 'PLN', name: 'złoty polski', table: 'none'};
      component.secondCurrency = {code: 'EUR', name: 'euro', table: 'A'};
      component.exchangeRateHistory = [{
        effectiveDate: new Date(),
        firstCurrencyRate: 1,
        secondCurrencyRate: 2,
        exchangeRate: 2,
        change: 0
      }];
      component.ngOnChanges({
        exchangeRateHistory: new SimpleChange(null, component.exchangeRateHistory, true)
      });
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('sould have two h3 tags', () => {
      expect(dh.count('h3')).toEqual(2);
    });

    it('sould have two canvas', () => {
      expect(dh.count('canvas')).toEqual(2);
    });
  });

  describe('functional tests', () => {
    it('should call fillChart() when exchangeRateHistory change and is not empty', () => {
      spyOn(component, 'fillChart');
      component.exchangeRateHistory = [{effectiveDate: new Date()}];
      component.ngOnChanges({
        exchangeRateHistory: new SimpleChange(null, [{effectiveDate: new Date()}], true)
      });
      expect(component.fillChart).toHaveBeenCalledTimes(1);
    });

    it('should not call fillChart() when got empty exchangeRateHistory', () => {
      spyOn(component, 'fillChart');
      component.exchangeRateHistory = [];
      component.ngOnChanges({
        exchangeRateHistory: new SimpleChange(null, [{effectiveDate: new Date()}], true)
      });
      expect(component.fillChart).toHaveBeenCalledTimes(0);
    });
  });
});
