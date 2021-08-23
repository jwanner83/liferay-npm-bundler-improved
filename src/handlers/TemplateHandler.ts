import { existsSync, readFileSync } from 'fs'
import Log from '../classes/Log'
import * as path from 'path'

/**
 * The template handler which gets the template by its name and replaces the placeholder
 * variables with the passed values
 */
export default class TemplateHandler {
    /**
     * The path to the liferay-npm-bundler-improved folder to be
     * able to access the templates
     * @private
     */
    private readonly scripPath: string

    /**
     * The location of the templates
     * @private
     */
    private readonly templatesPath: string = 'src/templates'

    /**
     * The name of the template
     */
    public readonly templateName: string

    /**
     * The path of the template
     */
    public readonly templatePath: string

    /**
     * The raw content of the template
     */
    public readonly raw: Buffer

    /**
     * The processed content of the template
     */
    public processed: string

    constructor(templateName: string) {
        let scriptPath: string | Array<string> = __dirname.split(path.sep)
        scriptPath.pop()
        scriptPath = scriptPath.join(path.sep)

        this.templateName = templateName
        this.templatePath = `${scriptPath}/${this.templatesPath}/${this.templateName}`

        if (!existsSync(this.templatePath)) {
            Log.trace(false, `template with name '${templateName}' in path '${this.templatePath}' doesn't exist`)
            throw new Error()
        } else {
            this.raw = readFileSync(this.templatePath)
            this.processed = this.raw.toString()
        }
    }

    /**
     * Replaces all variables with the given key with the value
     * @param key
     * @param value
     */
    public replace (key: string, value: string) {
        const expression: RegExp = new RegExp(key, 'g')
        this.processed.replace(expression, value)
    }
}