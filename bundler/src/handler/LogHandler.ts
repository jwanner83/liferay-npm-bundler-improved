import chalk from 'chalk'
import dayjs from 'dayjs'
import readline from 'readline'

enum LogType {
  progress = 'progress',
  live = 'live',
  success = 'success',
  warn = 'warn',
  error = 'error'
}

export default class LogHandler {

  private readonly start = performance.now()
  private readonly warnings: string[] = []

  private log(message: string, type: LogType = LogType.progress, persist: boolean = false): void {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
    if (persist) {
      console.log(this.getMessage(message, type))
    } else {
      process.stdout.write(this.getMessage(message, type))
    }
  }

  private getMessage(message: string, type: LogType): string {
    if (type === LogType.live) {
      return `${this.getPrefix(type)}: ${chalk.gray(message)}`
    } else {
      return `${this.getPrefix(type)}: ${message}`
    }
  }

  private getPrefix(type: LogType): string {
    if (type === LogType.progress || type === LogType.warn) {
      return `${this.getType(type)} going on ${this.getTime()}`
    } else if (type === LogType.live) {
      return `${this.getType(type)} at ${dayjs().format('HH:mm:ss')}`
    } else {
      return `${this.getType(type)} in ${this.getTime()}`
    }
  }

  private getType(type: LogType): string {
    switch (type) {
      case LogType.progress:
      case LogType.live:
        return chalk.blue(type)
      case LogType.success:
        return chalk.green(type)
      case LogType.warn:
        return chalk.yellow(type)
      case LogType.error:
        return chalk.red(type)
      default:
        return 'Information:'
    }
  }

  private getTime(): string {
    return `${Math.floor(performance.now() - this.start)}ms`
  }

  live(message: string, persist: boolean = false): void {
    this.log(message, LogType.live, persist)
  }

  progress(message: string): void {
    this.log(message)
  }

  success(message: string, info?: string, persist = false): void {
    let final = message

    if (info) {
      final += chalk.gray(` (${info})`)
    }

    if (this.hasWarnings()) {
      let additional = ' '

      if (this.warnings.length === 1) {
        additional += 'there is one warning'
      } else {
        additional += `there are ${this.warnings.length} warnings`
      }

      final += chalk.yellow(additional)
    }

    if (persist) {
      this.log(final, LogType.success, true)
    }
  }

  warn(message): void {
    this.warnings.push(message)
    this.log(message, LogType.warn)
  }

  error(message): void {
    this.log(message, LogType.error)
  }

  hasWarnings(): boolean {
    return this.warnings.length !== 0
  }

  printWarnings(): void {
    this.warnings.forEach((value, index) => {
      let prefix = '↳'
      if (this.warnings.length !== 1) {
        prefix += ` ${index + 1}.`
      }

      console.log(chalk.yellow(prefix), value)
    })
  }
}
