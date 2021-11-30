import JSZip from 'jszip'
import { writeFile } from 'fs/promises'
import Pack from '../types/Pack.types'

export default class JarHandler {
  public name: string
  public jar: JSZip

  constructor() {
    this.jar = new JSZip()
  }

  setName(pack: Pack): void {
    this.name = `${pack.name}-${pack.version}.jar`
  }

  async create(): Promise<void> {
    const content = await this.jar.generateAsync({
      type: 'nodebuffer'
    })
    await writeFile(`dist/${this.name}`, content)
  }
}
