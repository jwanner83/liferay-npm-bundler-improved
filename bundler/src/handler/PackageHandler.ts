import { readFile } from 'fs/promises'
import InvalidPackageException from '../exceptions/InvalidPackageException'
import Pack from '../types/Pack.types'

export default class PackageHandler {
  public pack: Pack

  async resolve(): Promise<void> {
    const file = await readFile('./package.json')
    this.pack = await JSON.parse(file.toString())
  }

  public validate(): void {
    if (!this.pack.name) {
      throw new InvalidPackageException(
        `property name is invalid in the package.json file: ${this.pack.name}`
      )
    } else if (!this.pack.version) {
      throw new InvalidPackageException(
        `property version is invalid in the package.json file: ${this.pack.version}`
      )
    } else if (!this.pack.main) {
      throw new InvalidPackageException(
        `property main is invalid in the package.json file: ${this.pack.main}`
      )
    }
  }
}
