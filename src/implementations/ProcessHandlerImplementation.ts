import ProcessHandler from '../interfaces/ProcessHandler'
import PackageHandler from '../interfaces/PackageHandler'
import PackageHandlerImplementation from './PackageHandlerImplementation'
import JarHandler from '../interfaces/JarHandler'
import JarHandlerImplementation from './JarHandlerImplementation'

export default class ProcessHandlerImplementation implements ProcessHandler {
  /**
   * The version of the bundler
   */
  private readonly version: string

  /**
   * The external package.json handler
   */
  private readonly packageHandler: PackageHandler = new PackageHandlerImplementation()

  /**
   * The jar handler
   */
  private readonly jarHandler: JarHandler = new JarHandlerImplementation()

  constructor(version) {
    this.version = version
  }

  async prepare(): Promise<void> {
    console.log('prepare')
    await this.packageHandler.resolve()
    this.packageHandler.validate()
    this.jarHandler.name = `${this.packageHandler.pack.name}-${this.packageHandler.pack.version}.jar`
  }

  async bundle(): Promise<void> {}
}
