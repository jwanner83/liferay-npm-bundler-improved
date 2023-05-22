import 'regenerator-runtime/runtime'
import { build } from 'vite'
import { name,version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'
import SettingsHandler from './handler/SettingsHandler'
import WebSocketServer from 'ws'
import { log } from './log'
import { promisify } from 'util'
import { readFile } from 'fs'
import { sep } from 'path'

void (async () => {
  console.log(`${name} - ${version}`)

  try {
    const settings = new SettingsHandler()
    const process = new ProcessHandler(settings)

    await process.prepare()
    await process.process()

    if (settings.createJar) {
      await process.create()
    }

    if (settings.watch) {
      await process.serve()
    }

    log.success('bundler done')
    log.close()

    if (log.hasWarnings()) {
      log.printWarnings()
    }
  } catch (exception) {
    const kebab: string = exception
      .toString()
      .replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1')
      .toLowerCase()
    log.error(`bundler failed. ${kebab}`)
    log.close()

    process.exitCode = 1
  }
})()
