import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/forkJoin';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cached } from '@ngx-cache/core';
import { CacheKey } from '@ngx-cache/core';
import { Observable } from 'rxjs/Observable';

import {
    BoardConfigResponse,
    BoardContent,
    BoardResponse,
    Column,
    Issue,
    IssueResponse,
    Sprint,
    SprintResponse,
} from './models';
import { Util } from './util';

@Injectable()
export class JiraService {

  private static readonly COLORS = [
    '#50026E',
    '#008080',
    '#aa6e28',
    '#808000',
    '#4233b3',
    '#006717',
    '#795548',
    '#610606'
  ];

  constructor(private http: HttpClient) { }

  @Cached('active-sprints')
  findAllActiveSprints(): Observable<Sprint[]> {
    return this.http.get<BoardResponse>('/jira/rest/agile/1.0/board')
      .map(br => br.values)
      .concatMap(boards => {
        const observables = boards.map(b => this.http.get<SprintResponse>(`/jira/rest/agile/1.0/board/${b.id}/sprint`, {
          params: new HttpParams().set('state', 'active')
        }).map(sr => sr.values));

        return Observable.forkJoin(observables, (...results) => {
          return results.reduce((prev, curr) => {
            return prev.concat(curr);
          });
        });
      });
  }

  @Cached('board-content')
  getBoardContent( @CacheKey sprintId: string): Observable<BoardContent> {
    let params = new HttpParams();
    params = params.set('maxResults', '300');
    params = params.set('fields', 'summary,assignee,flagged,issuetype,priority,subtasks,status,updated,customfield_10036');

    return this.http.get<IssueResponse>(`/jira/rest/agile/1.0/sprint/${sprintId}/issue`, {
      params: params
    }).map(resp => {
      let boardContent = new BoardContent();
      boardContent.issues = resp.issues;

      if (resp.issues.length > 0) {
        boardContent.jiraBaseUrl = this.parseBaseUrl(resp.issues[0].self);
        boardContent = this.processIssues(boardContent);
      }

      return boardContent;
    });
  }

  @Cached('board-columns')
  getBoardColumns( @CacheKey boardId: string): Observable<Column[]> {
    return this.http.get<BoardConfigResponse>(`/jira/rest/agile/1.0/board/${boardId}/configuration`)
      .map(resp => {
        return resp.columnConfig.columns;
      });
  }

  private processIssues(boardContent: BoardContent): BoardContent {
    const issuesWithSubTasks: Issue[] = [];

    boardContent.issues.forEach(issue => {
      if (issue.fields.subtasks.length > 0) {
        issuesWithSubTasks.push(issue);
      }

      if (Util.isNumeric(issue.fields.customfield_10036)) {
        boardContent.storyPointMetric.total += issue.fields.customfield_10036;

        if (issue.fields.status.statusCategory.key === 'done') {
          boardContent.storyPointMetric.done += issue.fields.customfield_10036;
        }
      }

      if (issue.fields.status.statusCategory.key === 'done') {
        boardContent.closedRatio.closed++;
      }

      // FIXME: find a better way to identify a story
      if (issue.fields.issuetype.name === 'Story') {
        boardContent.taskRatio.storyTasks++;
        boardContent.taskRatio.storyTasks += issue.fields.subtasks.length;
      }
    });

    boardContent.storyPointMetric.percentage =
      this.calculatePercentage(boardContent.storyPointMetric.done, boardContent.storyPointMetric.total);

    boardContent.closedRatio.total = boardContent.issues.length;
    boardContent.closedRatio.percentage =
      this.calculatePercentage(boardContent.closedRatio.closed, boardContent.closedRatio.total);

    boardContent.taskRatio.total = boardContent.issues.length;
    boardContent.taskRatio.percentage =
      this.calculatePercentage(boardContent.taskRatio.storyTasks, boardContent.taskRatio.total);

    const colors = this.getColors(issuesWithSubTasks.length);

    issuesWithSubTasks.forEach((iws, i) => {
      iws.color = colors[i];

      iws.fields.subtasks.forEach(subtask => {
        boardContent.issues.forEach(issue => {
          if (issue.key === subtask.key) {
            issue.color = colors[i];
          }
        });
      });
    });

    return boardContent;
  }

  private calculatePercentage(part: number, base: number): number {
    return Math.round(part * 100 / base);
  }

  private parseBaseUrl(url: string): string {
    const parser = document.createElement('a');
    parser.href = url;

    return '//' + parser.host;
  }

  private getColors(size: number): string[] {
    const colors = [];
    let index = 0;

    for (let i = 0; i < size; i++) {
      if (i === JiraService.COLORS.length) {
        index = 0;
      }
      colors.push(JiraService.COLORS[index]);
      index++;
    }

    return colors;
  }
}
