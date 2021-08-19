import Log from '../classes/Log'

const pack = require(process.cwd() + '/package.json')

/**
 * The package handler which checks and serves the external package.json
 */
export default class PackageHandler {
    /**
     * The external package.json
     * @private
     */
    public readonly pack = pack

    /**
     * The required fields which have to be present inside the external package.json
     * @private
     */
    private readonly necessaryFields = ['name', 'version', 'description']

    /**
     * Check if the package.json contains all the necessary fields
     */
    public check () {
        if (pack) {
            for (const necessaryField of this.necessaryFields) {
                if (!pack[necessaryField]) {
                    Log.write(Log.chalk.red(`The package.json is missing the required field '${necessaryField}'.`))
                    throw new Error()
                }
            }
        } else {
            Log.write(Log.chalk.red(`The package.json couldn't be read. Please check if it exists.`))
            throw new Error()
        }
    }
}