import chalk from 'chalk'
import TimeHandler from '../handlers/TimeHandler'
const ora = require('ora')

export default class Log {
  /**
   * Wrapper for `console.log`
   */
  public static write = console.log

  /**
   * Debug log with gray font color
   * @param text
   */
  public static debug (...text: unknown[]) {
    return Log.write(Log.chalk.gray(text))
  }

  /**
   * Info log with white font color
   * @param addLineBreak
   * @param text
   */
  public static info (addLineBreak: boolean, ...text: unknown[]) {
    if (addLineBreak) {
      Log.write('')
    }

    return Log.write(Log.chalk.white(text))
  }

  /**
   * Trace log with red font color
   * @param addLineBreak
   * @param text
   */
  public static trace (addLineBreak: boolean, ...text: unknown[]) {
    if (addLineBreak) {
      Log.write('')
    }

    return Log.write(Log.chalk.red(`\n${text}`))
  }

  /**
   * Success log with green background color and optional timer
   * @param timer
   * @param text
   */
  public static success (timer: TimeHandler, ...text: unknown[]) {
    return Log.write(timer.getSecondsPretty() ,Log.chalk.green(text))
  }

  /**
   * Error log with red background color and optional timer
   * @param timer
   * @param text
   */
  public static error (timer: TimeHandler | undefined, ...text: unknown[]) {
    return Log.write(timer.getSecondsPretty() ,Log.chalk.red(text))
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