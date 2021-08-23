import RollupConfiguration from '../classes/RollupConfiguration'
import Log from '../classes/Log'
import { existsSync, readFile } from 'fs'
import { promisify } from 'util'
import TimeHandler from './TimeHandler'
const rollup = require('rollup').rollup
const loadConfigFile = require('rollup/dist/loadConfigFile')

const readFilePromisified = promisify(readFile)

export default class RollupHandler {
    /**
     * Bundler configuration
     * @private
     */
    private configuration: RollupConfiguration = new RollupConfiguration()

    /**
     * The rollup bundle
     * @private
     */
    private rollupBundle: any

    /**
     * The bundled code
     * @private
     */
    private bundledCode: string

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
     * Write the bundled code to the specified file.
     * It is required to run the `bundle` command before. Otherwise, this wouldn't work
     */
    public async writeToFile () {
        // TODO add if (rollupBundle doesn't exist)
        const timer = new TimeHandler()

        const spinner = Log.ora({
            text: Log.chalk.gray('writing bundle to file in progress\n'),
            color: 'gray'
        }).start()

        try {
            await this.rollupBundle.write(this.configuration.outputConfiguration)
        } catch (exception) {
            spinner.stop()
            Log.error(timer, 'failed to write bundle to file')
            Log.trace(true, exception)
            throw exception
        }

        spinner.stop()
        Log.success(timer, 'writing bundle to file successful')
    }

    /**
     * Get the bundled code out of the written file
     * It is required to run the `writeToFile` command before. Otherwise, this wouldn't work
     */
    public async getBundledCode () {
        if (this.bundledCode) {
            return this.bundledCode
        } else {
            const path = this.configuration.outputConfiguration.file

            if (existsSync(path)) {
                const code = await readFilePromisified(path)
                this.bundledCode = code.toString()
                return this.bundledCode
            } else {
                Log.trace(false, `File with bundled code doesn't exist in path ${path}`)
                throw new Error()
            }
        }
    }
}
