const rollup = require('rollup').rollup
const loadConfigFile = require('rollup/dist/loadConfigFile')
const ora = require('ora')

// the package json of the portlet
const pack = require(process.cwd() + '/package.json')

import { promisify } from 'util'
import { readFile } from 'fs'

const readFilePromisified = promisify(readFile)

import Configuration from './Configuration'
import Log from './Log'

export default class Bundler {
  private configuration: Configuration = new Configuration()
  private wrapped: string = ''

  public loadRollupConfiguration = async () => {
    const start: Date = new Date()
    Log.write(Log.chalk.gray('loading custom rollup configuration'))

    try {
      const { options } = await loadConfigFile(process.cwd() + '/rollup.config.js')

      if (options) {
        this.configuration.setConfigurationFromFile(options)
        Log.write(Log.chalk.green(`custom rollup configuration has been found and loaded in ${(new Date().getTime() - start.getTime()) / 1000}s. It will be used.`))
      } else {
        Log.write(Log.chalk.gray(`no custom rollup configuration has been found in ${(new Date().getTime() - start.getTime()) / 1000}s. The default will be used.`))
      }
    } catch (exception) {
      Log.write(Log.chalk.gray(`configuration file isn't readable in ${(new Date().getTime() - start.getTime()) / 1000}s. The default will be used.`))
    }
  }

  public bundle = async () => {
    let start: Date = new Date()
    const spinner = ora({
      text: Log.chalk.gray('bundle with rollup in progress\n'),
      color: 'gray'
    }).start()

    // bundle the code into one file
    const bundle = await rollup(this.configuration.inputConfiguration)

    spinner.stop()
    Log.write(Log.chalk.green(`bundle with rollup successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))

    start = new Date()
    spinner.start(Log.chalk.gray('writing to bundle to file\n'))

    // write the bundled code to a file
    await bundle.write(this.configuration.outputConfiguration)

    spinner.stop()
    Log.write(Log.chalk.green(`writing bundle to file successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

  public wrap = async () => {
    let start: Date = new Date()

    const bundled = await readFilePromisified('dist/index.js')
    this.wrapped = `Liferay.Loader.define('${pack.name}@${pack.version}/index', ['module', 'exports', 'require'], function (module, exports, require) { var define = undefined; var global = window; { ${bundled} }});`

    Log.write(Log.chalk.green(`wrapping code inside of Liferay.Loader successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }
}