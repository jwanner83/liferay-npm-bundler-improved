import File from './File'
import { sep } from 'path'
import { promisify } from 'util'
import { mkdir, writeFile } from 'fs'
import TemplatesNotFoundException from '../exceptions/TemplatesNotFoundException'
import { Store } from '../Store'

export default class Template {
  private readonly original: string

  public readonly name: string
  public processed: string

  constructor (name: string, content: string,) {
    this.name = name
    this.original = content
    this.processed = content
  }

  public static async getTemplate(name: string): Promise<Template> {
    const base = `${sep}dist${sep}templates`

    let bundlerPath: string | string[] = __dirname.split(sep)
    bundlerPath.pop()
    bundlerPath = bundlerPath.join(sep)
    const path = `${bundlerPath}${sep}${base}${sep}${name}`

    const file = await File.getFile(path, true, false)
    return new Template(name, file.content)
  }

  async seal(path: string): Promise<void> {
    try {
      await promisify(mkdir)(Store.portlet.input.path)
    } catch {
      // silent
    }

    try {
      await promisify(writeFile)(path, this.processed)
    } catch (e) {
      throw new TemplatesNotFoundException(`failed to save '${this.name}' in '${path}'`)
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
