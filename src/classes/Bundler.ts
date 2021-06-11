const rollup = require('rollup').rollup
const loadConfigFile = require('rollup/dist/loadConfigFile')
const ora = require('ora')
const JSZip = require('jszip')
const path = require('path')

// the package json of the portlet
const pack = require(process.cwd() + '/package.json')

import { promisify } from 'util'
import { readFile, writeFile, copyFile } from 'fs'

const readFilePromisified = promisify(readFile)
const writeFilePromisified = promisify(writeFile)
const copyFilePromisified = promisify(copyFile)


import Configuration from './Configuration'
import Log from './Log'

export default class Bundler {
  private configuration: Configuration = new Configuration()

  private name: string = `${pack.name}-${pack.version}.jar`

  private wrapped: string = ''

  private manifestMF: string =
    `Manifest-Version: 1.0\n` +
    `Bundle-ManifestVersion: 2\n` +
    `Bundle-Name: ${pack.description}\n` +
    `Bundle-SymbolicName: ${pack.name}\n` +
    `Bundle-Version: ${pack.version}\n` +
    `Provide-Capability: osgi.webresource;osgi.webresource=${pack.name};version:Version="${pack.version}"\n` +
    `Require-Capability: osgi.extender;filter:="(&(osgi.extender=liferay.frontend.js.portlet)(version>=${pack.version}))"\n` +
    `Tool: liferay-npm-bundler-2.25.0\n` +
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
    const split = 'index.js'.split('.')
    split.pop()
    const filename = split.join('.')

    this.wrapped = `Liferay.Loader.define('${pack.name}@${pack.version}/${filename}', ['module', 'exports', 'require'], function (module, exports, require) { var define = undefined; var global = window; { ${bundled} }});`
  }

  public loadRollupConfiguration = async () => {
    const start: Date = new Date()
    Log.write(Log.chalk.gray('loading custom rollup configuration'))

    try {
      const { options } = await loadConfigFile(process.cwd() + '/rollup.config.js')

      if (options) {
        this.configuration.setConfigurationFromFile(options)
        Log.write(Log.chalk.green(`custom rollup configuration has been found and loaded in ${(new Date().getTime() - start.getTime()) / 1000}s.`))
      } else {
        Log.write(Log.chalk.gray(`no custom rollup configuration has been found in ${(new Date().getTime() - start.getTime()) / 1000}s. The default will be used.`))
      }
    } catch (exception) {
      Log.write(Log.chalk.gray(`configuration file isn't readable in ${(new Date().getTime() - start.getTime()) / 1000}s. The default will be used.`))
    }
  }

  public bundle = async () => {
    let start: Date = new Date()
    const spinner = ora({
      text: Log.chalk.gray('bundle with rollup in progress\n'),
      color: 'gray'
    }).start()

    // bundle the code into one file
    const bundle = await rollup(this.configuration.inputConfiguration)

    spinner.stop()
    Log.write(Log.chalk.green(`bundle with rollup successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))

    start = new Date()
    spinner.start(Log.chalk.gray('writing to bundle to file\n'))

    // write the bundled code to a file
    await bundle.write(this.configuration.outputConfiguration)

    spinner.stop()
    Log.write(Log.chalk.green(`writing bundle to file successful in ${(new Date().getTime() - start.getTime()) / 1000}s`))
  }

  public wrap = async () => {
    const start: Date = new Date()

    const bundled = await readFilePromisified('dist/index.js')
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