import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BoardConfig } from './models';

@Injectable()
export class ConfigService {

  private static readonly STORAGE_KEY = 'board-config';

  private configSource = new Subject<BoardConfig>();
  private observable = this.configSource.asObservable();

  public persist(config: BoardConfig): void {
    localStorage.setItem(ConfigService.STORAGE_KEY, JSON.stringify(config));
    this.configSource.next(config);
  }

  public load(): BoardConfig {
    if (localStorage.getItem(ConfigService.STORAGE_KEY) != null) {
      return JSON.parse(localStorage.getItem(ConfigService.STORAGE_KEY));
    }
    return new BoardConfig();
  }

  public getObservable(): Observable<BoardConfig> {
    return this.observable;
  }

}
