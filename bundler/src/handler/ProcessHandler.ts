import JarHandler from './JarHandler'
import PackageHandler from './PackageHandler'
import TemplateHandler from './TemplateHandler'
import { version } from '../../package.json'

import { sep } from 'path'
import { access, mkdir, readFile, copyFile } from 'fs/promises'
import FeaturesHandler from './FeaturesHandler'

export default class ProcessHandler {
  private entryPoint: string
  private entryPath: string

  private readonly packageHandler: PackageHandler
  private readonly jarHandler: JarHandler
  private readonly featuresHandler: FeaturesHandler

  constructor() {
    this.packageHandler = new PackageHandler()
    this.jarHandler = new JarHandler()
    this.featuresHandler = new FeaturesHandler()
  }

  async prepare(): Promise<void> {
    // validate package.json
    await this.packageHandler.resolve()
    this.packageHandler.validate()

    // set variables
    this.jarHandler.setName(this.packageHandler.pack)
    this.entryPoint = this.packageHandler.pack.main
    this.entryPath = `build${sep}${this.entryPoint}.js`

    // determine features
    this.featuresHandler.determine(this.packageHandler.pack)

    // validate if entry file exists
    try {
      await access(this.entryPath)
    } catch {
      // copy sources if entry file doesn't exist
      console.info(`entry file doesn't exist in "${this.entryPath}". sources will be copied.`)
      const sourcePath = `src${sep}${this.entryPoint}.js`

      try {
        await access(sourcePath)
        await mkdir('./build')
        await copyFile(sourcePath, this.entryPath)
        console.info(`sources from "${sourcePath}" where successfully copied.`)
      } catch {
        console.error(`sources could not be copied from "${sourcePath}". build will fail`)
        throw new Error()
      }
    }

    // prepare working folders
    try {
      await mkdir('dist')
    } catch {
      // silent
    }

    // initialize jar handler
    this.jarHandler.initialize()
  }

  async process(): Promise<void> {
    // process wrapper.js
    const wrapperJsTemplate = new TemplateHandler('wrapper.js')
    await wrapperJsTemplate.resolve()
    wrapperJsTemplate.replace('name', this.packageHandler.pack.name)
    wrapperJsTemplate.replace('version', this.packageHandler.pack.version)
    wrapperJsTemplate.replace('main', this.entryPoint)
    wrapperJsTemplate.replace('bundle', (await readFile(this.entryPath)).toString())

    // process MANIFEST.MF
    const manifestMFTemplate = new TemplateHandler('MANIFEST.MF')
    await manifestMFTemplate.resolve()
    manifestMFTemplate.replace('name', this.packageHandler.pack.name)
    manifestMFTemplate.replace('description', this.packageHandler.pack.description)
    manifestMFTemplate.replace('version', this.packageHandler.pack.version)
    manifestMFTemplate.replace('tool-version', version)
    if (this.featuresHandler.hasLocalization) {
      manifestMFTemplate.replace('language-resource', ',liferay.resource.bundle;resource.bundle.base.name="content.Language"') // TODO: handle different if language properties exist
    }

    // process manifest.json
    const manifestJSONTemplate = new TemplateHandler('manifest.json')
    await manifestJSONTemplate.resolve()
    manifestJSONTemplate.replace('name', this.packageHandler.pack.name)
    manifestJSONTemplate.replace('version', this.packageHandler.pack.version)

    // process localization
    if (this.featuresHandler.hasLocalization) {
      // TODO: read directory with all language.property files in it and write them to /META-INF/content.
      this.jarHandler.archive.append('', { name: `/META-INF/content/`})
    }

    // process jar file
    this.jarHandler.archive.append(manifestMFTemplate.processed, { name: `/META-INF/${manifestMFTemplate.name}` })
    this.jarHandler.archive.append(manifestJSONTemplate.processed, { name: `/META-INF/resources/${manifestJSONTemplate.name}` })
    this.jarHandler.archive.append(wrapperJsTemplate.processed, { name: `/META-INF/resources/${this.entryPoint}.js` })
    this.jarHandler.archive.append(JSON.stringify(this.packageHandler.pack), { name: `/META-INF/resources/package.json` })
  }

  async create(): Promise<void> {
    // create jar file
    await this.jarHandler.create()
  }
}
