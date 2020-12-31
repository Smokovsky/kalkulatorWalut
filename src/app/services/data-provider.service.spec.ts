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
});
