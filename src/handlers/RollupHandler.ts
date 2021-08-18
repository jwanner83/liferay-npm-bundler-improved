import Configuration from '../classes/Configuration'
import Log from '../classes/Log'
import { existsSync } from 'fs'
const ora = require('ora')
import { rollup } from 'rollup'
import TimeHandler from './TimeHandler'
const loadConfigFile = require('rollup/dist/loadConfigFile')

export default class RollupHandler {
    /**
     * Bundler configuration
     * @private
     */
    private configuration: Configuration = new Configuration()

    /**
     * The bundled code
     * @private
     */
    private bundledCode: any

    /**
     * Load the external configuration file if it exists. Otherwise, a default config will be used
     */
    public async loadExternalConfiguration () {
        if (existsSync('rollup.config.js')) {
            try {
                const { options } = await loadConfigFile(process.cwd() + '/rollup.config.js')
                this.configuration.setConfigurationFromFile(options)
                Log.write(Log.chalk.gray(`custom rollup configuration has been found and loaded`))
            } catch (exception) {
                Log.write(Log.chalk.red(`configuration file contains errors`))
                Log.write(Log.chalk.red(exception))
                throw exception
            }
        } else {
            Log.write(Log.chalk.gray(`no custom rollup configuration has been found. The default will be used.`))
        }
    }

    /**
     * Bundle the files with rollup
     */
    public async bundle () {
        const timer = new TimeHandler()

        Log.write('Existiert', existsSync(this.configuration.inputConfiguration.input))

        const spinner = ora({
            text: Log.chalk.gray('bundle with rollup in progress\n'),
            color: 'gray'
        }).start()

        try {
            this.bundledCode = await rollup(this.configuration.inputConfiguration)
        } catch (exception) {
            spinner.stop()
            Log.write(timer.getSecondsPretty(), Log.chalk.red(`failed to bundle code with rollup\n`))
            Log.write(Log.chalk.red(exception))
            throw exception
        }

        spinner.stop()
        Log.write(timer.getSecondsPretty(), Log.chalk.green(`bundle with rollup successful`))
    }

    /**
     * Write the bundled code to the specified file.
     * It is required to run the `bundle` command before. Otherwise, this wouldn't work
     */
    public async writeToFile () {
        // TODO add if (bundledCode doesn't exist) 
        const timer = new TimeHandler()

        const spinner = ora({
            text: Log.chalk.gray('writing bundle to file in progress\n'),
            color: 'gray'
        }).start()

        try {
            await this.bundledCode.write(this.configuration.outputConfiguration)
        } catch (exception) {
            spinner.stop()
            Log.write(timer.getSecondsPretty(), Log.chalk.red(`failed to write bundle to file\n`))
            Log.write(Log.chalk.red(exception))
            throw exception
        }

        spinner.stop()
        Log.write(timer.getSecondsPretty(), Log.chalk.green(`writing bundle to file successful`))
    }
}
