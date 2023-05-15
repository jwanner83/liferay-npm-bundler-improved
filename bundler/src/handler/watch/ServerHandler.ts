import { App, Request } from '@tinyhttp/app'
import { tinyws, TinyWSRequest } from 'tinyws'

export default class ServerHandler {
  public ws

  public connections: WebSocket[] = []

  async createWSServer(): Promise<void> {
    this.ws = new App<any, Request & TinyWSRequest>()
    this.ws.use(tinyws())
  }
}
