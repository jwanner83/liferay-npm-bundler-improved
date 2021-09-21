import JSZip from 'jszip/dist/jszip'
import { promisify } from 'util'
import { writeFile } from 'fs'

const writeFilePromisified = promisify(writeFile)

/**
 * The jar file handler which contains the jar and is able to create it
 */
export default class JarHandler {
  /**
     * The jar container
     */
  public jar = new JSZip()

  /**
     * The name of the jar file
     */
  public name: string

  /**
     * Create the jar file and write it to the disc
     */
  public async createJarFile () {
    const content = await this.jar.generateAsync({
      type: 'nodebuffer'
    })
    await writeFilePromisified(`dist/${this.name}`, content)
  }
}
