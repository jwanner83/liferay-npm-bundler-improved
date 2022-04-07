import { readFile } from 'fs/promises'
import { sep } from 'path'
import npmbundlerrc from '../types/npmbundlerrc.types'
import Pack from '../types/Pack.types'

export default class FeaturesHandler {
  public npmbundlerrc: npmbundlerrc
  public localizationPath = `features${sep}localization`
  public hasLocalization = false

  async resolve(): Promise<void> {
    try {
      const file = await readFile('./.npmbundlerrc')
      this.npmbundlerrc = await JSON.parse(file.toString())
    } catch {
      // npmbundlerrc could not be found. is not required
    }
  }

  determine(pack: Pack): void {
    if (pack.portlet['javax.portlet.resource-bundle']) {
      this.hasLocalization = true

      if (this.npmbundlerrc) {
        const path = this.npmbundlerrc?.['create-jar']?.features?.localization

        if (path) {
          const split = path.split('/')
          split.pop()
          this.localizationPath = split.join('/')
        }
      }
    }
  }
}
