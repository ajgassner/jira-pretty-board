import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AutoRefreshService } from '../auto-refresh.service';
import { ConfigService } from '../config.service';
import { EventBusService } from '../event-bus.service';
import { JiraService } from '../jira.service';
import { BoardConfig, BoardContent, Issue, IssueHighlightEvent, Sprint, SprintSelectedEvent } from '../models';
import { Util } from '../util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

  private sprintSubscription: Subscription;
  private refreshSubscription: Subscription;
  private configSubscription: Subscription;

  private sprint: Sprint;

  boardContent: BoardContent = null;
  issuesWithSubtasks: Issue[] = [];
  config: BoardConfig;

  constructor(
    private jira: JiraService,
    private eventBus: EventBusService,
    private refreshService: AutoRefreshService,
    private configService: ConfigService) {

    this.config = this.configService.load();

    this.refreshSubscription = this.refreshService.getTimer().subscribe(() => {
      if (this.boardContent) {
        this.populateData(this.sprint);
      }
    });

    this.sprintSubscription = this.eventBus.of(SprintSelectedEvent).subscribe(event => {
      this.sprint = event.sprint;
      this.populateData(this.sprint);
    });

    this.configSubscription = this.configService.getObservable().subscribe(config => {
      this.config = config;
    });
  }

  isOlderThan24h(issue: Issue) {
    return Util.isOlderThan24h(issue.fields.updated);
  }

  private populateData(sprint: Sprint): void {
    this.jira.getBoardContent(sprint.id).subscribe(boardContent => {
      this.boardContent = boardContent;
      this.issuesWithSubtasks = boardContent.issues.filter(issue => issue.fields.subtasks.length > 0);
      return boardContent;
    });
  }

  ngOnDestroy(): void {
    this.sprintSubscription.unsubscribe();
    this.refreshSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
  }

  getStatusColorCssClass(issue: Issue): string {
    switch (issue.fields.status.statusCategory.colorName) {
      case 'green':
        return 'text-success';
      case 'red':
        return 'text-danger';
      case 'blue-gray':
        return 'text-info';
      case 'yellow':
        return 'text-warning';
      default:
        return '';
    }
  }

  buildTooltip(issue: Issue): string {
    const sp = issue.fields.customfield_10036 ? issue.fields.customfield_10036 : '-';

    return `Status ${issue.fields.status.name} / Priority ${issue.fields.priority.name}
${issue.key}: ${issue.fields.summary}
Story points: ${sp}`;
  }

  highlightIssue(issue: Issue): void {
    this.eventBus.publish(new IssueHighlightEvent(issue));
  }

  getStatusIconCssClass(issue: Issue): string {
    return issue.fields.status.statusCategory.key === 'done' ? 'fa-check' : 'fa-times';
  }
}
