// TODO add jsdoc
export default class Configuration {
  public complete: any = {}

  public inputConfiguration: any = {
    input: 'src/index.js'
  }

  public outputConfiguration: any = {
    format: 'cjs',
    strict: false,
    file: 'dist/index.js'
  }

  public setConfigurationFromFile = (options: Array<any>): void => {
    if (Array.isArray(options) && options.length > 0) {
      this.complete = options[0]
      this.inputConfiguration = this.complete

      if (Array.isArray(this.complete.output) && this.complete.output.length > 0) {
        this.outputConfiguration = this.complete.output[0]
      }
    }
  }
}