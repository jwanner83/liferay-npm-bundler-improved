import chalk from 'chalk'
import { access, readdir, readFile } from 'fs'
import { RollupWatcher } from 'rollup'
import { promisify } from 'util'
import { build } from 'vite'
import { WebSocket,WebSocketServer } from 'ws'
import { log } from '../log'
import FeaturesHandler from './FeaturesHandler'
import { sep } from 'path'
import { watch } from 'chokidar'
import PackageHandler from './PackageHandler'

export class ServeHandler {
  private readonly port: number
  private readonly sockets: WebSocket[] = []

  private hasLocalization: boolean = false
  private localizationPath: string = ''
  private entryPathJs: string = ''
  private entryPathCss: string = ''
  private rebuildAmount: number = 0
  private latestPayload: string = ''
  private packageHandler: PackageHandler = undefined

  private server: WebSocketServer = undefined

  constructor(port: number) {
    this.port = port
  }

  async prepare(entryPathJs: string, featuresHandler: FeaturesHandler, packageHandler: PackageHandler, entryPathCss?: string): Promise<void> {
    this.entryPathJs = entryPathJs
    this.entryPathCss = entryPathCss
    this.hasLocalization = featuresHandler.hasLocalization
    this.localizationPath = featuresHandler.localizationPath
    this.packageHandler = packageHandler
  }

  async serve(): Promise<void> {
    const bundle = await build({
      logLevel: 'silent',
      build: {
        watch: {
          include: [
            '**/*'
          ]
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
    }).catch(() => {
      // silent. the error will be reported to the client via websocket
    }) as RollupWatcher

    if (this.hasLocalization) {
      const watcher = watch(this.localizationPath + '/**/*', {
        persistent: true
      })

      watcher
        .on('change', () => {
          void this.send()
        })
        .on('unlink', () => {
          void this.send()
        })
    }

    bundle.on('event', (event) => {
      if (event.code === 'ERROR') {
        log.live(`${chalk.red('error')} ${event.error.message}`)
        log.live(`${chalk.red('bundle failed to rebuild')}. error sent to ${chalk.blue(this.sockets.length.toString() + (this.sockets.length === 1 ? ' client' : ' clients'))}`, true)

        const payload = JSON.stringify({
          name: `${this.packageHandler.pack.name}@${this.packageHandler.pack.version}`,
          error: {
            location: event.error.id,
            message: event.error.message
          }
        })

        for (const socket of this.sockets) {
          socket.send(payload)
        }

        this.latestPayload = payload
      }

      if (event.code === 'START') {
        const payload = JSON.stringify({
          name: `${this.packageHandler.pack.name}@${this.packageHandler.pack.version}`,
          updating: true
        })

        for (const socket of this.sockets) {
          socket.send(payload)
        }

        log.live('rebuilding bundle...')
      }
    })

    this.server = new WebSocketServer({ port: this.port })

    log.live(`serving websocket server on port ${chalk.blue(this.port)}`, true)

    this.server.on('connection', async (ws) => {
      this.sockets.push(ws)

      if (this.latestPayload) {
        ws.send(this.latestPayload)
      } else {
        void this.send(ws)
      }

      ws.on('close', () => {
        this.sockets.splice(this.sockets.indexOf(ws), 1)
      })
    })
  }

  private async send(ws?: WebSocket): Promise<void> {
    try {
      const bundle = (await promisify(readFile)(this.entryPathJs)).toString()
      let processed

      try {
        processed = this.hasLocalization ? await this.translate(bundle) : bundle
      } catch (exception) {
        log.live(`${chalk.yellow('failed to resolve the language keys.')} the bundle will be served as it is.`)
        processed = bundle
      }

      let css = ''

      if (this.entryPathCss) {
        css = (await promisify(readFile)(this.entryPathCss)).toString()
      }

      const payload = JSON.stringify({
        name: `${this.packageHandler.pack.name}@${this.packageHandler.pack.version}`,
        script: processed,
        style: css
      })

      if (ws) {
        ws.send(payload)
      } else {
        for (const socket of this.sockets) {
          socket.send(payload)
        }
      }

      this.latestPayload = payload

      log.live(`bundle rebuilt ${chalk.blue((this.rebuildAmount).toString() + (this.rebuildAmount > 1 ? ' times' : ' time'))} and sent to ${chalk.blue(this.sockets.length.toString() + (this.sockets.length === 1 ? ' client' : ' clients'))}`)
    } catch {
      // silent. the error will be reported to the client via websocket
    }
  }

  private async translate (bundle: string): Promise<string> {
    let processed = bundle
    const languageFiles: Map<string, string> = new Map()

    try {
      await promisify(access)(this.localizationPath)
    } catch (exception) {
      log.warn('the configured localization path is not present in your file structure. the bundle will be returned without modification.')
      return bundle
    }

    const files = await promisify(readdir)(this.localizationPath)
    for (const file of files) {
      const content = (
        await promisify(readFile)(`${this.localizationPath}${sep}${file}`)
      ).toString()
      languageFiles.set(file, content)
    }

    if (languageFiles.size === 0) {
      // nothing to do. return plain bundle
      return bundle
    }

    const liferayLanguageGetAppearances = processed.match(/Liferay.Language.get\(.*?\)/gm)
    for (const liferayLanguageGetAppearance of liferayLanguageGetAppearances) {
      let key = /\(.*?\)/.exec(liferayLanguageGetAppearance).toString()

      if (key) {
        key = key.slice(2)
        key = key.slice(0, -2)

        for (const content of languageFiles.values()) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          const valueRegExp = new RegExp(`^${key}=(.*)$`, 'gm')
          const valueMatches = content.match(valueRegExp)
          if (valueMatches && Array.isArray(valueMatches) && valueMatches.length === 0) {
            continue
          }

          const valueMatchSplit = valueMatches[0].split('=')
          if (valueMatchSplit.length > 0) {
            const value = valueMatches[0].split('=')[1]

            if (value) {
              processed = processed.replace(liferayLanguageGetAppearance, () => {
                // with a callback, the special replacement pattern isn't applied
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
                return `'${value}'`
              })

              break
            } else {
              // continue
            }
          }
        }
      }
    }

    return processed
  }
}
