import Feature from './Feature'
import { Store } from '../../Store'
import File from '../File'
import {
  PortletConfiguration,
  ProcessedPortletConfiguration, ProcessedPortletConfigurationField
} from '../../types/Configuration.types'
import { log } from '../../log'
import FaultyConfigurationException from '../../exceptions/FaultyConfigurationException'

export default class ConfigurationFeature implements Feature {
  public active: boolean = false
  public path: string
  public configuration: PortletConfiguration
  public readonly processed: ProcessedPortletConfiguration = {
    availableLanguageIds: [],
    fields: []
  }

  constructor() {
    const configuration = Store.files.npmbundlerrc?.['create-jar']?.features?.configuration
    if (configuration) {
      this.active = true
      this.path = File.getCleanPath(configuration)
    }
  }

  async resolve(): Promise<void> {
    const configuration = await File.getFile<PortletConfiguration>(this.path, true, true)

    if (configuration.content.system?.name) {
      log.warn(`the configuration file in configured path "${this.path}" contains a system configuration. the system configuration is currently not supported and will be ignored. if you need this feature, add a thumbs up to this ticket: https://github.com/jwanner83/liferay-npm-bundler-improved/issues/55`)
    }

    if (!configuration.content.portletInstance?.fields) {
      log.warn(`the configuration file in configured path "${this.path}" does not contain a portlet instance configuration. the configuration feature will be ignored.`)
    } else {
      for (const file of Store.features.localization.files.keys()) {
        const locale = this.getLocale(file)
        if (locale) {
          this.processed.availableLanguageIds.push(locale)
        }
      }

      await this.process()
    }
  }

  private async process(): Promise<void> {
    const languageFiles = Store.features.localization.files

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
