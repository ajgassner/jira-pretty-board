import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CacheStaticLoader } from '@ngx-cache/core';
import { CACHE, CacheModule } from '@ngx-cache/core';
import { CacheLoader } from '@ngx-cache/core';
import { LocalStorageCacheService } from '@ngx-cache/platform-browser';
import { BrowserCacheModule } from '@ngx-cache/platform-browser';

import { AppHttpInterceptor } from './app-http.interceptor';
import { AppComponent } from './app.component';
import { AutoRefreshService } from './auto-refresh.service';
import { ConfigService } from './config.service';
import { ConfigComponent } from './config/config.component';
import { EllipsisPipe } from './ellipsis.pipe';
import { EventBusService } from './event-bus.service';
import { HeaderComponent } from './header/header.component';
import { IssueFilterPipe } from './issue-filter.pipe';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';
import { IssueComponent } from './issue/issue.component';
import { JiraService } from './jira.service';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { LoadingStateService } from './loading-state.service';
import { BoardConfig } from './models';
import { NavComponent } from './nav/nav.component';
import { Util } from './util';

export function cacheFactory(config: ConfigService) {
  let ttl = config.load().ttl;
  if (!Util.isNumeric(ttl) || ttl < BoardConfig.MIN_TTL) {
    ttl = BoardConfig.DEFAULT_TTL;
  }

  return new CacheStaticLoader({
    key: 'JIRA_CACHE',
    lifeSpan: {
      TTL: ttl
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    ConfigComponent,
    LoadingIndicatorComponent,
    IssueOverviewComponent,
    EllipsisPipe,
    IssueFilterPipe,
    IssueComponent
  ],
  entryComponents: [
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CacheModule.forRoot({
      provide: CacheLoader,
      useFactory: cacheFactory,
      deps: [ConfigService]
    }),
    BrowserCacheModule.forRoot([
      {
        provide: CACHE,
        useClass: LocalStorageCacheService
      }
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    JiraService,
    LoadingStateService,
    EventBusService,
    ConfigService,
    AutoRefreshService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
