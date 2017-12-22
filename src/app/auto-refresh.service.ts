import 'rxjs/add/observable/timer';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from './config.service';

@Injectable()
export class AutoRefreshService {

  private timer: Observable<number>;

  constructor(configService: ConfigService) {
    const interval = configService.load().ttl * 1000 + 5000;
    this.timer = Observable.timer(interval, interval);

    setTimeout(() => {
      location.reload(); // full refresh after 24h
    }, 60 * 60 * 24 * 1000);
  }

  getTimer(): Observable<number> {
    return this.timer;
  }
}
