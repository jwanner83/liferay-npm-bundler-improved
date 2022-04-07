import { access, copyFile, mkdir, readdir, readFile, rm } from 'fs/promises'
import { sep } from 'path'
import { version } from '../../package.json'
import { log } from '../log'
import FeaturesHandler from './FeaturesHandler'
import JarHandler from './JarHandler'
import PackageHandler from './PackageHandler'
import TemplateHandler from './TemplateHandler'

export default class ProcessHandler {
  private entryPoint: string
  private entryPath: string

  private cleanup: boolean = false

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

    // resolve npmbundlerrc
    await this.featuresHandler.resolve()

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
      log.progress(`entry file doesn't exist in "${this.entryPath}". sources will be copied.`)
      const sourcePath = `src${sep}${this.entryPoint}.js`

      try {
        log.progress('')
        await access(sourcePath)
        await mkdir('./build')
        await copyFile(sourcePath, this.entryPath)

        this.cleanup = true
        log.progress(`sources from "${sourcePath}" where successfully copied.`)
      } catch {
        log.error(`sources could not be copied from "${sourcePath}". build will fail`)
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
    log.progress('processing jar file')

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
      manifestMFTemplate.replace(
        'language-resource',
        ',liferay.resource.bundle;resource.bundle.base.name="content.Language"'
      ) // TODO: handle different if language properties exist
    }

    // process manifest.json
    const manifestJSONTemplate = new TemplateHandler('manifest.json')
    await manifestJSONTemplate.resolve()
    manifestJSONTemplate.replace('name', this.packageHandler.pack.name)
    manifestJSONTemplate.replace('version', this.packageHandler.pack.version)

    // process localization
    if (this.featuresHandler.hasLocalization) {
      const files = await readdir(this.featuresHandler.localizationPath)
      for (const file of files) {
        this.jarHandler.archive.append(
          (await readFile(`${this.featuresHandler.localizationPath}${sep}${file}`)).toString(),
          { name: `/content/${file}` }
        )
      }
    }

    // process jar file
    this.jarHandler.archive.append(manifestMFTemplate.processed, {
      name: `/META-INF/${manifestMFTemplate.name}`
    })
    this.jarHandler.archive.append(manifestJSONTemplate.processed, {
      name: `/META-INF/resources/${manifestJSONTemplate.name}`
    })
    this.jarHandler.archive.append(wrapperJsTemplate.processed, {
      name: `/META-INF/resources/${this.entryPoint}.js`
    })
    this.jarHandler.archive.append(JSON.stringify(this.packageHandler.pack), {
      name: `/META-INF/resources/package.json`
    })
  }

  async create(): Promise<void> {
    // create jar file
    log.progress('create jar')
    await this.jarHandler.create()
    log.progress('jar file created')

    // cleanup
    if (this.cleanup) {
      log.progress('cleaning build folder')
      await rm('build', { recursive: true, force: true })
      log.progress('cleaned build folder')
    }
  }
}
