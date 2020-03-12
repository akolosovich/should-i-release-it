const httpClient = require('axios');

const { createClient } = require('./createClient');
const { routes: jira } = require('./routes/jira');
const { jiraUser, jiraPassword, jiraDomain } = require('../../config');

const jiraClient = createClient(
  {
    baseURL: jiraDomain,
    auth: {
      username: jiraUser,
      password: jiraPassword,
    },
  },
  jira,
  httpClient,
);

module.exports = {
  jiraClient,
};
