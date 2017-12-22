import 'rxjs/add/operator/filter';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

interface Message {
  channel: string;
  data: any;
}

@Injectable()
export class EventBusService {

  private messageSubject: Subject<Message>;

  constructor() {
    this.messageSubject = new Subject<Message>();
  }

  public publish<T>(message: T): void {
    const channel = (<any>message.constructor).name;
    this.messageSubject.next({ channel: channel, data: message });
  }

  public of<T>(messageType: { new(...args: any[]): T }): Observable<T> {
    const channel = (<any>messageType).name;
    return this.messageSubject.filter(m => m.channel === channel).map(m => m.data);
  }
}
