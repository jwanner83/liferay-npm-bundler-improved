import { readFile } from 'fs'
import { sep } from 'path'
import { promisify } from 'util'
import npmbundlerrc from '../../types/npmbundlerrc.types'
import Pack from '../../types/Pack.types'

export default class FeaturesHandler {
  public npmbundlerrc: npmbundlerrc

  public localizationPath = `features${sep}localization`
  public hasLocalization = false

  public configurationPath = `features${sep}configuration.json`
  public hasConfiguration = false

  async resolve(): Promise<void> {
    try {
      const file = await promisify(readFile)(`.${sep}.npmbundlerrc`)
      this.npmbundlerrc = await JSON.parse(file.toString())
    } catch {
      // npmbundlerrc could not be found. is not required
    }
  }

  determine(pack: Pack): void {
    if (this.npmbundlerrc) {
      this.determineLocalization(pack)
      this.determineConfiguration()
    }
  }

  determineLocalization (pack: Pack): void {
    if (pack.portlet['javax.portlet.resource-bundle']) {
      this.hasLocalization = true

      const path = this.npmbundlerrc?.['create-jar']?.features?.localization

      if (path) {
        const processed = path.replace(/\//g, sep)
        const split = processed.split(sep)
        split.pop()
        this.localizationPath = split.join(sep)
      }
    }
  }

  determineConfiguration (): void {
    const path = this.npmbundlerrc?.['create-jar']?.features?.configuration

    if (path) {
      this.hasConfiguration = true
      const processed = path.replace(/\//g, sep)
      const split = processed.split(sep)
      split.pop()
      this.configurationPath = split.join(sep)
    }
  }
}
