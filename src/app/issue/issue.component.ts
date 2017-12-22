import { Component, Input } from '@angular/core';

import { Issue, IssueSize } from '../models';
import { Util } from '../util';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent {

  @Input() issue: Issue;
  @Input() taskSize: IssueSize;
  @Input() baseUrl: string;
  @Input() highlightMode: boolean;
  @Input() last24hOnly: boolean;

  getOpacity() {
    if (!this.highlightMode) {
      return 1.0;
    }

    if (this.issue.highlighted) {
      return 1;
    }

    return 0.3;
  }

  isBlocker(): boolean {
    return this.issue.fields.priority.name.toLowerCase().includes('highest')
      || this.issue.fields.priority.name.toLowerCase().includes('blocker');
  }

  getAssigneeName(): string {
    return this.issue.fields.assignee ? this.issue.fields.assignee.name : 'unassigned';
  }

  buildTooltip() {
    return `${this.issue.fields.issuetype.name} / Priority ${this.issue.fields.priority.name}
${this.issue.key}: ${this.issue.fields.summary}
Assignee: ${this.getAssigneeName()}`;
  }

  isOlderThan24h() {
    return Util.isOlderThan24h(this.issue.fields.updated);
  }

  isSmall() {
    return this.taskSize === IssueSize.SMALL;
  }

  isMedium() {
    return this.taskSize === IssueSize.MEDIUM;
  }

  isLarge() {
    return this.taskSize === IssueSize.LARGE;
  }
}
