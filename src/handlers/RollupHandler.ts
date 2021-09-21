import RollupConfiguration from '../classes/RollupConfiguration'
import Log from '../classes/Log'
import { existsSync } from 'fs'
import TimeHandler from './TimeHandler'
const rollup = require('rollup').rollup
const loadConfigFile = require('rollup/dist/loadConfigFile')

export default class RollupHandler {
  /**
     * Bundler configuration
     * @private
     */
  private readonly configuration: RollupConfiguration = new RollupConfiguration()

  /**
     * The rollup bundle
     * @private
     */
  private rollupBundle: any

  /**
     * The bundled code
     */
  public bundledCode: string

  /**
     * Load the external configuration file if it exists. Otherwise, a default config will be used
     */
  public async loadExternalConfiguration () {
    if (existsSync('rollup.config.js')) {
      try {
        const { options } = await loadConfigFile(process.cwd() + '/rollup.config.js')
        this.configuration.setConfigurationFromFile(options)
        Log.debug('custom rollup configuration has been found and loaded')
      } catch (exception) {
        Log.trace(false, 'configuration file contains errors')
        Log.trace(true, exception)
        throw exception
      }
    } else {
      Log.debug('no custom rollup configuration has been found. The default will be used.')
    }
  }

  /**
     * Bundle the files with rollup
     */
  public async bundle () {
    const timer = new TimeHandler()

    const spinner = Log.ora({
      text: Log.chalk.gray('bundle with rollup in progress\n'),
      color: 'gray'
    }).start()

    try {
      this.rollupBundle = await rollup(this.configuration.inputConfiguration)
    } catch (exception) {
      spinner.stop()
      Log.error(timer, 'failed to bundle code with rollup')
      Log.trace(true, exception)
      throw exception
    }

    spinner.stop()
    Log.success(timer, 'bundle with rollup successful')
  }

  /**
     * Get the bundled code out of the bundle object
     * It is required to run the `bundle` command before. Otherwise, this wouldn't work
     */
  public async getBundledCode () {
    const timer = new TimeHandler()

    const spinner = Log.ora({
      text: Log.chalk.gray('extracting bundled code in progress\n'),
      color: 'gray'
    }).start()

    try {
      const bundle = await this.rollupBundle.generate(this.configuration.outputConfiguration)

      if (bundle.output.length > 1) {
        Log.warn('multiple outputs found. only the first one is used.')
      }

      this.bundledCode = bundle.output[0].code
    } catch (exception) {
      spinner.stop()
      Log.error(timer, 'failed to get bundled code')
      Log.trace(true, exception)
      throw exception
    }

    spinner.stop()
    Log.success(timer, 'extracting code successful')
  }
}
