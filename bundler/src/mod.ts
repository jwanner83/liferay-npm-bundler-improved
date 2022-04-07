import { name, version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'
import { log } from './log'

void (async () => {
  const process = new ProcessHandler()

  console.log(`${name} - ${version}`)

  try {
    await process.prepare()
    await process.process()
    await process.create()

    log.success('bundler done')
  } catch (exception) {
    log.error(`bundler failed: ${exception as string}`)
  }

  log.close()
})()
