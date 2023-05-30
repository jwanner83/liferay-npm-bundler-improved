import { readFile } from 'fs'
import { sep } from 'path'
import { promisify } from 'util'
import FileNotFoundException from '../exceptions/FileNotFoundException'
import FileJsonParseException from '../exceptions/FileJsonParseException'
import { log } from '../log'
import FileMissingAttributeException from '../exceptions/FileMissingAttributeException'

export default class File<FileType = string> {
  public name: string
  public path: string
  public content: FileType

  public static async getFile<FileType = string>(path: string, required: boolean, json: boolean = true): Promise<File<FileType>> {
    const file = new File<FileType>()
    await file.resolve(path, required, json)
    return file
  }

  public static getCleanPath (path: string): string {
    return path.replace(/\//g, sep)
  }

  private async resolve(path: string, required: boolean, json: boolean): Promise<void> {
    this.path = File.getCleanPath(path)
    this.name = this.path.split(sep).pop()
    let file

    try {
      file = (await promisify(readFile)(this.path)).toString()
    } catch {
      if (required) {
        throw new FileNotFoundException(
          `the required '${this.name}' in path '${this.path}' could not be found.`
        )
      }
    }

    if (json) {
      try {
        this.content = await JSON.parse(file)
      } catch {
        if (required) {
          throw new FileJsonParseException(`failed to parse the required '${this.name}' in '${this.path}'`)
        } else {
          log.warn(`failed to parse the '${this.name}' in '${this.path}'`)
        }
      }
    } else {
      this.content = file as unknown as FileType
    }
  }

  public validate(attributes: string[]): void {
    for (const attribute of attributes) {
      if (!this.content[attribute]) {
        throw new FileMissingAttributeException(
          `the required attribute '${attribute}' doesn't exist in the ${this.name} file`
        )
      }
    }
  }
}
