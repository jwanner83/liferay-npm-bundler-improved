import { access, readFile, writeFile, mkdir } from 'fs'
import { sep } from 'path'
import { promisify } from 'util'
import TemplatesNotFoundException from '../exceptions/TemplatesNotFoundException'
import SettingsHandler from './SettingsHandler'

export default class TemplateHandler {
  private readonly base = `${sep}dist${sep}templates`

  public readonly name: string
  private path: string
  private raw: Buffer
  public processed: string

  constructor(name: string) {
    this.name = name
  }

  async resolve(): Promise<void> {
    let scriptPath: string | string[] = __dirname.split(sep)
    scriptPath.pop()
    scriptPath = scriptPath.join(sep)

    this.path = `${scriptPath}${sep}${this.base}${sep}${this.name}`

    try {
      await promisify(access)(this.path)
    } catch {
      throw new TemplatesNotFoundException(
        `no template with name '${this.name}' has been found in path ${this.path}`
      )
    }

    this.raw = await promisify(readFile)(this.path)
    this.processed = this.raw.toString()
  }

  async seal (settingsHandler: SettingsHandler, name?: string): Promise<void> {
    if (!settingsHandler.createJar) {
      try {
        await promisify(mkdir)(`.${sep}build`)
      } catch {
        // silent
      }

      try {
        await promisify(writeFile)(name ?? this.name, this.processed)
      } catch (e) {
        throw new TemplatesNotFoundException(`failed to save '${name ?? this.name}' in 'build'`);
      }
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
