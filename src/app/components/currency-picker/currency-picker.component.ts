import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-currency-picker',
  templateUrl: './currency-picker.component.html',
  styleUrls: ['./currency-picker.component.scss']
})
export class CurrencyPickerComponent implements OnInit {
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

  constructor(private dataProviderService: DataProviderService) {
    this.firstCurrencyIndex = 103;
    this.secondCurrencyIndex = 40;
  }

  async ngOnInit(): Promise<void> {
    await this.dataProviderService.getCurrencyCodesList().then(data => {
      this.currencyList = data;
    });
    this.currencyList.sort((a, b) => {
      return a.code > b.code ? 1 : -1;
    });

    await this.getCurrency(1, this.firstCurrencyIndex);
    await this.getCurrency(2, this.secondCurrencyIndex);
  }

 /**
  * @param currency: accepts value 1 or 2, depends on which currency is to change
  * @Param index: index of currency in currencyList
  */
  async onClickCurrencyCode(currency: number, index: number): Promise<void> {
    if (currency === 1) {
      this.firstCurrencyIndex = index;
    } else if (currency === 2) {
      this.secondCurrencyIndex = index;
    }
    await this.getCurrency(currency, index);
    this.countFirstCurrencyAmount();
  }

 /**
  * @param currency: accepts value 1 or 2, depends on which currency is to change
  * @Param newCurrencyIndex: index of currency in currencyList
  */
  async getCurrency(currency: number, newCurrencyIndex: number): Promise<void> {
    await this.dataProviderService.getCurrencyRate(
      this.currencyList[newCurrencyIndex].code,
      this.currencyList[newCurrencyIndex].table
    ).then(result => {
      if (currency === 1) {
        this.firstCurrencyRate = result.rate;
        this.firstCurrencyEffectiveDate = result.effectiveDate;
        this.firstCurrency.emit({code: this.currencyList[this.firstCurrencyIndex].code,
                                table: this.currencyList[this.firstCurrencyIndex].table});
      } else if (currency === 2) {
        this.secondCurrencyRate = result.rate;
        this.secondCurrencyEffectiveDate = result.effectiveDate;
        this.secondCurrency.emit({code: this.currencyList[this.secondCurrencyIndex].code,
                                 table: this.currencyList[this.secondCurrencyIndex].table});
      }
    });
    if (this.firstCurrencyRate && this.secondCurrencyRate) {
      this.countExchangeRate();
    }
  }

  countExchangeRate(): void {
    this.exchangeRate = this.firstCurrencyRate * (1 / this.secondCurrencyRate);
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
