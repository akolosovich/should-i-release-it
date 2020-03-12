const env = (process.env.NODE_ENV || 'qa').toLowerCase();

const config = require(`./${env}`);
const { version } = require('../package.json');

module.exports = {
  ...config,
  version,
  outputFolder: 'output',
  fileEncoding: 'utf-8',
};
