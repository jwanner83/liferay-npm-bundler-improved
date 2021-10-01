import chalk from 'chalk'
import TimeHandler from '../handlers/TimeHandler'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ora = require('ora')

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Log {
  /**
   * Wrapper for `console.log`
   */
  public static write = console.log

  /**
   * Badge which shows title titles
   * @param addLineBreak
   * @param text
   */
  public static titleBadge (addLineBreak: boolean, text: string): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.bgGreen(` ${text.trim().toUpperCase()} `))
  }

  /**
   * Badge which shows black titles
   * @param addLineBreak
   * @param text
   */
  public static blackBadge (addLineBreak: boolean, text: string): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.bgBlack(` ${text.trim().toUpperCase()} `))
  }

  /**
   * Badge which shows main titles
   * @param addLineBreak
   * @param text
   */
  public static mainBadge (addLineBreak: boolean, text: string): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.bgCyan(` ${text.trim().toUpperCase()} `))
  }

  /**
   * Badge which shows success titles
   * @param addLineBreak
   * @param text
   */
  public static successBadge (addLineBreak: boolean, text: string): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.bgGreen(` ${text.trim().toUpperCase()} `))
  }

  /**
   * Badge which shows error titles
   * @param addLineBreak
   * @param text
   */
  public static errorBadge (addLineBreak: boolean, text: string): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.bgRed(` ${text.trim().toUpperCase()} `))
  }

  /**
   * Debug log with gray font color
   * @param text
   */
  public static debug (...text: unknown[]): void {
    Log.write(Log.chalk.gray(text))
  }

  /**
   * Info log with white font color
   * @param addLineBreak
   * @param text
   */
  public static info (addLineBreak: boolean, ...text: unknown[]): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.white(text))
  }

  /**
   * Trace log with red font color
   * @param addLineBreak
   * @param text
   */
  public static trace (addLineBreak: boolean, ...text: unknown[]): void {
    if (addLineBreak) {
      Log.write('')
    }

    Log.write(Log.chalk.red(`\n${text}`))
  }

  /**
   * Success log with green background color and optional timer
   * @param timer
   * @param text
   */
  public static success (timer: TimeHandler, ...text: unknown[]): void {
    Log.write(timer.getSecondsPretty(), Log.chalk.green(text))
  }

  /**
   * Error log with red background color and optional timer
   * @param timer
   * @param text
   */
  public static error (timer: TimeHandler | undefined, ...text: unknown[]): void {
    Log.write(timer.getSecondsPretty(), Log.chalk.red(text))
  }

  /**
   * Warn log with red background color and optional timer
   * @param text
   */
  public static warn (...text: unknown[]): void {
    Log.write(Log.chalk.yellow(text))
  }

  /**
   * Wrapper for chalk which allows coloring the log output
   */
  public static chalk = chalk

  /**
   * Wrapper for ora which allows adding loaders to log output
   */
  public static ora = ora
}
