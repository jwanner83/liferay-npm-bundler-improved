import JSZip from 'jszip'

interface JarHandler {
  /**
   * The name of the jar file
   */
  name: string

  /**
   * The actual jar file
   */
  jar: JSZip

  /**
   * Create and write the actual jar file to the disk
   */
  create: () => Promise<void>
}

export default JarHandler
