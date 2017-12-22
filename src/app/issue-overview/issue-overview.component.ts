import 'rxjs/add/operator/debounceTime';

import { Component, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';

import { AutoRefreshService } from '../auto-refresh.service';
import { ConfigService } from '../config.service';
import { EventBusService } from '../event-bus.service';
import { JiraService } from '../jira.service';
import { BoardConfig, Column, Issue, IssueHighlightEvent, SearchEvent, Sprint, SprintSelectedEvent } from '../models';

@Component({
  selector: 'app-issue-overview',
  templateUrl: './issue-overview.component.html'
})
export class IssueOverviewComponent implements OnDestroy {

  private sprintSubscription: Subscription;
  private highlightSubscription: Subscription;
  private searchSubscription: Subscription;
  private refreshSubscription: Subscription;
  private configSubscription: Subscription;

  private sprint: Sprint;

  columns: Column[];
  baseUrl: string;
  highlightMode = false;
  config: BoardConfig;
  searchTerm = '';

  constructor(
    private jira: JiraService,
    private eventBus: EventBusService,
    private refreshService: AutoRefreshService,
    private configService: ConfigService) {

    this.config = configService.load();

    this.refreshSubscription = this.refreshService.getTimer().subscribe(() => {
      if (this.columns) {
        this.populateColumns(this.sprint);
      }
    });

    this.sprintSubscription = this.eventBus.of(SprintSelectedEvent).subscribe(event => {
      this.sprint = event.sprint;
      this.populateColumns(this.sprint);
    });

    this.highlightSubscription = this.eventBus.of(IssueHighlightEvent).subscribe(event => {
      if (event.issue == null) {
        this.highlightMode = false;
        this.dehighlight();
      } else {
        this.highlightMode = true;
        this.highlight(event.issue);
      }
    });

    this.configSubscription = this.configService.getObservable().subscribe(config => {
      this.config = config;
      if (this.columns) {
        this.toggleHidden();
      }
    });

    this.searchSubscription = this.eventBus.of(SearchEvent).debounceTime(200).subscribe(event => {
      this.searchTerm = event.searchTerm;
    });
  }

  private highlight(issue: Issue): void {
    for (const column of this.columns) {
      for (const colIssue of column.issues) {
        for (const subTask of issue.fields.subtasks) {
          if (subTask.id === colIssue.id) {
            colIssue.highlighted = true;
          }
        }
      }
    }
  }

  private dehighlight(): void {
    for (const column of this.columns) {
      for (const colIssue of column.issues) {
        colIssue.highlighted = false;
      }
    }
  }

  private populateColumns(sprint: Sprint) {
    forkJoin([
      this.jira.getBoardColumns(sprint.originBoardId),
      this.jira.getBoardContent(sprint.id)]).subscribe(results => {
        const columns = (results[0] as any);
        const boardContent = (results[1] as any);

        this.baseUrl = boardContent.jiraBaseUrl;

        this.mapIssuesToColumns(boardContent.issues, columns);
        this.columns = columns;
        this.toggleHidden();
      });
  }

  private mapIssuesToColumns(issues: Issue[], columns: Column[]): void {
    issues.filter(issue => issue.fields.subtasks.length === 0).forEach(issue => {
      columns.forEach(column => {

        if (!Array.isArray(column.issues)) {
          column.issues = new Array<Issue>();
        }

        column.statuses.forEach(status => {
          if (issue.fields.status.id === status.id) {
            column.issues.push(issue);
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.sprintSubscription.unsubscribe();
    this.highlightSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
    this.refreshSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
  }

  private toggleHidden() {
    this.columns.forEach(col => {
      if (!this.config.hideClosed) {
        col.hidden = false;
      } else {
        const colName = col.name.toLowerCase();
        if (colName.includes('done') || colName.includes('finished') || colName.includes('closed')) {
          col.hidden = true;
        }
      }
    });
  }

}
