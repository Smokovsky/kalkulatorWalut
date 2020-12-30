import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-history-viewer',
  templateUrl: './history-viewer.component.html',
  styleUrls: ['./history-viewer.component.scss']
})
export class HistoryViewerComponent implements OnInit, OnChanges {
  @Input()
  firstCurrency: any;
  @Input()
  secondCurrency: any;

  startDate = new Date().setDate(new Date().getDate() - 89);
  endDate = new Date();
  timePeriods = [30, 60, 90, 180, 365];
  selectedTimePeriod = 90;

  firstCurrencyHistory = [];
  secondCurrencyHistory = [];
  exchangeRateHistory = [];

  constructor(private datePipe: DatePipe,
              private dataProviderService: DataProviderService) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.firstCurrency && changes.secondCurrency && this.firstCurrency && this.secondCurrency) {
      await this.saveCurrencyHistory(1);
      await this.saveCurrencyHistory(2);
      this.combineCurrencyRates();
      this.countExchangeRates();
    } else if (changes.firstCurrency && this.firstCurrency) {
      await this.saveCurrencyHistory(1);
      this.combineCurrencyRates();
      this.countExchangeRates();
    } else if (changes.secondCurrency && this.secondCurrency) {
      await this.saveCurrencyHistory(2);
      this.combineCurrencyRates();
      this.countExchangeRates();
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
      day.exchangeRate = lastKnownValueSecond * (1 / lastKnownValueFirst);
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
  }

  async selectLastDays(days: number): Promise<void> {
    this.selectedTimePeriod = days;
    this.exchangeRateHistory = [];
    this.startDate = new Date().setDate(new Date().getDate() - days);
    this.endDate = new Date();
    await this.saveCurrencyHistory(1);
    await this.saveCurrencyHistory(2);
    this.combineCurrencyRates();
    this.countExchangeRates();
  }

  async selectTimePeriod(): Promise<void> {
    this.selectedTimePeriod = 0;
    console.log('Under construction...');
  }

}
