import Feature from './Feature'
import File from '../File'
import { Store } from '../../Store'
import { sep } from 'path'
import { promisify } from 'util'
import { readdir, readFile } from 'fs'

export default class LocalizationFeature implements Feature {
  public active: boolean = false
  public path: string
  public files: Map<string, string> = new Map()

  constructor() {
    if (Store.files.pack.content.portlet['javax.portlet.resource-bundle']) {
      const path = Store.files.npmbundlerrc?.content['create-jar']?.features?.localization

      if (path) {
        const cleanPath = File.getCleanPath(path)
        const split = cleanPath.split(sep)
        split.pop()
        this.path = split.join(sep)
        this.active = true
      }
    }
  }

  async resolve(): Promise<void> {
    const files = await promisify(readdir)(this.path)
    for (const file of files) {
      const content = (
        await promisify(readFile)(`${this.path}${sep}${file}`)
      ).toString()
      this.files.set(file, content)
    }
  }
}
