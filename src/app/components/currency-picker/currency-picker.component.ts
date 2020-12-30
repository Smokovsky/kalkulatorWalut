import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-currency-picker',
  templateUrl: './currency-picker.component.html',
  styleUrls: ['./currency-picker.component.scss']
})
export class CurrencyPickerComponent implements OnInit {

  constructor(private dataProviderService: DataProviderService) { }
  currencyList: any[];

  firstCurrencyIndex: number;
  firstCurrencyRate: number;
  firstCurrencyEffectiveDate: Date;
  firstCurrencyAmount = 0;

  secondCurrencyIndex: number;
  secondCurrencyRate: number;
  secondCurrencyEffectiveDate: Date;
  secondCurrencyAmount = 0;

  @Output()
  firstCurrency: EventEmitter<{code: string, table: string}> = new EventEmitter();
  @Output()
  secondCurrency: EventEmitter<{code: string, table: string}> = new EventEmitter();

  exchangeRate: number;

  async ngOnInit(): Promise<void> {
    await this.dataProviderService.getCurrencyCodesList().then(data => {
      this.currencyList = data;
    });

    this.firstCurrencyIndex = 0;
    this.secondCurrencyIndex = 1;
    this.firstCurrency.emit({code: this.currencyList[this.firstCurrencyIndex].code,
                            table: this.currencyList[this.firstCurrencyIndex].table});
    this.secondCurrency.emit({code: this.currencyList[this.secondCurrencyIndex].code,
                            table: this.currencyList[this.secondCurrencyIndex].table});

    await this.dataProviderService.getCurrencyRate(
      this.currencyList[this.firstCurrencyIndex].code,
      this.currencyList[this.firstCurrencyIndex].table
    ).then(currency => {
      this.firstCurrencyRate = currency.rate;
      this.firstCurrencyEffectiveDate = currency.effectiveDate;
    });

    await this.dataProviderService.getCurrencyRate(
      this.currencyList[this.secondCurrencyIndex].code,
      this.currencyList[this.firstCurrencyIndex].table
    ).then(currency => {
      this.secondCurrencyRate = currency.rate;
      this.secondCurrencyEffectiveDate = currency.effectiveDate;
    });

    this.countExchangeRate();
  }

  async onClickFirstCurrencyCode(i: number): Promise<void> {
    this.firstCurrencyIndex = i;
    await this.dataProviderService.getCurrencyRate(this.currencyList[i].code, this.currencyList[i].table).then(currency => {
      this.firstCurrencyRate = currency.rate;
      this.firstCurrencyEffectiveDate = currency.effectiveDate;
    });
    this.firstCurrency.emit({code: this.currencyList[this.firstCurrencyIndex].code,
                            table: this.currencyList[this.firstCurrencyIndex].table});
    this.countExchangeRate();
    this.countSecondCurrencyAmount();
  }

  async onClickSecondCurrencyCode(i: number): Promise<void> {
    this.secondCurrencyIndex = i;
    await this.dataProviderService.getCurrencyRate(this.currencyList[i].code, this.currencyList[i].table).then(currency => {
      this.secondCurrencyRate = currency.rate;
      this.secondCurrencyEffectiveDate = currency.effectiveDate;
    });
    this.secondCurrency.emit({code: this.currencyList[this.secondCurrencyIndex].code,
                            table: this.currencyList[this.secondCurrencyIndex].table});
    this.countExchangeRate();
    this.countFirstCurrencyAmount();
  }

  countExchangeRate(): void {
    this.exchangeRate = this.secondCurrencyRate * (1 / this.firstCurrencyRate);
  }

  countFirstCurrencyAmount(): void {
    this.firstCurrencyAmount = this.secondCurrencyAmount * (1 / this.exchangeRate);
    this.firstCurrencyAmount = parseFloat(this.firstCurrencyAmount.toFixed(6));
  }

  countSecondCurrencyAmount(): void {
    this.secondCurrencyAmount = this.firstCurrencyAmount * this.exchangeRate;
    this.secondCurrencyAmount = parseFloat(this.secondCurrencyAmount.toFixed(6));
  }

  swapCurrencies(): void {
    this.firstCurrencyIndex = [this.secondCurrencyIndex, this.secondCurrencyIndex = this.firstCurrencyIndex][0];
    this.firstCurrencyRate = [this.secondCurrencyRate, this.secondCurrencyRate = this.firstCurrencyRate][0];
    this.countExchangeRate();
    this.countSecondCurrencyAmount();

    this.firstCurrency.emit({code: this.currencyList[this.firstCurrencyIndex].code,
      table: this.currencyList[this.firstCurrencyIndex].table});
    this.secondCurrency.emit({code: this.currencyList[this.secondCurrencyIndex].code,
        table: this.currencyList[this.secondCurrencyIndex].table});
  }

}
