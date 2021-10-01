import InvalidPackageException from '../exceptions/InvalidPackageException'
import PackageHandler from '../interfaces/PackageHandler'
import Pack from '../types/Pack'
import { promises as fs } from 'fs'

export default class PackageHandlerImplementation implements PackageHandler {
  public pack: Pack

  public async resolve(): Promise<void> {
    const file = await fs.readFile('./package.json')
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
