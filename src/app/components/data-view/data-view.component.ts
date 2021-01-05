import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Currency } from 'src/app/models/currency.model';
import { DailyResult } from 'src/app/models/dailyResult.model';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnChanges {
  @Input()
  firstCurrency: Currency;
  @Input()
  secondCurrency: Currency;
  @Input()
  exchangeRateHistory: DailyResult[];

  dataReady = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.exchangeRateHistory && this.exchangeRateHistory.length > 0) {
      this.dataReady = true;
    }
  }

}
