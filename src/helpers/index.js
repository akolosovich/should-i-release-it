const { SPACE_INDENTATION } = require('../constants');

const extractRepository = str => {
  const data = str.match(/https:\/\/github.com\/(.+)\/(.+)\/pull\/*/);

  return data[2];
};

const stringify = x => (typeof x === 'string' ? x : JSON.stringify(x, null, SPACE_INDENTATION));
const print = (...args) => console.log(...args.map(stringify));

module.exports = {
  extractRepository,
  print,
  stringify,
};
