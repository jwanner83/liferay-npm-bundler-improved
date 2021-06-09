import { rollup } from 'rollup'
const loadConfigFile = require('rollup/dist/loadConfigFile')

import Configuration from './Configuration'
import Log from './Log'

export default class Bundler {
  private configuration: Configuration = new Configuration()

  public loadRollupConfiguration = async () => {
    const success: string = 'A custom rollup configuration has been found. It will be used.'
    const failure: string = 'No custom rollup configuration has been found. The default will be used.'

    try {
      const { options } = await loadConfigFile(process.cwd() + '/rollup.config.js')

      if (options) {
        this.configuration.setConfigurationFromFile(options)
        Log.write(Log.chalk.green(success))
      } else {
        Log.write(Log.chalk.gray(failure))
      }
    } catch (exception) {
      Log.write(Log.chalk.gray(failure))
    }
  }

  public bundle = async () => {
    const inputOptions = this.configuration.complete || this.configuration.inputConfiguration

    Log.write(Log.chalk.gray('bundle with rollup in progress'))

    const bundle = await rollup(inputOptions)

  }
}