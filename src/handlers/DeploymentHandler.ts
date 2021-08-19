import Log from '../classes/Log'
import { copyFile, existsSync, readFile } from 'fs'
import * as path from 'path'
import TimeHandler from './TimeHandler'
import { promisify } from 'util'

const readFilePromisified = promisify(readFile)
const copyFilePromisified = promisify(copyFile)

export default class DeploymentHandler {
    /**
     * The value of the `deploy` param
     * @private
     */
    private readonly location: string

    /**
     * The actual destination, where the jar file will be deployed
     */
    public destination: string

    constructor (location: string) {
        this.location = location
    }

    /**
     * Resolve the destination folder where the jar will be deployed.
     */
    public async resolveDestination () {
        const timer = new TimeHandler()

        if (this.location) {
            this.destination = this.location
            Log.write(timer.getSecondsPretty(), Log.chalk.green('destination has been passed by param'))
        } else {
            if (existsSync('.npmbuildrc')) {
                const data = await readFilePromisified('.npmbuildrc')
                const file = JSON.parse(data.toString())

                if (file.liferayDir) {
                    this.destination = path.join(file.liferayDir, 'deploy')
                    Log.write(timer.getSecondsPretty(), Log.chalk.green(`destination was found inside the '.npmbuildrc' file`))
                }
            }
        }

        if (!this.destination) {
            Log.write(timer.getSecondsPretty(), Log.chalk.red(`failed to resolve deployment destination. destination has to be set either through the '.npmbuildrc' file or the -d param`))
            throw new Error()
        }
    }

    /**
     * Deploy the jar file to the defined destination
     * @param jarName
     */
    public async deploy (jarName: string) {
        const timer = new TimeHandler()

        try {
            await copyFilePromisified(`dist/${jarName}`, path.join(this.destination, jarName))
            Log.write(timer.getSecondsPretty(), Log.chalk.green(`successfully deployed ${jarName} to ${this.destination}`))
        } catch (exception) {
            Log.write(timer.getSecondsPretty(), Log.chalk.red(`failed to deploy ${jarName} to ${this.destination}\n`))
            Log.write(Log.chalk.red(exception.message))
            throw exception
        }
    }
}