import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { PageComponent } from './components/page/page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CurrencyPickerComponent } from './components/currency-picker/currency-picker.component';
import { HistoryViewerComponent } from './components/history-viewer/history-viewer.component';
import { DatePipe } from '@angular/common';
import { DataViewComponent } from './components/data-view/data-view.component';
import { ChartViewComponent } from './components/chart-view/chart-view.component';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDateAdapter } from './adapters/mat-date.adapter';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    CurrencyPickerComponent,
    HistoryViewerComponent,
    DataViewComponent,
    ChartViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ChartsModule,
    MatNativeDateModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    DatePipe,
    MatDateAdapter,
    { provide: DateAdapter, useClass: MatDateAdapter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
