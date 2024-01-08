import 'regenerator-runtime/runtime'
import * as dotenv from 'dotenv'
import { name,version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'
import SettingsHandler from './handler/SettingsHandler'
import { log } from './log'

void (async () => {
  console.log(`${name} - ${version}`)

  dotenv.config()

  try {
    const settings = new SettingsHandler()
    const process = new ProcessHandler(settings)

    await process.prepare()
    await process.process()

    if (settings.createJar) {
      await process.create()

      if (settings.deploymentPath) {
        await process.deploy()
      }
    }

    if (settings.watch) {
      if (settings.deploymentPath) {
        log.success('bundler done', `development bundle is deployed to ${settings.deploymentPath}`, true)
      } else {
        log.success('bundler done', `development bundle has to be deployed to the liferay instance for the dev mode to work`, true)
      }

      if (log.hasWarnings()) {
        log.printWarnings()
      }

      await process.serve()
    } else {
      if (settings.deploymentPath) {
        log.success('bundler done', `file is deployed to ${settings.deploymentPath}`, true)
      } else {
        log.success('bundler done', '', true)
      }

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

    process.exitCode = 1
  }
})()
