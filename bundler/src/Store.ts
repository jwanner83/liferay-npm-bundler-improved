import Flags from './handler/Flags'
import npmbundlerrc from './types/npmbundlerrc.types'
import pack from './types/pack.types'
import File from './handler/File'
import LocalizationFeature from './handler/features/LocalizationFeature'
import HeaderCSSFeature from './handler/features/HeaderCSSFeature'
import Archive from './handler/Archive'
import ConfigurationFeature from './handler/features/ConfigurationFeature'

interface StoreType {
  portlet?: {
    input?: {
      file?: File

      /**
       * Name without ending
       */
      name?: string

      /**
       * Filename with ending
       */
      filename?: string

      /**
       * The path of the input file without the name of the actual file
       * e.g. build
       */
      dir?: string

      /**
       * The path of the input file with the name of the actual file
       * e.g. build/index.js
       */
      path?: string
    }
    output?: {
      /**
       * Name without ending
       */
      name?: string

      /**
       * The path where the jar file will be placed without the name of the jar file
       * e.g. dist
       */
      dir?: string

      /**
       * The path where the jar file will be placed with the name of the jar file
       * e.g. dist/react-portlet-1.0.0.jar
       */
      path?: string
    }
  }
  archive?: Archive
  flags?: Flags
  features: {
    configuration?: ConfigurationFeature
    localization?: LocalizationFeature
    headerCSS?: HeaderCSSFeature
  }
  files: {
    npmbundlerrc?: File<npmbundlerrc>
    pack?: File<pack>
  }
}

export const Store: StoreType = {
  portlet: {
    output: {}
  },
  files: {},
  features: {}
}
