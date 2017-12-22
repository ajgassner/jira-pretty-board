export interface BoardResponse {
  values: Board[];
}

export interface Board {
  id: string;
  name: string;
}

export interface BoardConfigResponse {
  columnConfig: ColumnConfig;
}

export interface ColumnConfig {
  columns: Column[];
}

export interface Column {
  name: string;
  statuses: ColumnStatus[];
  hidden: boolean;

  issues: Issue[];
}

export interface ColumnStatus {
  id: string;
}

export interface SprintResponse {
  values: Sprint[];
}

export interface Sprint {
  id: string;
  name: string;
  originBoardId: string;
  startDate: string;
  endDate: string;
}

export interface IssueResponse {
  issues: Issue[];
}

export interface Issue {
  id: string;
  key: string;
  color: string;
  self: string;
  highlighted: boolean;

  fields: Fields;
}

export interface Fields {
  assignee: User;
  flagged: boolean;
  issuetype: IssueType;
  priority: Priority;
  subtasks: SubTask[];
  summary: string;
  customfield_10036: number; // story points
  status: Status;
  updated: string;
}

export interface Status {
  name: string;
  id: string;

  statusCategory: StatusCategory;
}

export interface StatusCategory {
  colorName: string;
  name: string;
  key: string;
  id: string;
}

export interface IssueType {
  iconUrl: string;
  name: string;
}

export interface Priority {
  iconUrl: string;
  name: string;
}

export interface SubTask {
  id: string;
  key: string;
}

export interface User {
  name: string;
  avatarUrls: AvatarUrls;
}

export interface AvatarUrls {
  '16x16': string;
}

export class StoryPointMetric {
  done: number;
  total: number;
  percentage: number;

  constructor() {
    this.done = 0;
    this.total = 0;
    this.percentage = 0;
  }
}

export class ClosedRatio {
  closed: number;
  total: number;
  percentage: number;

  constructor() {
    this.closed = 0;
    this.total = 0;
    this.percentage = 0;
  }
}

export class TaskRatio {
  storyTasks: number;
  total: number;
  percentage: number;

  constructor() {
    this.storyTasks = 0;
    this.total = 0;
    this.percentage = 0;
  }
}

export class BoardContent {
  issues = new Array<Issue>();
  storyPointMetric = new StoryPointMetric();
  closedRatio = new ClosedRatio();
  taskRatio = new TaskRatio();
  jiraBaseUrl = '';
}

export class SprintSelectedEvent {
  constructor(public sprint: Sprint) { }
}

export class IssueHighlightEvent {
  constructor(public issue: Issue) { }
}

export class SearchEvent {
  constructor(public searchTerm: string) { }
}

export enum IssueSize {
  SMALL, MEDIUM, LARGE
}

export class BoardConfig {
  public static readonly DEFAULT_TTL: number = 60;
  public static readonly MIN_TTL: number = 30;

  regex = '';
  ttl: number = BoardConfig.DEFAULT_TTL;

  hideClosed = false;
  hideHeader = false;
  last24hOnly = false;
  splitBoard = false;
  issueSize: IssueSize = IssueSize.LARGE;
}
