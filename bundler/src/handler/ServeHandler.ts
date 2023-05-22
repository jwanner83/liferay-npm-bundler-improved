import { readFile } from 'fs'
import { promisify } from 'util'
import { build } from 'vite'
import { WebSocket, WebSocketServer } from 'ws'
import { log } from '../log'
import chalk from 'chalk'

export class ServeHandler {
  private readonly port: number
  private entryPathJs: string = ''
  private entryPathCss: string = ''
  private readonly sockets: WebSocket[] = []
  private rebuildAmount: number = 0

  private server: WebSocketServer = undefined

  constructor(port: number) {
    this.port = port
  }

  async prepare(entryPathJs: string, entryPathCss?: string): Promise<void> {
    this.entryPathJs = entryPathJs
    this.entryPathCss = entryPathCss
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
                this.rebuildAmount++
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
      this.sockets.push(ws)
      void this.send(ws)

      ws.on('close', () => {
        this.sockets.splice(this.sockets.indexOf(ws), 1)
      })
    })
  }

  private async send(ws?: WebSocket): Promise<void> {
    const bundle = (await promisify(readFile)(this.entryPathJs)).toString()
    let css = ''

    if (this.entryPathCss) {
      css = (await promisify(readFile)(this.entryPathCss)).toString()
    }

    const payload = JSON.stringify({
      script: bundle,
      style: css
    })

    if (ws) {
      ws.send(payload)
    } else {
      for (const socket of this.sockets) {
        socket.send(payload)
      }
    }

    log.live(`bundle rebuilt ${chalk.blue((this.rebuildAmount).toString() + (this.rebuildAmount > 1 ? ' times' : ' time'))} and sent to ${chalk.blue(this.sockets.length.toString() + (this.sockets.length === 1 ? ' client' : ' clients'))}`)
  }
}
