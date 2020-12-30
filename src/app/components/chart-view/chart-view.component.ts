import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit, OnChanges {
  @Input()
  firstCurrency: any;
  @Input()
  secondCurrency: any;
  @Input()
  exchangeRateHistory: any[];

  chartReady = false;
  chartType = 'line';
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartLegend = false;
  chartPlugins = [];
  chartOptions = {
    elements: {
      line: {
        borderWidth: 2,
        tension: 0
      },
      point: {
        radius: 1.5,
        hoverRadius: 3,
        hitRadius: 3
      }
    },
    responsive: true
  };
  chartColors: Color[] = [
    {
      pointBackgroundColor: '#195aad',
      borderColor: '#669ce0',
      backgroundColor: 'rgba(0,0,0,0)'
    }
  ];

  changesChartData: ChartDataSets[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.exchangeRateHistory && this.exchangeRateHistory.length > 0 && this.exchangeRateHistory[0].exchangeRate) {
      this.fillChart();
    }
  }

  ngOnInit(): void { }

  fillChart(): void {
    const chartData = [{data: [], label: 'Kurs'}];
    const changesChartData = [{data: [], label: 'Zmiana'}];
    const chartLabels = [];
    this.exchangeRateHistory.forEach((element: any) => {
      chartData[0].data.push(element.exchangeRate);
      changesChartData[0].data.push(element.change);
      chartLabels.push(element.effectiveDate);
    });
    this.chartData = chartData;
    this.changesChartData = changesChartData;
    this.chartLabels = chartLabels;
    this.chartReady = true;
  }

}
