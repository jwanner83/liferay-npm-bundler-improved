import { mkdir, readdir, stat } from 'fs'
import { sep } from 'path'
import { promisify } from 'util'
import FileNotFoundException from '../exceptions/FileNotFoundException'
import File from './File'

export default class Folder {
  public name: string
  public path: string
  public exists: boolean = false
  public files: File[] = []

  public static async getFolder(path: string, required: boolean): Promise<Folder> {
    const folder = new Folder()
    await folder.resolve(path, required)
    return folder
  }

  static async createFolderStructure(path: string): Promise<void> {
    try {
      await promisify(mkdir)(File.getCleanPath(path), { recursive: true })
    } catch { /* silent */ }
  }

  private async resolve(path: string, required: boolean): Promise<void> {
    this.path = File.getCleanPath(path)
    this.name = this.path.split(sep).pop()
    let files

    try {
      files = (await promisify(readdir)(this.path))
      this.exists = true
    } catch {
      if (required) {
        throw new FileNotFoundException(
          `the required '${this.name}' in path '${this.path}' could not be found.`
        )
      }
    }

    if (files) {
      this.files = await Promise.all(
        files.map(async (sub: string) => {
          const filePath = File.getCleanPath(`${this.path}${sep}${sub}`)
          return (await promisify(stat)(filePath)).isDirectory() ? await Folder.getFolder(filePath, required) : await File.getFile(filePath, required)
        })
      )
    }
  }
}
