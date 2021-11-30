import ProcessHandler from '../interfaces/ProcessHandler'
import PackageHandler from '../interfaces/PackageHandler'
import PackageHandlerImplementation from './PackageHandlerImplementation'
import JarHandler from '../interfaces/JarHandler'
import JarHandlerImplementation from './JarHandlerImplementation'
import TemplateHandlerImplementation from './TemplateHandlerImplementation'

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

  constructor(version: string) {
    this.version = version
  }

  async prepare(): Promise<void> {
    console.log('prepare')
    await this.packageHandler.resolve()
    this.packageHandler.validate()
    this.jarHandler.name = `${this.packageHandler.pack.name}-${this.packageHandler.pack.version}.jar`
  }

  async bundle(): Promise<void> {
    const wrapper = new TemplateHandlerImplementation('wrapper.js')

    wrapper.replace('name', this.packageHandler.pack.name)
    wrapper.replace('version', this.packageHandler.pack.version)
    wrapper.replace('main', this.packageHandler.pack.main)
  }
}
