import { name, version } from '../package.json'
import ProcessHandler from './handler/ProcessHandler'

void (async () => {
  const process = new ProcessHandler()

  console.log(`${name} - ${version}`)

  try {
    await process.prepare()
    await process.process()
    await process.create()

    console.info('bundler done')
  } catch (exception) {
    console.error('bundler failed:', exception)
  }
})()
