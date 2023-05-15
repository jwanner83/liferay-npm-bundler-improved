import { access, copyFile, readdir, readFile } from 'fs'
import { join, sep } from 'path'
import { promisify } from 'util'
import { version } from '../../package.json'
import CopySourcesException from '../exceptions/CopySourcesException'
import MissingEntryFileException from '../exceptions/MissingEntryFileException'
import { log } from '../log'
import FeaturesHandler from './FeaturesHandler'
import { FileHandler } from './FileHandler'
import JarHandler from './JarHandler'
import PackageHandler from './PackageHandler'
import SettingsHandler from './SettingsHandler'
import TemplateHandler from './TemplateHandler'
import ConfigurationHandler from './ConfigurationHandler'

export default class ProcessHandler {
  private entryPoint: string
  private entryPath: string

  private readonly languageFiles: Map<string, string> = new Map()

  private readonly settingsHandler: SettingsHandler
  private readonly packageHandler: PackageHandler
  private readonly jarHandler: JarHandler
  private readonly featuresHandler: FeaturesHandler
  private readonly configurationHandler: ConfigurationHandler

  constructor(settingsHandler: SettingsHandler) {
    this.settingsHandler = settingsHandler
    this.packageHandler = new PackageHandler()
    this.jarHandler = new JarHandler()
    this.featuresHandler = new FeaturesHandler()
    this.configurationHandler = new ConfigurationHandler()
  }

  async prepare(): Promise<void> {
    log.progress(`preparations`)

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

    // copy sources
    if (this.settingsHandler.copySources) {
      log.progress(`copy sources`)

      const sourcePath = `src${sep}${this.entryPoint}.js`
      await FileHandler.createFolderStructure(`.${sep}build`)

      try {
        // validate if entry file exists in source
        await promisify(access)(sourcePath)
        await promisify(copyFile)(sourcePath, this.entryPath)
      } catch {
        throw new CopySourcesException(`sources could not be copied from '${sourcePath}'`)
      }
    } else {
      // validate if entry file exists
      try {
        await promisify(access)(this.entryPath)
      } catch {
        // copy sources as a fallback
        const sourcePath = `src${sep}${this.entryPoint}.js`
        await FileHandler.createFolderStructure(`.${sep}build`)

        try {
          // validate if entry file exists in source
          await promisify(access)(sourcePath)
          await promisify(copyFile)(sourcePath, this.entryPath)

          log.warn(
            `the entry file couldn't be found at the '${this.entryPath}'. to prevent a failing build, the sources where copied automatically (this is what the '--copy-sources' flag would do) from '${sourcePath}'. make sure to either place a file in the correct directory through a build step or add the '--copy-sources' flag to your bundler call.`
          )
        } catch {
          throw new MissingEntryFileException(
            `entry file doesn't exist either in '${this.entryPath}' or '${sourcePath}'.`
          )
        }
      }
    }

    if (this.settingsHandler.createJar) {
      // initialize jar handler
      await this.jarHandler.initialize(this.featuresHandler.npmbundlerrc)
    }
  }

  async process(): Promise<void> {
    log.progress('processing')

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
        const content = (
          await promisify(readFile)(`${this.featuresHandler.localizationPath}${sep}${file}`)
        ).toString()
        this.languageFiles.set(file, content)
        this.jarHandler.archive.append(content, { name: `/content/${file}` })
      }
    }

    // process header css
    if (this.featuresHandler.hasHeaderCSS) {
      const buildPath = join('build', this.featuresHandler.headerCSSPath)
      const srcPath = join('src', this.featuresHandler.headerCSSPath)

      let path: string

      try {
        await promisify(access)(buildPath)
        path = buildPath
      } catch {
        try {
          await promisify(access)(srcPath)
          path = srcPath
        } catch {
          log.warn(
            `the 'com.liferay.portlet.header-portlet-css' property is set but the according css file can't either be found in '${srcPath}' or in '${buildPath}'. please make sure, the css file is present in one of the directories or remove the property.`
          )
        }
      }

      if (path) {
        let filename = this.featuresHandler.headerCSSPath.replace(sep, '/')
        if (filename.startsWith('/')) {
          filename = filename.substring(1)
        }

        this.jarHandler.archive.append(await promisify(readFile)(path), {
          name: `/META-INF/resources/${filename}`
        })
      }
    }

    // process configuration
    if (this.featuresHandler.hasConfiguration) {
      log.warn('the configuration feature is experimental and might not work as expected')
      await this.configurationHandler.resolve(this.featuresHandler.configurationPath, this.languageFiles)

      if (this.configurationHandler.configuration.portletInstance?.fields !== undefined) {
        await this.configurationHandler.process(this.languageFiles)
        this.jarHandler.archive.append(JSON.stringify(this.configurationHandler.processed, null, 2), {
          name: `/features/portlet_preferences.json`
        })
      }
    }

    // copy assets
    if (this.settingsHandler.copyAssets) {
      log.progress('copy assets')

      try {
        // validate if assets folder exists
        await promisify(access)(`.${sep}assets`)
        const files = await FileHandler.getFiles(`.${sep}assets`)

        for (const file of files) {
          const relative = file.split('assets').pop()

          this.jarHandler.archive.append(await promisify(readFile)(file), {
            name: `/META-INF/resources/${relative}`
          })
        }
      } catch {
        log.warn(
          `no 'assets' folder exists. remove the '--copy-assets' flag or add an 'assets' folder to prevent this warning`
        )
      }
    }
  }

  async create(): Promise<void> {
    log.progress('create jar')
    await this.jarHandler.create()
  }
}
