import { readdir, stat, mkdir } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FileHandler {
  static async createFolderStructure (path: string): Promise<void> {
    try {
      await promisify(mkdir)(path, { recursive: true })
    } catch {
      // silent
    }
  }

  static async getFiles(directory): Promise<string[]> {
    const subs = await promisify(readdir)(directory)
    const files = await Promise.all(
      subs.map(async (sub) => {
        const res = resolve(directory, sub)
        return (await promisify(stat)(res)).isDirectory() ? await this.getFiles(res) : res
      })
    )
    return Array.from(files.reduce((a, f) => a.concat(f as string), []))
  }
}
