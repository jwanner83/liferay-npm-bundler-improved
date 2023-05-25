import 'regenerator-runtime/runtime'
import Process from './handler/Process'

void (async () => {
  const process = new Process()

  try {
    await process.initialize()
  } catch (error) {
    // handle error
  }
})()
