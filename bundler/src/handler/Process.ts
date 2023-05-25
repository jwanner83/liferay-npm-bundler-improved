import { Store } from '../stores/Store'
import Flags from './Flags'
import File from './File'
import npmbundlerrc from '../types/npmbundlerrc.types'
import pack from '../types/pack.types'
import LocalizationFeature from './features/LocalizationFeature'

export default class Process {
  public async initialize (): Promise<void> {
    Store.flags = new Flags()

    Store.files.pack = await File.getFile<pack>('./package.json', true)
    Store.files.pack.validate(['name', 'version', 'main'])
    Store.files.npmbundlerrc = await File.getFile<npmbundlerrc>('./.npmbundlerrc', false)

    Store.features.localization = new LocalizationFeature()
  }
}
