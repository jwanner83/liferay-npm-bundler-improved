import arg from 'arg'
import npmbundlerrc from '../types/npmbundlerrc.types'

export default class SettingsHandler {
  public watch = false
  public port = 3002
  public deployment = false
  public deploymentPath: string = undefined
  public createJar = false
  public copyAssets = false
  public copySources = false

  constructor() {
    const args = arg({
      '--watch': Boolean,
      '-w': '--watch',
      '--port': Number,
      '-p': '--port',
      '--deploy': Boolean,
      '-d': '--deploy',
      '--copy-sources': Boolean,
      '-cs': '--copy-sources',
      '--copy-assets': Boolean,
      '-ca': '--copy-assets'
    })

    if (args['--watch']) {
      this.watch = true
    }

    if (args['--port']) {
      this.port = args['--port']
    }

    if (args['--copy-sources']) {
      this.copySources = true
    }

    if (args['--copy-assets']) {
      this.copyAssets = true
    }

    if (args['--deploy']) {
      this.deployment = true
    }

    if (this.deployment && process.env.LIFERAY_DEPLOYMENT_PATH) {
      this.deploymentPath = process.env.LIFERAY_DEPLOYMENT_PATH
    }
  }

  public resolve(npmbundlerrc: npmbundlerrc): void {
    if (npmbundlerrc?.['create-jar']) {
      this.createJar = true
    }
  }
}
