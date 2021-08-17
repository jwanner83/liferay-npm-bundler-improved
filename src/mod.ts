#!/usr/bin/env node
import yargs from 'yargs'
import Bundler from './classes/Bundler'
import Log from './classes/Log'

async function initialization () {
  const start: Date = new Date()

  Log.write(Log.chalk.blue('liferay-npm-bundler-improved - 1.0.0-beta.7'))

  const bundler: Bundler = new Bundler()

  const arg: any = yargs(process.argv.slice(2)).options({
    deploy: {
      alias: 'd',
      type: 'string'
    },
    keep: {
      alias: 'k',
      type: 'boolean'
    }
  }).argv

  try {
    Log.write('\npreparation')
    await bundler.loadRollupConfiguration()
    await bundler.createDistDirectory()

    Log.write('\nbundle code with rollup')
    await bundler.bundle()

    Log.write('\nwrap liferay code into the Liferay.Loader')
    await bundler.wrap()

    Log.write('\ncheck additional portlet features')
    await bundler.features()

    Log.write('\ncreate and save jar')
    await bundler.create()

    if (!arg.keep) {
      Log.write('\ncleanup')
      await bundler.cleanup()
    }

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