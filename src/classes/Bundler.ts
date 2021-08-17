import { rollup } from 'rollup'
import loadConfigFile from 'rollup/dist/loadConfigFile'
import ora from 'ora'
import JSZip from 'jszip'
import path from 'path'
import { promisify } from 'util'
import { readFile, writeFile, copyFile, existsSync, mkdirSync, unlink } from 'fs'
import Configuration from './Configuration'
import Log from './Log'
import PackageHandler from '../handlers/PackageHandler'

const readFilePromisified = promisify(readFile)
const writeFilePromisified = promisify(writeFile)
const copyFilePromisified = promisify(copyFile)
const unlinkPromisified = promisify(unlink)

export default class Bundler {
  /**
   * Bundler configuration
   * @private
   */
  private configuration: Configuration = new Configuration()

  /**
   * The name of the jar file
   * @private
   */
  private readonly jarName: string

  /**
   * The js entry point
   * @private
   */
  private readonly entryPoint: string

  /**
   * The external package.json file
   * @private
   */
  private readonly pack: any

  constructor () {
    PackageHandler.check()
    this.pack = PackageHandler.pack
    this.jarName = `${this.pack.name}-${this.pack.version}.jar`
    this.entryPoint = this.pack.main || 'index'
  }

  public loadRollupConfiguration = async () => {
    const start: Date = new Date()
    Log.write(Log.chalk.gray('loading custom rollup configuration'))

    if (existsSync('rollup.config.js')) {
      try {
        const { options } = await loadConfigFile(process.cwd() + '/rollup.config.js')
        this.configuration.setConfigurationFromFile(options)
        Log.write(Log.chalk.green(`custom rollup configuration has been found and loaded in ${(new Date().getTime() - start.getTime()) / 1000}s.`))
      } catch (exception) {
        Log.write(Log.chalk.red(`configuration file contains errors in ${(new Date().getTime() - start.getTime()) / 1000}s.`))
        Log.write(Log.chalk.red(exception))
        throw exception
      }
    } else {
      Log.write(Log.chalk.gray(`no custom rollup configuration has been found in ${(new Date().getTime() - start.getTime()) / 1000}s. The default will be used.`))
    }
  }

  public createDistDirectory = async () => {
    const start: Date = new Date()

    if (!existsSync('dist')) {
      mkdirSync('dist')
      Log.write(Log.chalk.green(`dist directory created successfully in ${(new Date().getTime() - start.getTime()) / 1000}s`))
    }
  }

  public bundle = async () => {
    let start: Date = new Date()
    const spinner = ora({
      text: Log.chalk.gray('bundle with rollup in progress\n'),
      color: 'gray'
    }).start()

    let bundle

    try {
      bundle = await rollup(this.configuration.inputConfiguration)
    } catch (exception) {
      spinner.stop()
      Log.write(Log.chalk.red(`failed to bundle code with rollup in ${(new Date().getTime() - start.getTime()) / 1000}s`))
      Log.write(Log.chalk.red(exception))
      throw exception
    }

    spinner.stop()
    Log.write(Log.chalk.green(`bundle with rollup successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))

    start = new Date()
    spinner.start(Log.chalk.gray('writing bundle to file\n'))

    try {
      await bundle.write(this.configuration.outputConfiguration)
    } catch (exception) {
      spinner.stop()
      Log.write(Log.chalk.red(`failed to write bundle to file in ${(new Date().getTime() - start.getTime()) / 1000}s`))
      Log.write(Log.chalk.red(exception))
      throw exception
    }

    spinner.stop()
    Log.write(Log.chalk.green(`writing bundle to file successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

  public wrap = async () => {
    const start: Date = new Date()

    const bundled = await readFilePromisified(`dist/${this.entryPoint}.js`)
    this.setWrapped(bundled)

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
  }
}