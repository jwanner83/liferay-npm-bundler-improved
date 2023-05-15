import 'regenerator-runtime/runtime'
import { name, version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'
import SettingsHandler from './handler/SettingsHandler'
import { log } from './log'
import WatchHandler from './handler/watch/WatchHandler'

void (async () => {
  console.log(`${name} - ${version}`)

  try {
    const settings = new SettingsHandler()

    if (settings.watch) {
      const watch = new WatchHandler(settings)
      const process = new ProcessHandler(settings)


      await watch.prepare()
      await watch.watch()


    } else {
      const process = new ProcessHandler(settings)

      await process.prepare()
      await process.process()

      if (settings.createJar) {
        await process.create()
      }

      log.success('bundler done')
      log.close()

      if (log.hasWarnings()) {
        log.printWarnings()
      }
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
