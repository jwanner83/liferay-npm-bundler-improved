import { existsSync, mkdirSync } from 'fs'
import Log from './Log'
import PackageHandler from '../handlers/PackageHandler'
import TimeHandler from '../handlers/TimeHandler'
import RollupHandler from '../handlers/RollupHandler'

export default class Bundler {
  /**
   * The name of the jar file
   * @private
   */
  private jarName: string

  /**
   * The js entry point
   * @private
   */
  private entryPoint: string

  /**
   * The external package.json file
   * @private
   */
  private pack: any

  /**
   * The rollup handler
   * @private
   */
  private rollupHandler: RollupHandler = new RollupHandler()

  public async prepare () {
    const timer = new TimeHandler()

    Log.write(Log.chalk.white('basic'))
    Log.write(Log.chalk.gray('verify external package.json file'))
    PackageHandler.check()

    Log.write(Log.chalk.gray('set globaly used variables'))
    this.pack = PackageHandler.pack
    this.jarName = `${this.pack.name}-${this.pack.version}.jar`
    this.entryPoint = this.pack.main || 'index'

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
    const timer = new TimeHandler()

    Log.write(Log.chalk.white('bundle code'))
    await this.rollupHandler.bundle()

    Log.write(Log.chalk.white('write code to file'))
    await this.rollupHandler.writeToFile()
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