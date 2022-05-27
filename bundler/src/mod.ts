import 'regenerator-runtime/runtime'
import { name, version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'
import SettingsHandler from './handler/SettingsHandler'
import { log } from './log'

void (async () => {
  console.log(`${name} - ${version}`)

  try {
    const settingsHandler = new SettingsHandler()
    const process = new ProcessHandler(settingsHandler)

    await process.prepare()
    await process.process()

    if (settingsHandler.createJar) {
      await process.create()
    }

    log.success('bundler done')
  } catch (exception) {
    const kebab: string = exception
      .toString()
      .replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1')
      .toLowerCase()
    log.error(`bundler failed. ${kebab}`)
  }

  log.close()
})()
