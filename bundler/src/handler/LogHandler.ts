import chalk from 'chalk'
import readline from 'readline'

enum LogType {
  progress = 'Progress',
  success = 'Success',
  warn = 'Warn',
  error = 'Error'
}

export default class LogHandler {
  private readonly step = 10

  private type: LogType = LogType.progress
  private message = ''
  private time = this.step
  private readonly interval: NodeJS.Timer

  private readonly warnings: string[] = []

  constructor() {
    this.interval = setInterval(() => {
      this.log()
      this.time += this.step
    }, this.step)
  }

  private log(): void {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(this.getMessage())
  }

  private getMessage(): string {
    return `${this.getPrefix()}: ${this.message}`
  }

  private getPrefix(): string {
    if (this.type === LogType.progress || this.type === LogType.warn) {
      return `${this.getType()} going on ${this.getTime()}`
    } else {
      return `${this.getType()} in ${this.getTime()}`
    }
  }

  private getType(): string {
    switch (this.type) {
      case LogType.progress:
        return chalk.blue(this.type)
      case LogType.success:
        return chalk.green(this.type)
      case LogType.warn:
        return chalk.yellow(this.type)
      case LogType.error:
        return chalk.red(this.type)
      default:
        return 'Information:'
    }
  }

  private getTime(): string {
    return `${this.time / 1000}s`
  }

  close(): void {
    clearInterval(this.interval)
    this.log()
    console.log('') // removes zsh highlighted % sign
  }

  progress(message): void {
    this.type = LogType.progress
    this.message = message
    this.log()
  }

  success(message): void {
    this.type = LogType.success

    if (this.hasWarnings()) {
      let additional = ' with '

      if (this.warnings.length === 1) {
        additional += 'one warning'
      } else {
        additional += `${this.warnings.length} warnings`
      }

      this.message = message as unknown as string + chalk.yellow(additional)
    } else {
      this.message = message
    }

    this.log()
  }

  warn(message): void {
    this.warnings.push(message)

    this.type = LogType.warn
    this.message = message
    this.log()
  }

  error(message): void {
    this.type = LogType.error
    this.message = message
    this.log()
  }

  hasWarnings (): boolean {
    return this.warnings.length !== 0
  }

  printWarnings (): void {
    this.warnings.forEach((value, index) => {
      let prefix = '↳'
      if (this.warnings.length !== 1) {
        prefix += ` ${index + 1}.`
      }

      console.log(chalk.yellow(prefix), value)
    })
  }
}
