export interface PortletConfiguration {
  system?: PortletSystemConfiguration
  portletInstance?: PortletInstanceConfiguration
}

export interface PortletSystemConfiguration {
  name: string
}

export interface PortletInstanceConfiguration {
  name: string
  fields: Record<string, PortletConfigurationField>
}

export interface PortletConfigurationField {
  type: 'float' | 'number' | 'string' | 'boolean' | string
  name: string
  description: string
  default: string | boolean
  required?: boolean
  options?: Record<string, string>
}

export interface ProcessedPortletConfiguration {
  availableLanguageIds: string[]
  fields: ProcessedPortletConfigurationField[]
}

export interface ProcessedPortletConfigurationField {
  name: string
  label: Record<string, string>
  dataType: 'double' | 'integer' | 'string' | 'boolean'
  type: 'numeric' | 'text' | 'checkbox' | 'select'
  tip: Record<string, string>
  predefinedValue?: Record<string, string | boolean>
  required?: boolean
  options?: ProcessedPortletConfigurationFieldOption[]
}

export interface ProcessedPortletConfigurationFieldOption {
  value: string
  label: Record<string, string>
}
