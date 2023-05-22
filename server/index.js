import { App } from '@tinyhttp/app'
import { tinyws } from 'tinyws'
import * as path from 'path'

const app = new App()
app.use(tinyws())

const sockets = []

app.use('*', async (req, res) => {
  if (req.ws) {
    const ws = await req.ws()

    sockets.push(ws)

    ws.on('close', () => {
      sockets.splice(sockets.indexOf(ws), 1)
    })
  }
})

setInterval(() => {
  sockets.forEach((socket) => {
    socket.send(
      JSON.stringify({
        script: `window.Liferay.DevelopmentInitializer = (params) => { console.log('liferay-npm-bundler-improved: hello from server', params) }`,
        style: 'body { background-color: red !important; }'
      })
    )
  })
}, 10000)

app.listen(3002)
