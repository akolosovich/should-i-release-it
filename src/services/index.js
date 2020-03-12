const fs = require('fs');
const pug = require('pug');

const JiraService = require('./jira-service');
const CompileService = require('./compile-service');
const FileService = require('./file-service');
const AggregationService = require('./aggregation-service');
const { jiraClient } = require('../api-clients');
const config = require('../../config');

const fileService = new FileService(config, fs);
const jiraService = new JiraService(jiraClient);
const compileService = new CompileService(config, pug, fileService);
const aggregationService = new AggregationService(jiraService);

module.exports = {
  aggregationService,
  compileService,
  fileService,
  jiraService,
};
