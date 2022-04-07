import chalk from 'chalk'

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

  constructor() {
    this.interval = setInterval(() => {
      this.log()
      this.time += this.step
    }, this.step)
  }

  private log(): void {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
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
    this.message = message
    this.log()
  }

  warn(message): void {
    this.type = LogType.warn
    this.message = message
    this.log()
  }

  error(message): void {
    this.type = LogType.error
    this.message = message
    this.log()
  }
}
