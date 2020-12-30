import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  firstCurrency: any;
  secondCurrency: any;

  constructor() { }

  ngOnInit(): void {

  }

  onChangeFirstCurrency(currency: any): void {
    this.firstCurrency = currency;
  }

  onChangeSecondCurrency(currency: any): void {
    this.secondCurrency = currency;
  }

}
