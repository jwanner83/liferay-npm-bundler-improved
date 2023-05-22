import { readFile } from 'fs'
import { promisify } from 'util'
import { build } from 'vite'
import { WebSocket, WebSocketServer } from 'ws'

export class ServeHandler {
  private readonly port: number
  private entryPath: string = ''
  private readonly sockets: WebSocket[] = []

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
                console.log('rebuilt bundle')
                void this.send()
              }
            }
          ]
        }
      }
    })

    this.server = new WebSocketServer({ port: this.port })

    this.server.on('connection', async (ws) => {
      console.log('connected to client')
      this.sockets.push(ws)
      void this.send()

      ws.on('close', () => {
        console.log('client disconnected')
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
  }
}
