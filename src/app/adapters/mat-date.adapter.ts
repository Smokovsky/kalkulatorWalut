import { Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

@Injectable()
export class MatDateAdapter extends MomentDateAdapter {

  constructor() {
    super('en-GB');
  }

  public format(date: moment.Moment): string {
    return date.locale('en-GB').format('DD/MM/YYYY');
  }

}
