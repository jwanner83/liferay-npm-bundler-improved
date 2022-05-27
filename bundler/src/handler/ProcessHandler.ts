import { access, copyFile, mkdir, readdir, readFile, rm, stat } from 'fs'
import { resolve, sep } from 'path'
import { promisify } from 'util'
import { version } from '../../package.json'
import CopyAssetsException from '../exceptions/CopyAssetsException'
import CopySourcesException from '../exceptions/CopySourcesException'
import MissingEntryFileException from '../exceptions/MissingEntryFileException'
import { log } from '../log'
import FeaturesHandler from './FeaturesHandler'
import JarHandler from './JarHandler'
import PackageHandler from './PackageHandler'
import SettingsHandler from './SettingsHandler'
import TemplateHandler from './TemplateHandler'

export default class ProcessHandler {
  private entryPoint: string
  private entryPath: string

  private readonly settingsHandler: SettingsHandler
  private readonly packageHandler: PackageHandler
  private readonly jarHandler: JarHandler
  private readonly featuresHandler: FeaturesHandler

  constructor(settingsHandler: SettingsHandler) {
    this.settingsHandler = settingsHandler
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

    // resolve settings according to the .npmbundlerrc
    this.settingsHandler.resolve(this.featuresHandler.npmbundlerrc)

    // set variables
    this.jarHandler.setName(this.packageHandler.pack)
    this.entryPoint = this.packageHandler.pack.main
    this.entryPath = `build${sep}${this.entryPoint}.js`

    // determine features
    this.featuresHandler.determine(this.packageHandler.pack)

    if (this.settingsHandler.copySources) {
      // copy sources if entry file doesn't exist
      log.progress(`copy sources`)
      const sourcePath = `src${sep}${this.entryPoint}.js`

      try {
        await promisify(mkdir)(`.${sep}build`)
      } catch {
        // silent
      }

      try {
        await promisify(access)(sourcePath)
        await promisify(copyFile)(sourcePath, this.entryPath)
        log.progress(`sources from "${sourcePath}" where successfully copied.`)
      } catch {
        throw new CopySourcesException(`sources could not be copied from "${sourcePath}"`)
      }
    } else {
      // validate if entry file exists
      try {
        await promisify(access)(this.entryPath)
      } catch {
        // copy sources if entry file doesn't exist
        throw new MissingEntryFileException(
          `entry file doesn't exist in "${this.entryPath}". if there is no build step and you need the source entry file, you may want to enable the copy sources option: '--copy-sources'`
        )
      }
    }

    if (this.settingsHandler.createJar) {
      // initialize jar handler
      await this.jarHandler.initialize(this.featuresHandler.npmbundlerrc)
    }
  }

  async process(): Promise<void> {
    log.progress('processing jar file')

    // process wrapper.js
    const wrapperJsTemplate = new TemplateHandler('wrapper.js')
    await wrapperJsTemplate.resolve()
    wrapperJsTemplate.replace('name', this.packageHandler.pack.name)
    wrapperJsTemplate.replace('version', this.packageHandler.pack.version)
    wrapperJsTemplate.replace('main', this.entryPoint)
    wrapperJsTemplate.replace('bundle', (await promisify(readFile)(this.entryPath)).toString())
    await wrapperJsTemplate.seal(this.settingsHandler, this.entryPath)

    if (!this.settingsHandler.createJar) {
      return
    }

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
      )
    } else {
      manifestMFTemplate.replace('language-resource', '')
    }

    // process manifest.json
    const manifestJSONTemplate = new TemplateHandler('manifest.json')
    await manifestJSONTemplate.resolve()
    manifestJSONTemplate.replace('name', this.packageHandler.pack.name)
    manifestJSONTemplate.replace('version', this.packageHandler.pack.version)

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

    // process localization
    if (this.featuresHandler.hasLocalization) {
      const files = await promisify(readdir)(this.featuresHandler.localizationPath)
      for (const file of files) {
        this.jarHandler.archive.append(
          (
            await promisify(readFile)(`${this.featuresHandler.localizationPath}${sep}${file}`)
          ).toString(),
          { name: `/content/${file}` }
        )
      }
    }

    // process copy sources
    if (this.settingsHandler.copyAssets) {
      // validate if assets folder exists
      try {
        await promisify(access)(`.${sep}assets`)
      } catch {
        // copy sources if entry file doesn't exist
        throw new CopyAssetsException(
          `no assets folder exists. remove the '--copy-assets' flag to prevent this error.`
        )
      }

      const files = await this.getFiles(`.${sep}assets`)

      for (const file of files) {
        const relative = file.split('assets').pop()

        this.jarHandler.archive.append(await promisify(readFile)(file), {
          name: `/META-INF/resources/${relative}`
        })
      }
    }
  }

  async getFiles(directory): Promise<string[]> {
    const subs = await promisify(readdir)(directory)
    const files = await Promise.all(
      subs.map(async (sub) => {
        const res = resolve(directory, sub)
        return (await promisify(stat)(res)).isDirectory() ? await this.getFiles(res) : res
      })
    )
    return Array.from(files.reduce((a, f) => a.concat(f as string), []))
  }

  async create(): Promise<void> {
    // create jar file
    log.progress('create jar')
    await this.jarHandler.create()
    log.progress('jar file created')
  }
}
