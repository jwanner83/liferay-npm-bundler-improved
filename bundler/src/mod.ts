import 'regenerator-runtime/runtime'
import { name, version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'
import { log } from './log'
import SettingsHandler from './handler/SettingsHandler'

void (async () => {
  const settingsHandler = new SettingsHandler()
  const process = new ProcessHandler(settingsHandler)

  console.log(`${name} - ${version}`)

  try {
    await process.prepare()
    await process.process()
    await process.create()

    log.success('bundler done')
  } catch (exception) {
    const kebab: string = exception.toString().replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1').toLowerCase()
    log.error(`bundler failed. ${kebab}`)
  }

  log.close()
})()
