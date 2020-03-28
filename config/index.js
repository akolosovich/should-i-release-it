const { version } = require('../package.json');

const jiraDomain = process.env.JIRA_DOMAIN;
const jiraUser = process.env.JIRA_USER;
const jiraPassword = process.env.JIRA_PASSWORD;

if (!jiraDomain) {
  throw new Error('JIRA_DOMAIN is not defined');
}

if (!jiraUser) {
  throw new Error('JIRA_USER is not defined');
}

if (!jiraPassword) {
  throw new Error('JIRA_PASSWORD is not defined');
}

module.exports = {
  jiraDomain,
  jiraUser,
  jiraPassword,
  version,
  outputFolder: 'output',
  fileEncoding: 'utf-8',
};
