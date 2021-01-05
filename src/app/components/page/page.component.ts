import { Component } from '@angular/core';
import { Currency } from 'src/app/models/currency.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  firstCurrency: Currency;
  secondCurrency: Currency;

  constructor() { }

  onChangeFirstCurrency(currency: Currency): void {
    this.firstCurrency = currency;
  }

  onChangeSecondCurrency(currency: Currency): void {
    this.secondCurrency = currency;
  }

}
