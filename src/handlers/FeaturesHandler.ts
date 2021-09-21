import { existsSync, readFile, readdir } from 'fs'
import Log from '../classes/Log'
import { promisify } from 'util'
import * as path from 'path'
import WarningHandler from './WarningHandler'

const readFilePromisified = promisify(readFile)
const readDirPromisified = promisify(readdir)

/**
 * Detect and handle the portlet features
 */
export default class FeaturesHandler {
  /**
     * The npmbundlerrc file content
     */
  public npmbundlerrc: unknown = {}

  /**
     * Boolean if localization is present
     * @private
     */
  public hasLocalization: boolean = false

  /**
     * The path to the localization files
     * @private
     */
  private localizationPath: string = ''

  /**
     * Detect the features of the portlet
     */
  public async detectFeatures (): Promise<void> {
    try {
      await this.getConfigurationFile()
    } catch (exception) {
      Log.error(undefined, exception.message)
      return
    }

    if (this.npmbundlerrc && this.npmbundlerrc['create-jar'] && this.npmbundlerrc['create-jar'].features) {
      await this.detectLocalization()
    } else {
      Log.debug('no feature has been detected')
    }
  }

  /**
     * Get the configuration file (.npmbundlerrc)
     * @private
     */
  private async getConfigurationFile (): Promise<void> {
    if (existsSync('.npmbundlerrc')) {
      const data = await readFilePromisified('.npmbundlerrc')
      this.npmbundlerrc = JSON.parse(data.toString())
    }
  }

  /**
     * Detect the localization feature
     * @private
     */
  private async detectLocalization (): Promise<void> {
    const localization = this.npmbundlerrc['create-jar'].features.localization

    if (localization) {
      const localizationPathSplitted: string[] = localization.split('/')
      localizationPathSplitted.pop()
      const localizationPath = localizationPathSplitted.join('/')

      Log.debug(`localization feature detected: files are at ${localizationPath}`)

      this.hasLocalization = true
      this.localizationPath = localizationPath
    }
  }

  /**
     * Get the localizations as map with name
     */
  public async getLocalizations (): Promise<Map<string, string>> {
    const localizations: Map<string, string> = new Map()
    const files: string[] = await readDirPromisified(this.localizationPath)

    for (const file of files) {
      if (file.startsWith('Language') && file.endsWith('.properties')) {
        const data = await readFilePromisified(path.join(this.localizationPath, file))
        localizations.set(file, data.toString())
      }
    }

    if (localizations.size === 0) {
      WarningHandler.warn('there is no language property file at the configured folder')
      this.hasLocalization = false
    }

    return localizations
  }
}
