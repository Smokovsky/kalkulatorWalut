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

  @Output()
  firstCurrencyCode: EventEmitter<string> = new EventEmitter();
  @Output()
  secondCurrencyCode: EventEmitter<string> = new EventEmitter();

  secondCurrencyIndex: number;
  secondCurrencyRate: number;
  secondCurrencyEffectiveDate: Date;
  secondCurrencyAmount = 0;

  exchangeRate: number;

  async ngOnInit(): Promise<void> {
    await this.dataProviderService.getCurrencyCodesList().then(data => {
      this.currencyList = data;
    });

    this.firstCurrencyIndex = 0;
    this.secondCurrencyIndex = 1;

    this.firstCurrencyCode.emit(this.currencyList[this.firstCurrencyIndex].code);
    this.secondCurrencyCode.emit(this.currencyList[this.secondCurrencyIndex].code);


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

  async onClickFirstCurrencyCode(i: number) {
    this.firstCurrencyIndex = i;
    await this.dataProviderService.getCurrencyRate(this.currencyList[i].code, this.currencyList[i].table).then(currency => {
      this.firstCurrencyRate = currency.rate;
      this.firstCurrencyEffectiveDate = currency.effectiveDate;
    });
    this.firstCurrencyCode.emit(this.currencyList[this.firstCurrencyIndex].code);
    this.countExchangeRate();
    this.countSecondCurrencyAmount();
  }

  async onClickSecondCurrencyCode(i: number) {
    this.secondCurrencyIndex = i;
    await this.dataProviderService.getCurrencyRate(this.currencyList[i].code, this.currencyList[i].table).then(currency => {
      this.secondCurrencyRate = currency.rate;
      this.secondCurrencyEffectiveDate = currency.effectiveDate;
    });
    this.secondCurrencyCode.emit(this.currencyList[this.secondCurrencyIndex].code);
    this.countExchangeRate();
    this.countFirstCurrencyAmount();
  }

  countExchangeRate() {
    this.exchangeRate = this.secondCurrencyRate * (1 / this.firstCurrencyRate);
  }

  countFirstCurrencyAmount() {
    this.firstCurrencyAmount = this.secondCurrencyAmount * (1 / this.exchangeRate);
  }

  countSecondCurrencyAmount() {
    this.secondCurrencyAmount = this.firstCurrencyAmount * this.exchangeRate;
  }

}
