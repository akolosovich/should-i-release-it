const { flow, get, filter, map } = require('lodash/fp');
const { toIssueEntity, toIssueLinkEntity, toPullRequestEntity } = require('../data-mappers');

const { notEmpty } = require('../validators');
const { EPIC_ISSUES, CHILDREN_ISSUES } = require('../constants');

class JiraService {
  constructor(jiraClient) {
    this.jiraClient = jiraClient;
  }

  async getPullRequests(issueId) {
    notEmpty(issueId);

    try {
      const { data } = await this.jiraClient.getDevDetails(issueId);

      return toPullRequestEntity(data);
    } catch (e) {
      console.log(`Failed to get pull requests ${issueId}, ${e.message}`);

      return [];
    }
  }

  async getIssue(issueId, options = {}) {
    notEmpty(issueId);

    const { withPullRequests = true, withSubTasks = true, withLinks = true } = options;

    try {
      const response = await this.jiraClient.get(issueId);
      const issue = response.data;

      const pullRequests = withPullRequests ? await this.getPullRequests(issue.id) : [];

      const inwardLinks = withLinks
        ? flow(
            get(['fields', 'issuelinks']),
            filter(x => x.inwardIssue),
            map(toIssueLinkEntity),
          )(issue)
        : undefined;

      const subTasksIds = flow(
        get(['fields', 'subtasks']),
        map(x => x.id),
      )(issue);

      const fetchAllSubTasks = map(issueId =>
        this.getIssue(issueId, {
          withPullRequests: true,
          withSubTasks: false,
          withLinks: false,
        }),
      );

      const subTasks = withSubTasks ? await Promise.all(fetchAllSubTasks(subTasksIds)) : [];

      const result = toIssueEntity(issue);

      return {
        ...result,
        inwardLinks,
        subTasks,
        pullRequests,
      };
    } catch (e) {
      console.log(`Failed to get issue ${issueId}, ${e.message}`);

      throw new Error(e.message);
    }
  }

  async findIssuesByEpic(issueId) {
    notEmpty(issueId);

    try {
      const {
        data: { data },
      } = await this.jiraClient.find({
        query: `query { issue(issueIdOrKey: "${issueId}", latestVersion: true, screen: "view") { id fields { key content } } }`,
      });

      return flow(
        get(['issue', 'fields']),
        filter(x => x.key === CHILDREN_ISSUES || x.key === EPIC_ISSUES),
        get(['0', 'content']),
        map(toIssueEntity),
      )(data);
    } catch (e) {
      console.log(`Failed to find issues for a key ${issueId}, ${e.message}`);

      return [];
    }
  }
}

module.exports = JiraService;
