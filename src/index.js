#!/usr/bin/env node

require('dotenv').config();
const { run } = require('./cli');
const { compileService, aggregationService, fileService } = require('./services');

const collectAction = async issue => {
  console.log('collecting...', issue);

  const data = await aggregationService.aggregatePullRequestsByIssue(issue);

  fileService.writeJsonSync(issue, data);
};

const compileAction = async issue => {
  console.log('compiling...', issue);

  const data = fileService.readJsonSync(issue);

  compileService.compile(issue, data);
};

(async () => {
  try {
    await run(collectAction, compileAction);
  } catch (e) {
    console.log('Error: ', e.message);
  }
})();
