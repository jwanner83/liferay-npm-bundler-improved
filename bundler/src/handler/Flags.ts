import arg from 'arg'

export default class Flags {
  public readonly WATCH: boolean
  public readonly DEPLOY: boolean
  public readonly COPY_ASSSETS: boolean
  public readonly COPY_SOURCES: boolean

  constructor() {
    const args = arg({
      '--watch': Boolean,
      '-w': '--watch',
      '--deploy': Boolean,
      '-d': '--deploy',
      '--copy-sources': Boolean,
      '-cs': '--copy-sources',
      '--copy-assets': Boolean,
      '-ca': '--copy-assets'
    })

    this.WATCH = args['--watch']
    this.DEPLOY = args['--deploy']
    this.COPY_ASSSETS = args['--copy-assets']
    this.COPY_SOURCES = args['--copy-sources']
  }
}
