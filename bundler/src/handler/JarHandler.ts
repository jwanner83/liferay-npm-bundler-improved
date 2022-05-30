import archiver, { Archiver } from 'archiver'
import { createWriteStream, WriteStream } from 'fs'
import { sep } from 'path'
import npmbundlerrc from '../types/npmbundlerrc.types'
import Pack from '../types/Pack.types'
import { FileHandler } from './FileHandler'

export default class JarHandler {
  public name: string
  public archive: Archiver
  public output: WriteStream

  constructor() {
    this.archive = archiver('zip')
  }

  async initialize(npmbundlerrc: npmbundlerrc): Promise<void> {
    let outputDir = 'dist'
    const dir = npmbundlerrc?.['create-jar']?.['output-dir']
    if (dir) {
      outputDir = dir
    }

    await FileHandler.createFolderStructure(`.${sep}${outputDir}`)

    this.output = createWriteStream(`${outputDir}${sep}${this.name}.jar`)

    this.archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.log('warning', err)
      } else {
        throw err
      }
    })

    this.archive.on('error', function (err) {
      throw err
    })

    this.archive.pipe(this.output)
  }

  setName(pack: Pack): void {
    this.name = `${pack.name}-${pack.version}`
  }

  async create(): Promise<void> {
    await this.archive.finalize()
  }
}
