import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { PageComponent } from './components/page/page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CurrencyPickerComponent } from './components/currency-picker/currency-picker.component';
import { HistoryViewerComponent } from './components/history-viewer/history-viewer.component';
import { DatePipe } from '@angular/common';
import { DataViewComponent } from './components/data-view/data-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    CurrencyPickerComponent,
    HistoryViewerComponent,
    DataViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
