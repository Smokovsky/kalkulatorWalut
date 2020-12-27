import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  firstCurrencyCode: string;
  secondCurrencyCode: string;

  constructor() { }

  ngOnInit(): void {

  }

  onChangeFirstCurrency(currency: string) {
    this.firstCurrencyCode = currency;
  }

  onChangeSecondCurrency(currency: string) {
    this.secondCurrencyCode = currency;
  }

}
