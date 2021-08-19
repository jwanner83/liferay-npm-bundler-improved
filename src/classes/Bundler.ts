import { existsSync, mkdirSync, unlink } from 'fs'
import { promisify } from 'util'
import Log from './Log'
import PackageHandler from '../handlers/PackageHandler'
import TimeHandler from '../handlers/TimeHandler'
import RollupHandler from '../handlers/RollupHandler'
import TemplateHandler from '../handlers/TemplateHandler'
import JarHandler from '../handlers/JarHandler'

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

  /*public wrap = async () => {
    const start: Date = new Date()

    // use output option file
    const bundled = await readFilePromisified(`dist/${this.entryPoint}.js`)

    Log.write(Log.chalk.green(`wrapping code inside of Liferay.Loader successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

  public features = async () => {
    const start: Date = new Date()

    if (!existsSync('.npmbundlerrc')) {
      Log.write(Log.chalk.gray(`The file .npmbundlerrc doesn't exist. No features will be added to the portlet. Took ${(new Date().getTime() - start.getTime()) / 1000}s. Build will continue.`))
    }

    let configuration: string
    let localization: string

    const data = await readFilePromisified('.npmbundlerrc')
    const file = JSON.parse(data.toString())

    const createJarKey = 'create-jar'
    const featuresKey = 'features'

    if (file[createJarKey] && file[createJarKey][featuresKey]) {
      const features = file[createJarKey][featuresKey]

      if (features.configuration) {
        Log.write(Log.chalk.gray(`Found the configuration feature.`))
        configuration = features.configuration
      }
      if (features.localization) {
        Log.write(Log.chalk.gray(`Found the localization feature.`))
        localization = features.localization
      }
    }
  };

  public create = async () => {
    const start: Date = new Date()
    const spinner = ora({
      text: Log.chalk.gray('create jar structure\n'),
      color: 'gray'
    }).start()

    const zip = new JSZip()

    const meta = zip.folder('META-INF')
    meta.file('MANIFEST.MF', this.manifestMF)

    const resources = meta.folder('resources')
    resources.file('manifest.json', this.manifestJSON)
    resources.file('package.json', JSON.stringify(pack))
    resources.file(`${this.entryPoint}.js`, this.wrapped)

    spinner.text = Log.chalk.gray('save jar\n')

    const content = await zip.generateAsync({
      type: 'nodebuffer'
    })
    await writeFilePromisified(`dist/${this.jarName}`, content)

    spinner.stop()
    Log.write(Log.chalk.green(`created and saved jar file successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

  public cleanup = async () => {
    const start: Date = new Date()
    Log.write(Log.chalk.gray(`remove ${this.entryPoint}.js file from dist`))

    if (existsSync(`dist/${this.entryPoint}.js`)) {
      await unlinkPromisified(`dist/${this.entryPoint}.js`)
      Log.write(Log.chalk.green(`deleted ${this.entryPoint}.js file from dist successfully in ${(new Date().getTime() - start.getTime()) / 1000}s`))
    } else {
      Log.write(Log.chalk.gray(`${this.entryPoint}.js file doesn't exist in dist in ${(new Date().getTime() - start.getTime()) / 1000}s. Build will continue.`))
    }
  }

  public deploy = async (deploy) => {
    const start: Date = new Date()

    let destination = deploy

    try {
      const data = await readFilePromisified('.npmbuildrc')
      const file = JSON.parse(data.toString())

      if (file.liferayDir) {
        destination = path.join(file.liferayDir, 'deploy')
        Log.write(Log.chalk.gray(`found .npmbuildrc file with valid destination`))
      }
    } catch (exception) {
      // ignore
    }

    if (!destination) {
      Log.write(Log.chalk.red(`failed to deploy ${this.jarName} in ${(new Date().getTime() - start.getTime()) / 1000}s. destination is not set either through .npmbuildrc or flag`))
      throw new Error()
    }

    try {
      await copyFilePromisified(`dist/${this.jarName}`, path.join(destination, this.jarName))
      Log.write(Log.chalk.green(`successfully deployed ${this.jarName} to ${destination} in ${(new Date().getTime() - start.getTime()) / 1000}s`))
    } catch (exception) {
      Log.write(Log.chalk.red(`failed to deploy ${this.jarName} to ${destination} in ${(new Date().getTime() - start.getTime()) / 1000}s, ${exception.message}`))
      throw exception
    }
  }*/
}