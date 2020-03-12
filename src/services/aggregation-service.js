const { each, pick, map, groupBy, sortBy, flow } = require('lodash/fp');

const { ISSUE_TYPE_EPIC } = require('../constants');

class AggregationService {
  constructor(jiraService) {
    this.jiraService = jiraService;
  }

  async aggregatePullRequestsByIssue(issueId) {
    const data = await this.getIssueWithAllDependencies(issueId);

    const pullRequests = [];
    const aggregatePullRequests = this.addTo(pullRequests);

    aggregatePullRequests(data);

    const collectAll = each(aggregatePullRequests);

    collectAll(data.inwardLinks);
    collectAll(data.childIssues);

    const groupedByTicket = this.sortAndGroupBy('issue.key')(pullRequests);
    const groupedByRepo = this.sortAndGroupBy('repository')(pullRequests);

    return {
      ...pick(['id', 'key', 'summary'], data),
      repositoriesTotal: Object.keys(groupedByRepo).length,
      pullRequestsTotal: pullRequests.length,
      issuesTotal: Object.keys(groupedByTicket).length,
      repositories: groupedByRepo,
      groupedByRepo,
      groupedByTicket,
    };
  }

  async getIssueWithAllDependencies(issueId) {
    const issue = await this.jiraService.getIssue(issueId);

    const inwardLinks = await Promise.all(map(i => this.getLinkedIssue(i.issue.id), issue.inwardLinks));

    let childIssues = [];

    if (issue.issueType === ISSUE_TYPE_EPIC) {
      const issues = await this.jiraService.findIssuesByEpic(issueId);

      childIssues = await Promise.all(map(i => this.getChildIssue(i.id), issues));
    }

    return {
      ...issue,
      childIssues,
      inwardLinks,
    };
  }

  getLinkedIssue(issueId) {
    return this.jiraService.getIssue(issueId, {
      withLinks: false,
      withSubTasks: false,
    });
  }

  getChildIssue(issueId) {
    return this.jiraService.getIssue(issueId, {
      withLinks: false,
    });
  }

  addTo(storage) {
    return issue => {
      const addToArray = issue => pr =>
        storage.push({
          ...pr,
          issue,
        });

      each(addToArray(issue), issue.pullRequests);

      each(subIssue => each(addToArray(subIssue), subIssue.pullRequests), issue.subTasks);
    };
  }

  sortAndGroupBy(key) {
    return flow(
      sortBy(key),
      groupBy(key),
    );
  }
}

module.exports = AggregationService;
