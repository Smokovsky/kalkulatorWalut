import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryViewerComponent } from './history-viewer.component';

describe('HistoryViewerComponent', () => {
  let component: HistoryViewerComponent;
  let fixture: ComponentFixture<HistoryViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
