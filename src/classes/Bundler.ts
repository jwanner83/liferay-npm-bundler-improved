import { existsSync, mkdirSync, unlink } from 'fs'
import { promisify } from 'util'
import Log from './Log'
import PackageHandler from '../handlers/PackageHandler'
import TimeHandler from '../handlers/TimeHandler'
import RollupHandler from '../handlers/RollupHandler'
import TemplateHandler from '../handlers/TemplateHandler'
import JarHandler from '../handlers/JarHandler'
import DeploymentHandler from '../handlers/DeploymentHandler'

const unlinkPromisified = promisify(unlink)

export default class Bundler {
  /**
   * The js entry point
   * @private
   */
  private entryPoint: string

  /**
   * The package handler
   * @private
   */
  private packageHandler: PackageHandler = new PackageHandler()

  /**
   * The rollup handler
   * @private
   */
  private rollupHandler: RollupHandler = new RollupHandler()

  /**
   * The jar handler
   * @private
   */
  private jarHandler: JarHandler = new JarHandler()

  public async prepare () {
    const timer = new TimeHandler()

    Log.write(Log.chalk.white('basic'))
    Log.write(Log.chalk.gray('verify external package.json file'))
    this.packageHandler.check()

    Log.write(Log.chalk.gray('set globaly used variables'))
    this.jarHandler.name = `${this.packageHandler.pack.name}-${this.packageHandler.pack.version}.jar`
    this.entryPoint = this.packageHandler.pack.main || 'index'

    if (!existsSync('dist')) {
      Log.write(Log.chalk.gray('create dist directory'))
      mkdirSync('dist')
    }

    Log.write(timer.getSecondsPretty(), Log.chalk.green(`finished basic prepare tasks successfully`))
    timer.reset()

    Log.write(Log.chalk.white('\nrollup'))
    Log.write(Log.chalk.gray('load custom rollup configuration file if exists'))
    await this.rollupHandler.loadExternalConfiguration()
    Log.write(timer.getSecondsPretty(), Log.chalk.green(`finished rollup prepare tasks successfully`))
  }

  public async bundle () {
    Log.write(Log.chalk.white('bundle code'))
    await this.rollupHandler.bundle()

    Log.write(Log.chalk.white('\nwrite code to file'))
    await this.rollupHandler.writeToFile()
  }

  public async process () {
    const timer = new TimeHandler()

    Log.write(Log.chalk.white('process templates and replace variables'))
    Log.write(Log.chalk.gray('process wrapper.js'))
    const wrapperJsTemplate = new TemplateHandler('wrapper.js')
    wrapperJsTemplate.replace('name', this.packageHandler.pack.name)
    wrapperJsTemplate.replace('version', this.packageHandler.pack.version)
    wrapperJsTemplate.replace('main', this.entryPoint)
    const bundle = await this.rollupHandler.getBundledCode()
    wrapperJsTemplate.replace('bundle', bundle)

    Log.write(Log.chalk.gray('process MANIFEST.MF'))
    const manifestMFTemplate = new TemplateHandler('MANIFEST.MF')
    manifestMFTemplate.replace('name', this.packageHandler.pack.name)
    manifestMFTemplate.replace('description', this.packageHandler.pack.description)
    manifestMFTemplate.replace('version', this.packageHandler.pack.version)

    Log.write(Log.chalk.gray('process manifest.json'))
    const manifestJSONTemplate = new TemplateHandler('manifest.json')
    manifestJSONTemplate.replace('name', this.packageHandler.pack.name)
    manifestJSONTemplate.replace('version', this.packageHandler.pack.version)

    Log.write(timer.getSecondsPretty(), Log.chalk.green(`finished template processing successful`))
    timer.reset()

    Log.write(Log.chalk.white('\nprocess jar file'))
    Log.write(Log.chalk.gray('create file structure'))
    const meta = this.jarHandler.jar.folder('META-INF')
    meta.file('MANIFEST.MF', manifestMFTemplate.processed)

    const resources = meta.folder('resources')
    resources.file('manifest.json', manifestJSONTemplate.processed)
    resources.file(`${this.entryPoint}.js`, wrapperJsTemplate.processed)
    resources.file('package.json', JSON.stringify(this.packageHandler.pack))

    Log.write(timer.getSecondsPretty(), Log.chalk.green('finished jar processing successful'))
  }

  public async create () {
    const timer = new TimeHandler()

    Log.write(Log.chalk.white('create jar file'))
    await this.jarHandler.createJarFile()
    Log.write(timer.getSecondsPretty(), Log.chalk.green('finished creating jar successful'))
  }

  public async cleanup () {
    const timer = new TimeHandler()

    Log.write(Log.chalk.white('cleanup dist folder'))
    Log.write(Log.chalk.gray(`remove ${this.entryPoint}.js file from dist`))
    if (existsSync(`dist/${this.entryPoint}.js`)) {
      await unlinkPromisified(`dist/${this.entryPoint}.js`)
      Log.write(timer.getSecondsPretty(), Log.chalk.green(`deleted ${this.entryPoint}.js file from dist successful`))
    } else {
      Log.write(timer.getSecondsPretty(), Log.chalk.gray(`${this.entryPoint}.js file doesn't exist in dist. build will continue.`))
    }
  }

  public async deploy (location: string = '') {
    const deploymentHandler = new DeploymentHandler(location)

    Log.write(Log.chalk.white('resolve deployment destination'))
    await deploymentHandler.resolveDestination()

    Log.write(Log.chalk.white(`\ncopy ${this.jarHandler.name} to ${deploymentHandler.destination}`))
    await deploymentHandler.deploy(this.jarHandler.name)
  }
}