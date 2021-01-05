export interface DailyResult {
  effectiveDate: Date;
  firstCurrencyRate?: number;
  secondCurrencyRate?: number;
  exchangeRate?: number;
  change?: number;
}
