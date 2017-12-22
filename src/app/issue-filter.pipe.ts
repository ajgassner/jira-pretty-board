import { Pipe, PipeTransform } from '@angular/core';

import { Issue } from './models';

@Pipe({
  name: 'issueFilter'
})
export class IssueFilterPipe implements PipeTransform {

  transform(issues: Issue[], search: string): any {
    if (search === undefined || search === '') {
      return issues;
    }

    const searchTerm: string = search.toLowerCase();

    return issues.filter(issue => issue.key.toLowerCase().includes(searchTerm)
      || issue.fields.summary.toLowerCase().includes(searchTerm)
      || (issue.fields.assignee && issue.fields.assignee.name.toLowerCase().includes(searchTerm)));
  }
}
