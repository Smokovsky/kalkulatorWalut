import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  apiURL = 'https://api.nbp.pl/api/';

  constructor(private httpClient: HttpClient) { }

  async getCurrencyCodesList(): Promise<any[]> {
    let currencyList: any[];
    const promiseTableA = this.httpClient.get(this.apiURL + 'exchangerates/tables/A').toPromise();
    const promiseTableB = this.httpClient.get(this.apiURL + 'exchangerates/tables/B').toPromise();
    await Promise.all([promiseTableA, promiseTableB]).then((values: any) => {

      values[0][0].rates.forEach(element => {
        element.table = values[0][0].table;
      });
      values[1][0].rates.forEach(element => {
        element.table = values[1][0].table;
      });

      currencyList = values[0][0].rates.concat(values[1][0].rates);
    });
    const currencyCodes = currencyList.map(data => {
      return {code: data.code, currency: data.currency, table: data.table};
    });
    currencyCodes.push({code: 'PLN', currency: 'złoty polski', table: 'none'});

    return currencyCodes;
  }

  async getCurrencyRate(code: string, table: string): Promise<any> {
    let currencyRate: number;
    let currencyEffectiveDate: Date;
    const promiseCurrencyRate = this.httpClient.get(this.apiURL + `exchangerates/rates/${table}/${code}`).toPromise();
    await promiseCurrencyRate.then((value: any) => {
      currencyRate = value.rates[0].mid;
      currencyEffectiveDate = value.rates[0].effectiveDate;
    });
    return {rate: currencyRate, effectiveDate: currencyEffectiveDate};
  }

  async getCurrencyHistoryByDate(code: string, table: string, startDate: string, endDate: string): Promise<any[]> {
    let currencyRates: any[];
    const promiseCurrencyRate = this.httpClient.get(this.apiURL + `exchangerates/rates/${table}/${code}/${startDate}/${endDate}`)
    .toPromise();

    await promiseCurrencyRate.then((value: any) => {
      currencyRates = value.rates;
    });

    return currencyRates;
  }

}
