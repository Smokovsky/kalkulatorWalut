import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit, OnChanges {
  @Input()
  firstCurrency: any;
  @Input()
  secondCurrency: any;
  @Input()
  exchangeRateHistory: any[];

  dataReady = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.exchangeRateHistory && this.exchangeRateHistory.length > 0 && this.exchangeRateHistory[0].exchangeRate) {
      this.dataReady = true;
    }
  }

  ngOnInit(): void { }

}
