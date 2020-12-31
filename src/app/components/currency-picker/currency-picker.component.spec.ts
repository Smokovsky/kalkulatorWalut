import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyPickerComponent } from './currency-picker.component';

describe('CurrencyPickerComponent', () => {
  let component: CurrencyPickerComponent;
  let fixture: ComponentFixture<CurrencyPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyPickerComponent ],
      imports: [
        HttpClientModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have first currency index of 103', () => {
    expect(fixture.componentInstance.firstCurrencyIndex).toBe(103);
  });

});
