import { Store } from '../Store'
import archiver, { Archiver, ArchiverError } from 'archiver'
import { createWriteStream, mkdir, WriteStream } from 'fs'
import { sep } from 'path'
import { log } from '../log'
import { promisify } from 'util'

export default class Archive {
  public file: Archiver
  private output: WriteStream


  constructor() {
    this.file = archiver('zip')

    Store.portlet.output.name = this.getOutputName()
    Store.portlet.output.dir = this.getOutputDirectory()
    Store.portlet.output.path = this.getOutputPath()
  }

  async initialize (): Promise<void> {
    const path = Store.portlet.output.path

    try {
      await promisify(mkdir)(path, { recursive: true })
    } catch {
      // silent
    }
    this.output = createWriteStream(path)

    this.file.on('warning', this.onWarning)
    this.file.on('error', this.onError)
    this.file.pipe(this.output)
  }

  async create (): Promise<void> {
    await this.file.finalize()
  }

  private onWarning (error: ArchiverError): void {
    if (error.code === 'ENOENT') {
      log.warn(error.message)
    } else {
      throw error
    }
  }

  private onError (error: ArchiverError): void {
    throw error
  }

  private getOutputName (): string {
    const pack = Store.files.pack.content
    return `${pack.name}-${pack.version}`
  }

  private getOutputDirectory (): string {
    let cleanPath = 'dist/'

    const path = Store.files.npmbundlerrc?.content['create-jar']?.['output-dir']
    if (path) {
      cleanPath = path.replace('/', sep)

      if (cleanPath.endsWith(sep)) {
        cleanPath.slice(0, -1)
      }
    }

    return cleanPath
  }

  private getOutputPath (): string {
    return `${this.getOutputDirectory()}${sep}${Store.portlet.output.name}.jar`
  }
}
