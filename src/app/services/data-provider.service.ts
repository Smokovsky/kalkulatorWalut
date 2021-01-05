import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../models/currency.model';
import { Rate } from '../models/rate.model';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private apiURL = 'https://api.nbp.pl/api/';

  constructor(private httpClient: HttpClient) { }

  async getCurrencyCodesList(): Promise<Currency[]> {
    let currencyList: any[];
    const promiseTableA = this.httpClient.get(this.apiURL + 'exchangerates/tables/A').toPromise();
    const promiseTableB = this.httpClient.get(this.apiURL + 'exchangerates/tables/B').toPromise();
    await Promise.all([promiseTableA, promiseTableB]).then((values: any) => {

      values[0][0].rates.forEach((element: any) => {
        element.table = values[0][0].table;
      });
      values[1][0].rates.forEach((element: any) => {
        element.table = values[1][0].table;
      });

      currencyList = values[0][0].rates.concat(values[1][0].rates);
    });
    const currencyCodes = currencyList.map(data => {
      return {code: data.code, name: data.currency, table: data.table};
    });
    currencyCodes.push({code: 'PLN', name: 'złoty polski', table: 'none'});

    return currencyCodes;
  }

  async getCurrencyRate(code: string, table: string): Promise<Rate> {
    let currencyRate: number;
    let currencyEffectiveDate: Date;
    const promiseCurrencyRate = this.httpClient.get(this.apiURL + `exchangerates/rates/${table}/${code}`).toPromise();
    await promiseCurrencyRate.then((value: any) => {
      currencyRate = value.rates[0].mid;
      currencyEffectiveDate = value.rates[0].effectiveDate;
    });
    return {rate: currencyRate, effectiveDate: currencyEffectiveDate};
  }

  async getCurrencyHistoryByDate(code: string, table: string, startDate: string, endDate: string): Promise<Rate[]> {
    let currencyRates: Rate[];
    const promiseCurrencyRate = this.httpClient.get(this.apiURL + `exchangerates/rates/${table}/${code}/${startDate}/${endDate}`)
    .toPromise();

    await promiseCurrencyRate.then((value: any) => {
      currencyRates = value.rates.map((element: any) => {
        return { effectiveDate: element.effectiveDate, rate: element.mid };
      });
    });

    return currencyRates;
  }

}
