const rollup = require('rollup').rollup
const loadConfigFile = require('rollup/dist/loadConfigFile')
const ora = require('ora')
const JSZip = require('jszip')
const path = require('path')

// the package json of the portlet
const pack = require(process.cwd() + '/package.json')

import { promisify } from 'util'
import { readFile, writeFile, copyFile, existsSync, mkdirSync, unlink } from 'fs'

const readFilePromisified = promisify(readFile)
const writeFilePromisified = promisify(writeFile)
const copyFilePromisified = promisify(copyFile)
const unlinkPromisified = promisify(unlink)


import Configuration from './Configuration'
import Log from './Log'

export default class Bundler {
  private configuration: Configuration = new Configuration()
  private name: string = `${pack.name}-${pack.version}.jar`
  private main: string = pack.main || 'index'
  private wrapped: string = ''
  private manifestMF: string =
    `Manifest-Version: 1.0\n` +
    `Bundle-ManifestVersion: 2\n` +
    `Bundle-Name: ${pack.description}\n` +
    `Bundle-SymbolicName: ${pack.name}\n` +
    `Bundle-Version: ${pack.version}\n` +
    `Provide-Capability: osgi.webresource;osgi.webresource=${pack.name};version:Version="${pack.version}"\n` +
    `Require-Capability: osgi.extender;filter:="(&(osgi.extender=liferay.frontend.js.portlet)(version>=1.0.0))"\n` +
    `Tool: liferay-npm-bundler-2.26.0\n` +
    `Web-ContextPath: /${pack.name}`
  private manifestJSON: string = JSON.stringify({
    "packages": {
      "/": {
        "dest": {
          "dir": "./build",
          "id": "/",
          "name": pack.name,
          "version": pack.version
        },
        "src": {
          "dir": ".",
          "id": "/",
          "name": pack.name,
          "version": pack.version
        }
      }
    }
  })

  private setWrapped = (bundled: Buffer) => {
    this.wrapped = `Liferay.Loader.define('${pack.name}@${pack.version}/${this.main}', ['module', 'exports', 'require'], function (module, exports, require) { ${bundled} });`
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

    const bundled = await readFilePromisified(`dist/${this.main}.js`)
    this.setWrapped(bundled)

    Log.write(Log.chalk.green(`wrapping code inside of Liferay.Loader successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

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
    resources.file('index.js', this.wrapped)

    spinner.text = Log.chalk.gray('save jar\n')

    const content = await zip.generateAsync({
      type: 'nodebuffer'
    })
    await writeFilePromisified(`dist/${this.name}`, content)

    spinner.stop()
    Log.write(Log.chalk.green(`created and saved jar file successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

  public cleanup = async () => {
    const start: Date = new Date()
    Log.write(Log.chalk.gray(`remove ${this.main}.js file from dist`))

    if (existsSync(`dist/${this.main}.js`)) {
      await unlinkPromisified(`dist/${this.main}.js`)
      Log.write(Log.chalk.green(`deleted ${this.main}.js file from dist successfully in ${(new Date().getTime() - start.getTime()) / 1000}s`))
    } else {
      Log.write(Log.chalk.gray(`${this.main}.js file doesn't exist in dist in ${(new Date().getTime() - start.getTime()) / 1000}s. Build will continue.`))
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
      Log.write(Log.chalk.red(`failed to deploy ${this.name} in ${(new Date().getTime() - start.getTime()) / 1000}s. destination is not set either through .npmbuildrc or flag`))
      throw new Error()
    }

    try {
      await copyFilePromisified(`dist/${this.name}`, path.join(destination, this.name))
      Log.write(Log.chalk.green(`successfully deployed ${this.name} to ${destination} in ${(new Date().getTime() - start.getTime()) / 1000}s`))
    } catch (exception) {
      Log.write(Log.chalk.red(`failed to deploy ${this.name} to ${destination} in ${(new Date().getTime() - start.getTime()) / 1000}s, ${exception.message}`))
      throw exception
    }
  }
}