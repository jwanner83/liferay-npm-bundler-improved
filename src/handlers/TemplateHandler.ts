import { existsSync, readFileSync } from 'fs'
import Log from '../classes/Log'

/**
 * The template handler which gets the template by its name and replaces the placeholder
 * variables with the passed values
 */
export default class TemplateHandler {
    /**
     * The location of the templates
     * @private
     */
    private readonly templatesPath: string = '/templates'

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
        this.templateName = templateName
        this.templatePath = `${this.templatesPath}/${this.templateName}`

        if (!existsSync(this.templatePath)) {
            Log.write()
            console.error('template doesn`t exist')
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