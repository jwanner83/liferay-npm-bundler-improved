import arg from 'arg'
import npmbundlerrc from '../types/npmbundlerrc.types'

export default class SettingsHandler {
  public createJar = false
  public copyAssets = false
  public copySources = false

  constructor () {
    const args = arg({
      '--copy-sources': Boolean,
      '-cs': '--copy-sources',
      '--copy-assets': Boolean,
      '-ca': '--copy-assets'
    });

    if (args['--copy-sources']) {
      this.copySources = true
    }
    if (args['--copy-assets']) {
      this.copyAssets = true
    }
  }

  public resolve (npmbundlerrc: npmbundlerrc): void {
    if (npmbundlerrc['create-jar']) {
      this.createJar = true
    }
  }
}
