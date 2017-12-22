import 'rxjs/add/operator/finally';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LoadingStateService } from './loading-state.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private ls: LoadingStateService) { }

  intercept(request: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    this.ls.loadingStarted();

    return httpHandler
      .handle(request)
      .finally(() => this.ls.loadingFinished());
  }
}
