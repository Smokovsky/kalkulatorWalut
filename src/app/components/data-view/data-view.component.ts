import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit {
  @Input()
  firstCurrency: any;
  @Input()
  secondCurrency: any;
  @Input()
  exchangeRateHistory: [];

  constructor() { }

  ngOnInit(): void { }

}
