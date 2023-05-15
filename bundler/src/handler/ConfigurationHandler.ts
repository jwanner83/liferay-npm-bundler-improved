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

  async resolve(configurationPath: string): Promise<void> {
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
      log.warn(`the configuration file in configured path "${configurationPath}" contains a system configuration. the system configuration is currently not supported and will be ignored.`)
    }
  }

  async process(): Promise<void> {
    for (const [name, value] of Object.entries(this.configuration.portletInstance.fields)) {
      const type = this.getType(value.type, value.options !== undefined)
      if (!type) {
        throw new FaultyConfigurationException(`the portlet instance configuration "${name}" contains an unknown data type "${value.type}". the allowed types are 'float' | 'number' | 'string' | 'boolean'`)
      }
      // data type will never be undefined because of the check above
      const dataType = this.getDataType(value.type)

      const field: ProcessedPortletConfigurationField = {
        name,
        label: {
          "": value.name
        },
        dataType,
        type,
        tip: {
          "": value.description || ''
        }
      }

      if (value.default) {
        if (type === 'select') {
          field.predefinedValue = {
            "": `["${value.default as string}"]`
          }
        } else {
          field.predefinedValue = {
            "": value.default
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
            label: {
              "": option
            }
          })
        }
      }

      this.processed.fields.push(field)
    }
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
