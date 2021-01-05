import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataViewComponent } from './data-view.component';

describe('DataViewComponent', () => {
  let component: DataViewComponent;
  let fixture: ComponentFixture<DataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create itself', () => {
    expect(component).toBeTruthy();
  });

  it('should set dataReady to true when exchangeRateHistory change and is not empty', () => {
    component.exchangeRateHistory = [{effectiveDate: new Date()}];
    component.ngOnChanges({
      exchangeRateHistory: new SimpleChange(null, [{effectiveDate: new Date()}], true)
    });
    expect(component.dataReady).toBeTruthy();
  });

  it('should not set dataReady to true when got empty exchangeRateHistory', () => {
    component.exchangeRateHistory = [];
    component.ngOnChanges({
      exchangeRateHistory: new SimpleChange(null, [], true)
    });
    expect(component.dataReady).toBeFalsy();
  });
});
