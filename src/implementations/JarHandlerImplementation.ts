import JarHandler from '../interfaces/JarHandler'
import JSZip from 'jszip'
import { promises as fs } from 'fs'

export default class JarHandlerImplementation implements JarHandler {
  public name: string
  public jar = new JSZip()

  public async create(): Promise<void> {
    const content = await this.jar.generateAsync({
      type: 'nodebuffer'
    })
    await fs.writeFile(`dist/${this.name}`, content)
  }
}
