import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingStateService {

  private loadingStateSource = new Subject<boolean>();
  private counter = 0;

  loadingState = this.loadingStateSource.asObservable();

  loadingStarted() {
    this.tryFireEvent(true);
    this.counter++;
  }

  loadingFinished() {
    this.counter--;
    this.tryFireEvent(false);
  }

  private tryFireEvent(loading: boolean) {
    if (this.counter === 0) {
      setTimeout(_ => {
        // hack to make initial loading indicator visible
        this.loadingStateSource.next(loading);
      });
    }
  }
}
