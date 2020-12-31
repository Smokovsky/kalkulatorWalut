import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-history-viewer',
  templateUrl: './history-viewer.component.html',
  styleUrls: ['./history-viewer.component.scss'],
  providers: [ DatePipe ]
})
export class HistoryViewerComponent implements OnInit, OnChanges {

  @Input()
  firstCurrency: any;
  @Input()
  secondCurrency: any;

  startDate: Date = new Date();
  endDate = new Date();
  timePeriods = [30, 60, 90, 180, 365];
  selectedTimePeriod = 90;

  firstCurrencyHistory = [];
  secondCurrencyHistory = [];
  exchangeRateHistory = [];

  pickedStartDate: Date;
  pickedEndDate: Date;

  shortTimeRangeError = false;
  exceededTimeRangeError = false;
  belowMinDateError = false;

  datePickerMinValue = new Date('1/1/2008');
  datePickerMaxValue = new Date();

  constructor(private datePipe: DatePipe,
              private dataProviderService: DataProviderService) {
    this.startDate.setDate(new Date().getDate() - 90);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.firstCurrency && changes.secondCurrency && this.firstCurrency && this.secondCurrency) {
      await this.saveCurrencyHistory(1);
      await this.saveCurrencyHistory(2);
    } else if (changes.firstCurrency && this.firstCurrency) {
      await this.saveCurrencyHistory(1);
    } else if (changes.secondCurrency && this.secondCurrency) {
      await this.saveCurrencyHistory(2);
    }
  }

  ngOnInit(): void { }

  async getCurrencyHistory(code: string, table: string, startDate: string, endDate: string): Promise<any[]> {
    let response = [];
    if (code !== 'PLN') {
      await this.dataProviderService.getCurrencyHistoryByDate(code, table, startDate, endDate).then(result => {
        response = result;
      });
    } else {
      let start = new Date(startDate);
      const finish = new Date(endDate);

      if (start <= finish) {
        while (start <= finish) {
          response.push({effectiveDate: this.datePipe.transform(start, 'yyyy-MM-dd'), mid: 1});
          start = new Date(start.setDate(start.getDate() + 1));
        }
      }
    }
    return response;
  }

  /**
   * @param currency: accepts value 1 or 2, depends on which currency history is to save
   */
  async saveCurrencyHistory(currency: number): Promise<void> {
    this.exchangeRateHistory = [];
    if (currency === 1) {
    await this.getCurrencyHistory(this.firstCurrency.code, this.firstCurrency.table,
      this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      this.datePipe.transform(this.endDate, 'yyyy-MM-dd')).then(response => {
        this.firstCurrencyHistory = response.map(data => {
          return {effectiveDate: data.effectiveDate, firstCurrencyRate: data.mid};
        });
      });
    } else if (currency === 2) {
      await this.getCurrencyHistory(this.secondCurrency.code, this.secondCurrency.table,
      this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      this.datePipe.transform(this.endDate, 'yyyy-MM-dd')).then(response => {
        this.secondCurrencyHistory = response.map(data => {
          return {effectiveDate: data.effectiveDate, secondCurrencyRate: data.mid};
        });
      });
    }
    this.combineCurrencyRates();
  }

  countExchangeRates(): void {
    let lastKnownValueFirst: number;
    let lastKnownValueSecond: number;

    for (const record of this.exchangeRateHistory) {
      if (record.firstCurrencyRate) {
        lastKnownValueFirst = record.firstCurrencyRate;
        break;
      }
    }
    for (const record of this.exchangeRateHistory) {
      if (record.secondCurrencyRate) {
        lastKnownValueSecond = record.secondCurrencyRate;
        break;
      }
    }

    this.exchangeRateHistory.forEach((day, index) => {
      if (day.firstCurrencyRate) {
        lastKnownValueFirst = day.firstCurrencyRate;
      }
      if (day.secondCurrencyRate) {
        lastKnownValueSecond = day.secondCurrencyRate;
      }
      day.exchangeRate = lastKnownValueFirst * (1 / lastKnownValueSecond);
      day.exchangeRate = parseFloat(day.exchangeRate.toFixed(6));

      if (index !== 0) {
        day.change = day.exchangeRate - this.exchangeRateHistory[index - 1].exchangeRate;
        day.change = parseFloat(day.change.toFixed(6));
      } else {
        day.change = 0;
      }
    });
  }

  combineCurrencyRates(): void {
    if (this.firstCurrencyHistory.length > 0 && this.secondCurrencyHistory.length > 0) {
      this.exchangeRateHistory = [];
      let start = new Date(this.startDate);
      const finish = new Date(this.endDate);

      if (start <= finish) {
        while (start <= finish) {
          const firstCurrencyDailyRate = this.firstCurrencyHistory.filter(record => {
            return record.effectiveDate === this.datePipe.transform(start, 'yyyy-MM-dd');
          });
          const secondCurrencyDailyRate = this.secondCurrencyHistory.filter(record => {
            return record.effectiveDate === this.datePipe.transform(start, 'yyyy-MM-dd');
          });

          if (firstCurrencyDailyRate[0] || secondCurrencyDailyRate[0]) {
            const resultObject: any = {effectiveDate: new Date()};
            resultObject.effectiveDate = this.datePipe.transform(start, 'yyyy-MM-dd');
            if (firstCurrencyDailyRate[0] && firstCurrencyDailyRate[0].firstCurrencyRate) {
              resultObject.firstCurrencyRate = firstCurrencyDailyRate[0].firstCurrencyRate;
            }
            if (secondCurrencyDailyRate[0] && secondCurrencyDailyRate[0].secondCurrencyRate) {
              resultObject.secondCurrencyRate = secondCurrencyDailyRate[0].secondCurrencyRate;
            }
            this.exchangeRateHistory.push(resultObject);
          }
          start = new Date(start.setDate(start.getDate() + 1));
        }

        if (this.firstCurrency.code === 'PLN' || this.secondCurrency.code === 'PLN') {
          const deleteRecords = [];
          this.exchangeRateHistory.forEach((element, index) => {
            if (!(element.firstCurrencyRate && element.secondCurrencyRate)) {
              deleteRecords.push(index);
            }
          });
          if (deleteRecords.length > 0) {
            deleteRecords.reverse();
            for (const record of deleteRecords) {
              this.exchangeRateHistory.splice(record, 1);
            }
          }
        }
      }
      this.countExchangeRates();
    }
  }

  async selectLastDays(days: number): Promise<void> {
    this.selectedTimePeriod = days;
    this.pickedStartDate = null;
    this.pickedEndDate = null;
    this.exchangeRateHistory = [];
    this.startDate = new Date();
    this.startDate.setDate(new Date().getDate() - days);
    this.endDate = new Date();
    this.selectTimePeriod();
  }

  async selectTimePeriod(): Promise<void> {
    this.firstCurrencyHistory = [];
    this.secondCurrencyHistory = [];
    await this.saveCurrencyHistory(1);
    await this.saveCurrencyHistory(2);
    this.clearErrors();
  }

  async datePickerChanged(): Promise<void> {
    await this.sleep(10);
    this.clearErrors();
    const minRange = new Date(this.pickedStartDate);
    const maxRange = new Date(this.pickedStartDate);
    minRange.setDate(minRange.getDate() + 13);
    maxRange.setDate(maxRange.getDate() + 365);
    if (this.pickedStartDate && this.pickedEndDate && this.pickedEndDate !== null && this.pickedStartDate !== null) {
      if (this.pickedEndDate > minRange) {
        if (!(this.pickedEndDate > maxRange)) {
          if (this.pickedStartDate >= this.datePickerMinValue) {

            this.selectedTimePeriod = 0;
            this.startDate = this.pickedStartDate;
            this.endDate = this.pickedEndDate;
            await this.selectTimePeriod();

          } else {
            this.belowMinDateError = true;
          }
        } else {
          this.exceededTimeRangeError = true;
        }
      } else {
        this.shortTimeRangeError = true;
      }
    }
  }

  clearDatePicker(): void {
    if (!this.shortTimeRangeError && !this.exceededTimeRangeError && !this.belowMinDateError
      && (this.pickedStartDate && this.pickedEndDate)) {
      this.selectLastDays(90);
    }
    this.pickedStartDate = null;
    this.pickedEndDate = null;
    this.clearErrors();
  }

  clearErrors(): void {
    this.shortTimeRangeError = false;
    this.exceededTimeRangeError = false;
    this.belowMinDateError = false;
  }

  sleep(ms: number): any {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

}
