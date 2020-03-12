const { flow, get, filter, flatMap, map, pick, concat } = require('lodash/fp');
const { createStructuredSelector } = require('reselect');

const { extractRepository } = require('../helpers');

const toPullRequestEntity = flow(
  get(['data', 'developmentInformation', 'details', 'instanceTypes', '0']),
  instance => {
    const pullRequests = flow(
      get(['repository']),
      flatMap(get(['pullRequests'])),
    )(instance);

    return flow(
      get(['danglingPullRequests']),
      concat(pullRequests),
    )(instance);
  },
  filter(x => x),
  map(x => ({
    ...pick(['id', 'author', 'name', 'status', 'url', 'lastUpdate'], x),
    repository: extractRepository(x.url),
  })),
);

const toStatusEntity = flow(
  get(['fields', 'status']),
  createStructuredSelector({
    id: get(['id']),
    name: get(['name']),
    statusCategory: flow(
      get(['statusCategory']),
      pick(['key', 'name', 'colorName']),
    ),
  }),
);

const toIssueEntity = createStructuredSelector({
  id: get(['id']),
  key: get(['key']),
  created: get(['created']),
  updated: get(['updated']),
  issueType: get(['fields', 'issuetype', 'name']),
  status: toStatusEntity,
  labels: get(['fields', 'labels']),
  summary: get(['fields', 'summary']),
});

const toIssueLinkEntity = jiraLinkDTO => ({
  ...jiraLinkDTO.type,
  type: jiraLinkDTO.inwardIssue ? 'inwardIssue' : 'outwardIssue',
  issue: toIssueEntity(jiraLinkDTO.inwardIssue || jiraLinkDTO.outwardIssue),
});

module.exports = {
  toIssueEntity,
  toIssueLinkEntity,
  toPullRequestEntity,
  toStatusEntity,
};
