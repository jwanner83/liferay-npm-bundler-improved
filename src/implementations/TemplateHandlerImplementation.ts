import TemplateHandler from '../interfaces/TemplateHandler'
import { sep } from 'path'
import { existsSync, readFileSync } from 'fs'

export default class TemplateHandlerImplementation implements TemplateHandler {
  /**
   * The location of the templates
   * @private
   */
  private readonly base: string = '/dist/templates'

  public name: string
  public path: string
  public raw: Buffer
  public processed: string

  constructor(name: string) {
    this.name = name

    this.resolve()
  }

  resolve(): void {
    let scriptPath: string | string[] = __dirname.split(sep)
    scriptPath.pop()
    scriptPath = scriptPath.join(sep)

    this.path = `${scriptPath}/${this.base}/${this.name}`

    if (!existsSync(this.path)) {
      console.log(`template with name '${this.name}' in path '${this.path}' doesn't exist`)
      throw new Error()
    } else {
      this.raw = readFileSync(this.path)
      this.processed = this.raw.toString()
    }
  }

  replace(key: string, value: string): void {
    const expression: RegExp = new RegExp(`{{${key}}}`, 'g')
    this.processed = this.processed.replace(expression, () => {
      // with a callback, the special replacement pattern isn't applied
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
      return value
    })
  }
}
