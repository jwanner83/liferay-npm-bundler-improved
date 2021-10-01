import { name, version } from '../package.json'
import ProcessHandlerImplementation from './implementations/ProcessHandlerImplementation'
import ProcessHandler from './interfaces/ProcessHandler'
import ExceptionHandler from './interfaces/ExceptionHandler'
import ExceptionHandlerImplementation from './implementations/ExceptionHandlerImplementation'

void (async () => {
  const process: ProcessHandler = new ProcessHandlerImplementation(version)
  const exceptionHandler: ExceptionHandler = new ExceptionHandlerImplementation()

  console.log(`${name} - ${version}`)

  try {
    await process.prepare()
    await process.bundle()
  } catch (exception) {
    console.log('bundler failed:', exceptionHandler.getExceptionMessage(exception))
  }
})()
