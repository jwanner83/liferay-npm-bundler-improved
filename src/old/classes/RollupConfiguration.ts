/**
 * Rollup configuration
 */
export default class RollupConfiguration {
  /**
   * The complete configuration
   */
  public complete: any = {}

  /**
   * The default input configuration
   */
  public inputConfiguration: unknown = {
    input: 'src/index.js'
  }

  /**
   * The default output configuration
   */
  public outputConfiguration: unknown = {
    format: 'cjs',
    strict: false,
    file: 'dist/index.js'
  }

  /**
   * Set the configuration from the local rollup file
   * @param options
   */
  public setConfigurationFromFile = (options: unknown[]): void => {
    if (Array.isArray(options) && options.length > 0) {
      this.complete = options[0]
      this.inputConfiguration = this.complete

      if (Array.isArray(this.complete.output) && this.complete.output.length > 0) {
        this.outputConfiguration = this.complete.output[0]
      }
    }
  }
}
