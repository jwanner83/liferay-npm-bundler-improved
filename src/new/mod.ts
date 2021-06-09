#!/usr/bin/env node

import Bundler from './Bundler'
import Log from './Log'

async function initialization () {
  Log.write(Log.chalk.bgGreen('liferay-npm-bundler-improved'))
  Log.write(Log.chalk.gray('this is a very experimental npm-bundler which takes a javascript portlet, bundles it with rollup and creates a jar file which then can be deployed to a liferay instance.'))

  const bundler: Bundler = new Bundler()

  Log.write('\nloading custom rollup configuration')
  await bundler.loadRollupConfiguration();

  Log.write('\nstarting to bundle the code')
  await bundler.bundle();
}

initialization()