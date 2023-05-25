import Flags from '../handler/Flags'
import npmbundlerrc from '../types/npmbundlerrc.types'
import pack from '../types/pack.types'
import File from '../handler/File'
import LocalizationFeature from '../handler/features/LocalizationFeature'

interface StoreType {
  flags?: Flags
  features: {
    localization?: LocalizationFeature
  }
  files: {
    npmbundlerrc?: File<npmbundlerrc>
    pack?: File<pack>
  }
}

export const Store: StoreType = {
  files: {},
  features: {}
}
