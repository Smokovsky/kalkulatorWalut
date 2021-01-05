import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  let service: DataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(DataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return promises', () => {
    expect(service.getCurrencyCodesList()).toBeInstanceOf(Promise);
    expect(service.getCurrencyRate('EUR', 'A')).toBeInstanceOf(Promise);
    expect(service.getCurrencyHistoryByDate('EUR', 'A', '2019-01-01', '2019-02-02')).toBeInstanceOf(Promise);
  });
});
