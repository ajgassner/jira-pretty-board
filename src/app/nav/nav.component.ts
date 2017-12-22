import 'rxjs/add/observable/timer';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AutoRefreshService } from '../auto-refresh.service';
import { ConfigService } from '../config.service';
import { ConfigComponent } from '../config/config.component';
import { EventBusService } from '../event-bus.service';
import { JiraService } from '../jira.service';
import { BoardConfig, IssueSize, SearchEvent, Sprint, SprintSelectedEvent } from '../models';
import { Util } from '../util';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  isCollapsed = true;
  sprints: Sprint[];
  selectedSprint: Sprint;
  config: BoardConfig;

  private configSubscription: Subscription;
  private refreshSubscription: Subscription;
  private searchFormSubscription: Subscription;

  clock: Observable<Date> = Observable.timer(0, 1000).map(v => new Date());

  constructor(
    private jira: JiraService,
    private eventBus: EventBusService,
    private modal: NgbModal,
    private configService: ConfigService,
    private fb: FormBuilder,
    private refreshService: AutoRefreshService) { }

  ngOnInit(): void {
    this.config = this.configService.load();

    this.refreshSubscription = this.refreshService.getTimer().subscribe(() => {
      this.loadData();
    });
    this.loadData();

    this.searchForm = this.fb.group({
      search: ['']
    });

    this.searchFormSubscription = this.searchForm.valueChanges.subscribe(data => {
      this.eventBus.publish(new SearchEvent(data.search));
    });
  }

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
    this.refreshSubscription.unsubscribe();
    this.searchFormSubscription.unsubscribe();
  }

  private loadData(): void {
    this.jira.findAllActiveSprints().subscribe(sprints => {
      this.sprints = sprints;
      this.tryAutoSelectSprint();
    });
  }

  selectSprint(sprint: Sprint) {
    this.selectedSprint = sprint;
    this.eventBus.publish(new SprintSelectedEvent(sprint));
  }

  toggleHideClosed(): void {
    this.config.hideClosed = !this.config.hideClosed;
    this.configService.persist(this.config);
  }

  toggleHideHeader(): void {
    this.config.hideHeader = !this.config.hideHeader;
    this.configService.persist(this.config);
  }

  toggleLast24hOnly(): void {
    this.config.last24hOnly = !this.config.last24hOnly;
    this.configService.persist(this.config);
  }

  toggleSplitBoard(): void {
    this.config.splitBoard = !this.config.splitBoard;
    this.configService.persist(this.config);
  }

  changeIssueSize(issueSize: IssueSize) {
    this.config.issueSize = issueSize;
    this.configService.persist(this.config);
  }

  private tryAutoSelectSprint(): void {
    if (this.config.regex === '') {
      return;
    }

    const regex = new RegExp(this.config.regex);

    for (const sprint of this.sprints) {
      if (regex.test(sprint.name)) {
        this.selectSprint(sprint);
        break;
      }
    }
  }

  openConfig() {
    this.modal.open(ConfigComponent);
  }

  buildSprintTooltip(): string {
    if (!this.selectedSprint) {
      return '';
    }

    const startDate = Util.formatDate(new Date(this.selectedSprint.startDate));
    const endDate = Util.formatDate(new Date(this.selectedSprint.endDate));

    return `${this.selectedSprint.name}: ${startDate} - ${endDate}`;
  }
}
