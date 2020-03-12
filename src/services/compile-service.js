class CompileService {
  constructor(config, pug, fileService) {
    this.config = config;
    this.pug = pug;
    this.fileService = fileService;
  }

  compile(issueId, data) {
    const compiledFunction = this.pug.compileFile('./templates/v1.pug', { pretty: true });

    const result = compiledFunction({
      issue: {
        ...data,
        jiraDomain: this.config.jiraDomain,
      },
    });

    this.fileService.writeFileSync(`${this.config.outputFolder}/${issueId}.html`, result, this.config.fileEncoding);
  }
}

module.exports = CompileService;
