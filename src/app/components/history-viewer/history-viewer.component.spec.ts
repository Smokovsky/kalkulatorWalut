import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HistoryViewerComponent } from './history-viewer.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DOMHelper } from 'src/testing/dom-helper';
import { Input, SimpleChange } from '@angular/core';
import { Component } from '@angular/core';
import { DailyResult } from 'src/app/models/dailyResult.model';
import { Currency } from 'src/app/models/currency.model';

describe('HistoryViewerComponent', () => {

  @Component({selector: 'app-data-view', template: ''})
  class MockDataViewComponent {
    @Input() firstCurrency: Currency;
    @Input() secondCurrency: Currency;
    @Input() exchangeRateHistory: DailyResult[];
  }

  @Component({selector: 'app-chart-view', template: ''})
  class MockChartViewComponent {
    @Input() firstCurrency: Currency;
    @Input() secondCurrency: Currency;
    @Input() exchangeRateHistory: DailyResult[];
  }

  let component: HistoryViewerComponent;
  let fixture: ComponentFixture<HistoryViewerComponent>;
  let dh: DOMHelper<HistoryViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HistoryViewerComponent,
        MockDataViewComponent,
        MockChartViewComponent
      ],
      imports: [
        HttpClientModule,
        MatDatepickerModule,
        FormsModule,
        MatFormFieldModule,
        MatMomentDateModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dh = new DOMHelper(fixture);
  });

  describe('Initial tests', () => {
    it('should create itself', () => {
      expect(component).toBeTruthy();
    });

    it(`should have a title of 'Historia notowań kursu'`, () => {
      expect(dh.queryOne('h2').nativeElement.textContent).toBe('Historia notowań kursu');
    });

    it('should have five last time period options', () => {
      expect(dh.count('li a')).toEqual(5);
    });
  });

  describe('Functional tests', () => {
    it('should save first currency history on change first currency', async () => {
      expect(component.firstCurrencyHistory.length).toBe(0);
      component.firstCurrency = {name: 'złoty polski', code: 'PLN', table: 'none'};
      await component.ngOnChanges({
        firstCurrency: new SimpleChange(null, component.firstCurrency, true)
      });
      expect(component.firstCurrencyHistory.length).toBeGreaterThan(0);
      expect(component.exchangeRateHistory.length).toEqual(0);
    });

    it('should save second currency history on change second currency', async () => {
      expect(component.secondCurrencyHistory.length).toBe(0);
      component.secondCurrency = {name: 'dolar amerykański', code: 'USD', table: 'A'};
      await component.ngOnChanges({
        secondCurrency: new SimpleChange(null, component.secondCurrency, true)
      });
      expect(component.secondCurrencyHistory.length).toBeGreaterThan(0);
      expect(component.exchangeRateHistory.length).toEqual(0);
    });

    it('should change selectedTimePeriod and call selectTimePeriod() on last period link click', async () => {
      spyOn(component, 'selectLastDays').and.callThrough();
      spyOn(component, 'selectTimePeriod');
      dh.queryOne('li a').triggerEventHandler('click', null);
      expect(component.selectLastDays).toHaveBeenCalledTimes(1);
      expect(component.selectTimePeriod).toHaveBeenCalledTimes(1);
      expect(component.selectLastDays).toHaveBeenCalledWith(component.timePeriods[0]);
      expect(component.selectedTimePeriod).toEqual(component.timePeriods[0]);
    });

    it('should clear errors on call datePickerChanged()', async () => {
      spyOn(component, 'clearErrors');
      await component.datePickerChanged();
      expect(component.clearErrors).toHaveBeenCalledTimes(1);
    });

    it('should call selectLastDays() on call clearDatePicker() when pickedStartDate and pickedEndDate are set', () => {
      component.pickedStartDate = new Date();
      component.pickedEndDate = new Date();
      spyOn(component, 'selectLastDays');
      component.clearDatePicker();
      expect(component.selectLastDays).toHaveBeenCalledTimes(1);
    });

    it('should set all errors to false on call clearErrors()', () => {
      component.shortTimeRangeError = true;
      component.exceededTimeRangeError = true;
      component.belowMinDateError = true;
      component.clearErrors();
      expect(component.shortTimeRangeError).toBeFalsy();
      expect(component.exceededTimeRangeError).toBeFalsy();
      expect(component.belowMinDateError).toBeFalsy();
    });

    it('should set new start and end date when call datePickerChanged() with properly date range', async () => {
      spyOn(component, 'datePickerChanged').and.callThrough();
      component.pickedStartDate = new Date('2019-1-1');
      component.pickedEndDate = new Date('2019-2-2');
      fixture.detectChanges();
      await component.datePickerChanged();
      expect(component.selectedTimePeriod).toBe(0);
      expect(component.startDate).toEqual(component.pickedStartDate);
      expect(component.endDate).toEqual(component.pickedEndDate);
      expect(component.shortTimeRangeError).toBeFalsy();
      expect(component.exceededTimeRangeError).toBeFalsy();
      expect(component.belowMinDateError).toBeFalsy();
    });

    it('should set shortTimeRangeError to true when selected range is too short', async () => {
      spyOn(component, 'datePickerChanged').and.callThrough();
      component.pickedStartDate = new Date('2019-1-1');
      component.pickedEndDate = new Date('2019-1-8');
      fixture.detectChanges();
      await component.datePickerChanged();
      expect(component.shortTimeRangeError).toBeTruthy();
    });

    it('should set exceededTimeRangeError to true when selected range is too long', async () => {
      spyOn(component, 'datePickerChanged').and.callThrough();
      component.pickedStartDate = new Date('2017-11-30');
      component.pickedEndDate = new Date('2019-1-1');
      fixture.detectChanges();
      await component.datePickerChanged();
      expect(component.exceededTimeRangeError).toBeTruthy();
    });

    it('should set belowMinDateError to true when selected range is earlier then 2008', async () => {
      spyOn(component, 'datePickerChanged').and.callThrough();
      component.pickedStartDate = new Date('2007-12-5');
      component.pickedEndDate = new Date('2008-3-2');
      fixture.detectChanges();
      await component.datePickerChanged();
      expect(component.belowMinDateError).toBeTruthy();
    });

    beforeEach(() => {
      component.firstCurrency = {name: 'złoty polski', code: 'PLN', table: 'none'};
      component.secondCurrency = {name: 'dolar amerykański', code: 'USD', table: 'A'};
    });

    it('should save exchange rate array when both currencies are set', async () => {
      await component.ngOnChanges({
        firstCurrency: new SimpleChange(null, component.firstCurrency, true),
        secondCurrency: new SimpleChange(null, component.secondCurrency, true)
      });
      expect(component.exchangeRateHistory.length).toBeGreaterThan(0);
    });

    it('should clear errors on call selectTimePeriod()', () => {
      spyOn(component, 'clearErrors');
      component.selectTimePeriod();
      expect(component.clearErrors).toHaveBeenCalledTimes(1);
    });

    it('should call saveCurrencyHistory() twice on call selectTimePeriod() if currencies are set ', () => {
      spyOn(component, 'saveCurrencyHistory');
      component.selectTimePeriod();
      expect(component.saveCurrencyHistory).toHaveBeenCalledTimes(2);
    });

    it('should call combineCurrencyRates() on call saveCurrencyHistory() if both currencyHistories are set', async () => {
      spyOn(component, 'combineCurrencyRates');
      await component.saveCurrencyHistory(1);
      expect(component.combineCurrencyRates).toHaveBeenCalledTimes(0);
      await component.saveCurrencyHistory(2);
      expect(component.combineCurrencyRates).toHaveBeenCalledTimes(1);
    });

    it('should call countExchangeRates() on call combineCurrencyRates() if both currencyHistories are set', () => {
      spyOn(component, 'countExchangeRates');
      component.combineCurrencyRates();
      expect(component.countExchangeRates).toHaveBeenCalledTimes(0);
      component.firstCurrencyHistory = [{effectiveDate: new Date(), rate: 1}],
      component.secondCurrencyHistory = component.firstCurrencyHistory;
      component.combineCurrencyRates();
      expect(component.countExchangeRates).toHaveBeenCalledTimes(1);
    });
  });
});
