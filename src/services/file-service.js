const { stringify } = require('../helpers');

class FileService {
  constructor(config, fs) {
    this.config = config;
    this.fs = fs;
  }

  writeFileSync(...args) {
    this.fs.writeFileSync(...args);
  }

  writeJsonSync(issue, data) {
    this.fs.writeFileSync(`${this.config.outputFolder}/${issue}.json`, stringify(data), this.config.fileEncoding);
  }

  readJsonSync(issue) {
    const path = `${this.config.outputFolder}/${issue}.json`;

    return JSON.parse(this.fs.readFileSync(path, this.config.fileEncoding));
  }
}

module.exports = FileService;
