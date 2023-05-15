import { promisify } from 'util'
import { access, readFile } from 'fs'
import {
  PortletConfiguration,
  ProcessedPortletConfiguration,
  ProcessedPortletConfigurationField
} from '../types/Configuration.types'
import FaultyConfigurationException from '../exceptions/FaultyConfigurationException'
import { log } from '../log'

export default class ConfigurationHandler {
  public configuration: PortletConfiguration = {}
  public readonly processed: ProcessedPortletConfiguration = {
    availableLanguageIds: [],
    fields: []
  }

  private languageFiles: Map<string, string> = new Map()

  async resolve(configurationPath: string, languageFiles: Map<string, string>): Promise<void> {
    this.languageFiles = languageFiles

    try {
      await promisify(access)(configurationPath)
    } catch {
      throw new FaultyConfigurationException(`the configuration file does not exist in configured path "${configurationPath}" although the configuration feature is enabled. remove the configuration feature from the .npmbundlerrc file or create the configuration file.`)
    }

    const file = await promisify(readFile)(configurationPath)
    if (!file.toString()) {
      throw new FaultyConfigurationException(`the configuration file in configured path "${configurationPath}" is empty. add the base structure of the configuration file or remove the configuration feature from the .npmbundlerrc file.`)
    }

    try {
      this.configuration = JSON.parse(file.toString()) as PortletConfiguration
    } catch (e) {
      throw new FaultyConfigurationException(`the configuration file in configured path "${configurationPath}" is not a valid JSON file. fix the configuration file or remove the configuration feature from the .npmbundlerrc file.`)
    }

    if (this.configuration.system?.name) {
      log.warn(`the configuration file in configured path "${configurationPath}" contains a system configuration. the system configuration is currently not supported and will be ignored. if you need this feature, add a thumbs up to this ticket: https://github.com/jwanner83/liferay-npm-bundler-improved/issues/55`)
    }

    for (const file of languageFiles.keys()) {
      const locale = this.getLocale(file)
      if (locale) {
        this.processed.availableLanguageIds.push(locale)
      }
    }
  }

  async process(languageFiles: Map<string, string>): Promise<void> {
    for (const [name, value] of Object.entries(this.configuration.portletInstance.fields)) {
      const type = this.getType(value.type, value.options !== undefined)
      if (!type) {
        throw new FaultyConfigurationException(`the portlet instance configuration "${name}" contains an unknown data type "${value.type}". the allowed types are 'float' | 'number' | 'string' | 'boolean'`)
      }
      // data type will never be undefined because of the check above
      const dataType = this.getDataType(value.type)

      const field: ProcessedPortletConfigurationField = {
        name,
        label: this.getTranslation(value.name, languageFiles),
        dataType,
        type,
        tip: this.getTranslation(value.description || '', languageFiles)
      }

      if (value.default) {
        if (type === 'select') {
          field.predefinedValue = {
            "": `["${value.default as string}"]`
          }
        } else {
          if (typeof value.default === 'boolean') {
            field.predefinedValue = {
              "": value.default
            }
          } else {
            field.predefinedValue = this.getTranslation(value.default, languageFiles)
          }
        }
      }

      if (value.required) {
        field.required = value.required
      }

      if (value.options) {
        field.options = []

        for (const [key, option] of Object.entries(value.options)) {
          field.options.push({
            value: key,
            label: this.getTranslation(option, languageFiles)
          })
        }
      }

      this.processed.fields.push(field)
    }
  }

  private getTranslation(value: string, languageFiles: Map<string, string>): Record<string, string> {
    const translations: Record<string, string> = {}

    if (languageFiles.size === 0) {
      translations[''] = value
      return translations
    }

    for (const [file, content] of languageFiles.entries()) {
      const locale = this.getLocale(file)

      // extract the translation from the file
      const regex = new RegExp(`^${value}=(.*)$`, 'gm')
      const match = regex.exec(content)
      if (match) {
        translations[locale] = match[1]
      } else if (locale === '') {
        translations[locale] = value
      }
    }

    return translations
  }

  private getLocale(value: string): string {
    if (value.includes('_')) {
      return value.split('_')[1].split('.')[0]
    }

    return ''
  }

  private getType(type: 'float' | 'number' | 'string' | 'boolean' | string, hasOptions?: boolean): 'numeric' | 'text' | 'checkbox' | 'select' | undefined {
    switch (type) {
      case 'float':
      case 'number':
        return 'numeric'
      case 'string':
        if (hasOptions) {
          return 'select'
        } else {
          return 'text'
        }
      case 'boolean':
        return 'checkbox'
    }

    return undefined
  }

  private getDataType(type: 'float' | 'number' | 'string' | 'boolean' | string): 'double' | 'integer' | 'string' | 'boolean' {
    switch (type) {
      case 'float':
        return 'double'
      case 'number':
        return 'integer'
      case 'string':
        return 'string'
      case 'boolean':
        return 'boolean'
    }

    return undefined
  }
}
