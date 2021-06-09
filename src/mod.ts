#!/usr/bin/env node

import Bundler from './Bundler'
import Log from './Log'

async function initialization () {
  const start: Date = new Date()

  Log.write(Log.chalk.blue('liferay-npm-bundler-improved'), Log.chalk.bgRed('unstable'))
  Log.write(Log.chalk.gray('this is a very experimental npm-bundler which takes a javascript portlet, bundles it with rollup and creates a jar file which then can be deployed to a liferay instance.'))

  const bundler: Bundler = new Bundler()

  Log.write('\npreparation')
  await bundler.loadRollupConfiguration()

  Log.write('\nbundle code with rollup')
  await bundler.bundle()

  Log.write('\nwrap liferay code into the Liferay.Loader')
  await bundler.wrap()

  Log.write('\ncreate and save jar')
  await bundler.create()

  Log.write(Log.chalk.bgGreen(`\nbundler finished successfully`), Log.chalk.bgBlack(`took ${(new Date().getTime() - start.getTime()) / 1000 }s`))
}

initialization()