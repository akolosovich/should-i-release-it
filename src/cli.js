const program = require('commander');

const { version } = require('../config');

module.exports.run = (collectAction, compileAction) => {
  program
    .command('collect <issue>')
    .version(version)
    .action(collectAction);

  program
    .command('compile <issue>')
    .version(version)
    .action(compileAction);

  program.parse(process.argv);
};
