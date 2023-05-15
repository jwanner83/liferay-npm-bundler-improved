export interface PortletConfiguration {
  system?: PortletSystemConfiguration
  portletInstance?: PortletInstanceConfiguration
}

export interface PortletSystemConfiguration {
  name: string
}

export interface PortletInstanceConfiguration {
  name: string
  fields: PortletConfigurationField[]
}

export interface PortletConfigurationField {
  [key: string]: {
    type: 'float' | 'number' | 'string' | 'boolean'
    name: string
    description: string
    default: string | boolean
    required?: boolean
    options?: PortletConfigurationFieldOption[]
  }
}

export interface PortletConfigurationFieldOption {
  [key: string]: string
}

export interface ProcessedPortletConfiguration {
  availableLanguageIds: []
  fields: ProcessedPortletConfigurationField[]
}

export interface ProcessedPortletConfigurationField {
  name: string
  label: {
    "": string
  }
  dataType: 'double' | 'integer' | 'string' | 'boolean'
  type: 'numeric' | 'text' | 'checkbox' | 'select'
  tip: {
    "": string
  }
  predefinedValue: {
    "": string | boolean
  }
  required?: boolean
  options?: ProcessedPortletConfigurationFieldOption[]
}

export interface ProcessedPortletConfigurationFieldOption {
  value: string
  label: {
    "": string
  }
}
