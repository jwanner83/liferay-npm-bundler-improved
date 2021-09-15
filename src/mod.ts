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
}).argv;

(async () => {
  const timer = new TimeHandler()
  Log.titleBadge(false, 'LIFERAY-NPM-BUNDLER-IMPROVED')
  Log.blackBadge(false, '1.0.0-beta.8')

  const bundler: Bundler = new Bundler()

  try {
    Log.mainBadge(true, 'prepare')
    await bundler.prepare()

    Log.mainBadge(true, 'bundle')
    await bundler.bundle()

    Log.mainBadge(true, 'process')
    await bundler.process()

    Log.mainBadge(true, 'create')
    await bundler.create()

    if (!arg.keep) {
      Log.mainBadge(true, 'cleanup')
      await bundler.cleanup()
    }

    if (arg.deploy || arg.deploy === '') {
      Log.mainBadge(true, 'deploy')
      await bundler.deploy(arg.deploy)
    }

    Log.successBadge(true, 'success')
    Log.success(timer, 'bundler finished successfully')
    process.exit(0)
  } catch (exception) {
    Log.errorBadge(true, 'error')
    Log.error(timer, 'bundler finished with an error')
    process.exit(1)
  }
})()
