import { promisify } from 'util'
import { writeFile } from 'fs'

const writeFilePromisified = promisify(writeFile)

export async function saveAsZip (path, zip) {
  const content = await zip.generateAsync({
    type: 'nodebuffer'
  })

  await save(path, content)
}

export async function save (path, content) {
  await writeFilePromisified(path, content)
}