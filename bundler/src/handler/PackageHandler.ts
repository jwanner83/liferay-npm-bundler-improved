import { readFile } from 'fs'
import { promisify } from 'util'
import InvalidPackageException from '../exceptions/InvalidPackageException'
import Pack from '../types/Pack.types'

export default class PackageHandler {
  public pack: Pack

  async resolve(): Promise<void> {
    const file = await promisify(readFile)('./package.json')
    this.pack = await JSON.parse(file.toString())
  }

  public validate(): void {
    if (!this.pack.name) {
      throw new InvalidPackageException(
        `required property "name" doesn't exist in the package.json file.`
      )
    } else if (!this.pack.version) {
      throw new InvalidPackageException(
        `required property "version" doesn't exist in the package.json file.`
      )
    } else if (!this.pack.main) {
      throw new InvalidPackageException(
        `required property "main" doesn't exist in the package.json file.`
      )
    }
  }
}
