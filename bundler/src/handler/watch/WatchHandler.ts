import SettingsHandler from '../SettingsHandler'
import { log } from '../../log'
import ServerHandler from './ServerHandler'
import PackageHandler from '../PackageHandler'

export default class WatchHandler {
  private readonly settings: SettingsHandler
  private readonly serverHandler: ServerHandler
  private readonly packageHandler: PackageHandler

  constructor(settings: SettingsHandler) {
    this.settings = settings
    this.serverHandler = new ServerHandler()
    this.packageHandler = new PackageHandler()
  }

  async prepare(): Promise<void> {
    log.progress(`preparations`)

    // validate package.json
    await this.packageHandler.resolve()
    this.packageHandler.validate()

    await this.serverHandler.createWSServer()
  }

  async watch(): Promise<void> {
    this.serverHandler.ws.use('*', async (req, res) => {
      if (req.ws) {
        const ws = await req.ws()
        this.serverHandler.connections.push(ws)

        ws.on('close', () => {
          this.serverHandler.connections.splice(this.serverHandler.connections.indexOf(ws), 1)
        })
      }
    })

    this.serverHandler.ws.listen(3012)
  }
}
