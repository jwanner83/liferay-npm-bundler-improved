#!/usr/bin/env node
import TimeHandler from './handlers/TimeHandler'
import yargs from 'yargs'
import Log from './classes/Log'
import Bundler from './classes/Bundler'

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

async function initialization () {
  const timer = new TimeHandler()
  Log.write(Log.chalk.bgBlue(' LIFERAY-NPM-BUNDLER-IMPROVED '))
  Log.write(Log.chalk.bgBlack(' 1.0.0-beta.7 '))

  const bundler: Bundler = new Bundler()

  try {
    Log.write(Log.chalk.bgCyan('\n PREPARE '))
    await bundler.prepare()

    Log.write(Log.chalk.bgCyan('\n BUNDLE '))
    await bundler.bundle()

    Log.write(Log.chalk.bgCyan('\n PROCESS '))
    await bundler.process()

    Log.write(Log.chalk.bgCyan('\n CREATE '))
    await bundler.create()

    if (!arg.keep) {
      Log.write(Log.chalk.bgCyan('\n CLEANUP '))
      await bundler.cleanup()
    }

    /*if (arg.deploy || arg.deploy === '') {
      Log.write('\nadditional: deploying')
      await bundler.deploy(arg.deploy)
    }*/

    Log.write(Log.chalk.bgGreen('\n SUCCESS '), timer.getSecondsPretty(), Log.chalk.green(`bundler finished successfully`))
  } catch (exception) {
    Log.write(Log.chalk.bgRed('\n ERROR '), timer.getSecondsPretty(), Log.chalk.red(`bundler finished with an error`))
  }
}

initialization()