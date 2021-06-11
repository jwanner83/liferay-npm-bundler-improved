#!/usr/bin/env node
const yargs = require('yargs')

import Bundler from './classes/Bundler'
import Log from './classes/Log'

async function initialization () {
  const start: Date = new Date()

  Log.write(Log.chalk.blue('liferay-npm-bundler-improved'), Log.chalk.bgRed('unstable'))
  Log.write(Log.chalk.gray('this is a very experimental npm-bundler which takes a javascript portlet, bundles it with rollup and creates a jar file which then can be deployed to a liferay instance.'))

  const bundler: Bundler = new Bundler()

  try {

    Log.write('\npreparation')
    await bundler.loadRollupConfiguration()

    Log.write('\nbundle code with rollup')
    await bundler.bundle()

    Log.write('\nwrap liferay code into the Liferay.Loader')
    await bundler.wrap()

    Log.write('\ncreate and save jar')
    await bundler.create()

    const arg: any = yargs(process.argv.slice(2)).options({
      deploy: {
        alias: 'd',
        type: 'string'
      }
    }).argv

    if (arg.deploy || arg.deploy === '') {
      Log.write('\nadditional: deploying')
      await bundler.deploy(arg.deploy)
    }

    Log.write(Log.chalk.bgGreen(`\nbundler finished successfully`), Log.chalk.bgBlack(`took ${(new Date().getTime() - start.getTime()) / 1000 }s`))
  } catch (exception) {
    Log.write(Log.chalk.bgRed(`\nbundler finished with an error`), Log.chalk.bgBlack(`took ${(new Date().getTime() - start.getTime()) / 1000 }s`))
  }
}

initialization()