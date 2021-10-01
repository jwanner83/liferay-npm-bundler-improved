import { existsSync, mkdirSync, unlink } from 'fs'
import { promisify } from 'util'
import Log from './Log'
import PackageHandler from '../handlers/PackageHandler'
import TimeHandler from '../handlers/TimeHandler'
import RollupHandler from '../handlers/RollupHandler'
import TemplateHandler from '../handlers/TemplateHandler'
import JarHandler from '../handlers/JarHandler'
import DeploymentHandler from '../handlers/DeploymentHandler'
import FeaturesHandler from '../handlers/FeaturesHandler'

const unlinkPromisified = promisify(unlink)

export default class Bundler implements Bundler {
  /**
   * The js entry point
   * @private
   */
  private entryPoint: string

  /**
   * The package handler
   * @private
   */
  private readonly packageHandler: PackageHandler = new PackageHandler()

  /**
   * The rollup handler
   * @private
   */
  private readonly rollupHandler: RollupHandler = new RollupHandler()

  /**
   * The jar handler
   * @private
   */
  private jarHandler: JarHandler = new JarHandler()

  public async prepare (): Promise<void> {
    const timer = new TimeHandler()

    Log.info(false, 'basic')
    Log.debug('verify external package.json file')
    this.packageHandler.check()

    Log.debug('set globaly used variables')
    this.jarHandler.name = `${this.packageHandler.pack.name}-${this.packageHandler.pack.version}.jar`
    this.entryPoint = this.packageHandler.pack.main || 'index'

    if (!existsSync('dist')) {
      Log.debug('create dist directory')
      mkdirSync('dist')
    }

    Log.success(timer, 'finished basic prepare tasks successfully')
    timer.reset()

    Log.info(true, 'rollup')
    Log.debug('load custom rollup configuration file if exists')
    await this.rollupHandler.loadExternalConfiguration()
    Log.success(timer, 'finished rollup prepare tasks successfully')
  }

  public async bundle (): Promise<void> {
    Log.info(false, 'bundle code')
    await this.rollupHandler.bundle()

    Log.info(true, 'extract bundled code')
    await this.rollupHandler.getBundledCode()
  }

  public async process (): Promise<void> {
    const timer = new TimeHandler()

    Log.info(false, 'process features')
    const featuresHandler = new FeaturesHandler()

    Log.debug('detect features')
    await featuresHandler.detectFeatures()

    if (featuresHandler.hasLocalization) {
      const files: Map<string, string> = await featuresHandler.getLocalizations()

      if (files.size > 0) {
        Log.debug('create localization file structure')
        const content = this.jarHandler.jar.folder('content')

        for (const [key, value] of files) {
          content.file(key, value)
        }
      }
    }

    Log.success(timer, 'finished feature processing successful')
    timer.reset()

    Log.info(true, 'process templates and replace variables')
    Log.debug('process wrapper.js')
    const wrapperJsTemplate = new TemplateHandler('wrapper.js')
    wrapperJsTemplate.replace('name', this.packageHandler.pack.name)
    wrapperJsTemplate.replace('version', this.packageHandler.pack.version)
    wrapperJsTemplate.replace('main', this.entryPoint)
    wrapperJsTemplate.replace('bundle', this.rollupHandler.bundledCode)

    Log.debug('process MANIFEST.MF')
    const manifestMFTemplate = new TemplateHandler('MANIFEST.MF')
    manifestMFTemplate.replace('name', this.packageHandler.pack.name)
    manifestMFTemplate.replace('description', this.packageHandler.pack.description)
    manifestMFTemplate.replace('version', this.packageHandler.pack.version)

    if (featuresHandler.hasLocalization) {
      manifestMFTemplate.replace('language-resource', ',liferay.resource.bundle;resource.bundle.base.name="content.Language"')
    } else {
      manifestMFTemplate.replace('language-resource', '')
    }

    Log.debug('process manifest.json')
    const manifestJSONTemplate = new TemplateHandler('manifest.json')
    manifestJSONTemplate.replace('name', this.packageHandler.pack.name)
    manifestJSONTemplate.replace('version', this.packageHandler.pack.version)

    Log.success(timer, 'finished template processing successful')
    timer.reset()

    Log.info(true, 'process jar file')
    Log.debug('create file structure')
    const meta = this.jarHandler.jar.folder('META-INF')
    meta.file('MANIFEST.MF', manifestMFTemplate.processed)

    const resources = meta.folder('resources')
    resources.file('manifest.json', manifestJSONTemplate.processed)
    resources.file(`${this.entryPoint}.js`, wrapperJsTemplate.processed)
    resources.file('package.json', JSON.stringify(this.packageHandler.pack))

    Log.success(timer, 'finished jar processing successful')
  }

  public async create (): Promise<void> {
    const timer = new TimeHandler()

    Log.info(false, 'create jar file')
    await this.jarHandler.createJarFile()
    Log.success(timer, `finished creating 'dist/${this.jarHandler.name}' successful`)
  }

  public async cleanup (): Promise<void> {
    const timer = new TimeHandler()

    Log.info(false, 'cleanup dist folder')
    Log.debug(`remove ${this.entryPoint}.js file from dist`)
    if (existsSync(`dist/${this.entryPoint}.js`)) {
      await unlinkPromisified(`dist/${this.entryPoint}.js`)
      Log.success(timer, `deleted ${this.entryPoint}.js file from dist successful`)
    } else {
      Log.success(timer, `${this.entryPoint}.js file doesn't exist in dist. build will continue.`)
    }
  }

  public async deploy (location: string = ''): Promise<void> {
    const deploymentHandler = new DeploymentHandler(location)

    Log.info(false, 'resolve deployment destination')
    await deploymentHandler.resolveDestination()

    Log.info(true, `copy ${this.jarHandler.name} to ${deploymentHandler.destination}`)
    await deploymentHandler.deploy(this.jarHandler.name)
  }
}