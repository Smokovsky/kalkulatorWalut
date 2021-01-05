import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Currency } from 'src/app/models/currency.model';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-currency-picker',
  templateUrl: './currency-picker.component.html',
  styleUrls: ['./currency-picker.component.scss']
})
export class CurrencyPickerComponent implements OnInit {
  currencyList: Currency[];

  firstCurrencyIndex: number;
  firstCurrencyRate: number;
  firstCurrencyEffectiveDate: Date;
  firstCurrencyAmount = 0;

  secondCurrencyIndex: number;
  secondCurrencyRate: number;
  secondCurrencyEffectiveDate: Date;
  secondCurrencyAmount = 0;

  @Output()
  firstCurrency: EventEmitter<Currency> = new EventEmitter();
  @Output()
  secondCurrency: EventEmitter<Currency> = new EventEmitter();

  exchangeRate: number;

  constructor(private dataProviderService: DataProviderService) {
    this.firstCurrencyIndex = 103;
    this.secondCurrencyIndex = 40;
  }

  async ngOnInit(): Promise<void> {
    this.currencyList = await this.dataProviderService.getCurrencyCodesList();
    this.currencyList.sort((a, b) => {
      return a.code > b.code ? 1 : -1;
    });

    await this.getCurrency(1, this.firstCurrencyIndex);
    await this.getCurrency(2, this.secondCurrencyIndex);
  }

  countExchangeRate(): void {
    this.exchangeRate = this.firstCurrencyRate * (1 / this.secondCurrencyRate);
  }

 /**
  * @param currency: accepts value 1 or 2, depends on which currency is to change
  * @Param index: index of currency in currencyList
  */
  onClickCurrencyCode(currency: number, index: number): void {
    if (currency === 1) {
      this.firstCurrencyIndex = index;
    } else if (currency === 2) {
      this.secondCurrencyIndex = index;
    }
    this.getCurrency(currency, index);
    this.countCurrencyAmount(currency === 1 ? 2 : 1);
  }

 /**
  * @param currency: accepts value 1 or 2, depends on which currency is to change
  * @Param newCurrencyIndex: index of currency in currencyList
  */
  async getCurrency(currency: number, newCurrencyIndex: number): Promise<void> {

    if (this.currencyList[newCurrencyIndex].code === 'PLN') {
      this.firstCurrencyRate = 1;
      this.firstCurrencyEffectiveDate = new Date();
      this.emitCurrency(currency);

    } else {
      await this.dataProviderService.getCurrencyRate(
        this.currencyList[newCurrencyIndex].code,
        this.currencyList[newCurrencyIndex].table
      ).then(result => {
        if (currency === 1) {
          this.firstCurrencyRate = result.rate;
          this.firstCurrencyEffectiveDate = result.effectiveDate;
          this.emitCurrency(1);
        } else if (currency === 2) {
          this.secondCurrencyRate = result.rate;
          this.secondCurrencyEffectiveDate = result.effectiveDate;
          this.emitCurrency(2);
        }
      });
    }
    if (this.firstCurrencyRate && this.secondCurrencyRate) {
      this.countExchangeRate();
    }
  }

 /**
  * @param currency: accepts value 1 or 2, depends on which currency is to emit
  */
   emitCurrency(currency: number): void {
    if (currency === 1) {
      this.firstCurrency.emit(this.currencyList[this.firstCurrencyIndex]);
    } else if (currency === 2) {
      this.secondCurrency.emit(this.currencyList[this.secondCurrencyIndex]);
    }
  }

 /**
  * @param currency: accepts value 1 or 2, depends on which currency amount is to count
  */
  countCurrencyAmount(currency: number): void {
    if (currency === 1) {
      this.firstCurrencyAmount = this.secondCurrencyAmount * (1 / this.exchangeRate);
      this.firstCurrencyAmount = parseFloat(this.firstCurrencyAmount.toFixed(6));
    } else if (currency === 2) {
      this.secondCurrencyAmount = this.firstCurrencyAmount * this.exchangeRate;
      this.secondCurrencyAmount = parseFloat(this.secondCurrencyAmount.toFixed(6));
    }
  }

  swapCurrencies(): void {
    this.firstCurrencyIndex = [this.secondCurrencyIndex, this.secondCurrencyIndex = this.firstCurrencyIndex][0];
    this.firstCurrencyRate = [this.secondCurrencyRate, this.secondCurrencyRate = this.firstCurrencyRate][0];
    this.countExchangeRate();
    this.countCurrencyAmount(2);
    this.emitCurrency(1);
    this.emitCurrency(2);
  }

}
