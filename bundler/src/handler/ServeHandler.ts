import { readFile } from 'fs'
import { promisify } from 'util'
import { build } from 'vite'
import { WebSocket, WebSocketServer } from 'ws'
import { log } from '../log'
import chalk from 'chalk'

export class ServeHandler {
  private readonly port: number
  private entryPath: string = ''
  private readonly sockets: WebSocket[] = []
  private rebuildAmount: number = 0

  private server: WebSocketServer = undefined

  constructor(port: number) {
    this.port = port
  }

  async prepare(entryPath: string): Promise<void> {
    this.entryPath = entryPath
  }

  async serve(): Promise<void> {
    await build({
      logLevel: 'silent',
      build: {
        watch: {
          include: ['src/**/*']
        },
        rollupOptions: {
          plugins: [
            {
              name: 'replace',
              closeBundle: () => {
                void this.send()
              }
            }
          ]
        }
      }
    })

    this.server = new WebSocketServer({ port: this.port })

    log.live(`serving websocket server on port ${chalk.blue(this.port)}`, true)

    this.server.on('connection', async (ws) => {
      log.live('client connected', true)
      this.sockets.push(ws)
      void this.send()

      ws.on('close', () => {
        log.live('client disconnected', true)
        this.sockets.splice(this.sockets.indexOf(ws), 1)
      })
    })
  }

  private async send(): Promise<void> {
    const bundle = (await promisify(readFile)(this.entryPath)).toString()

    for (const socket of this.sockets) {
      socket.send(
        JSON.stringify({
          script: bundle,
          style: ''
        })
      )
    }

    log.live(`bundle rebuilt ${chalk.blue((++this.rebuildAmount).toString() + (this.rebuildAmount > 1 ? ' times' : ' time'))} and sent to ${chalk.blue(this.sockets.length.toString() + (this.sockets.length === 1 ? ' client' : ' clients'))}`)
  }
}
