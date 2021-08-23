import chalk from 'chalk'
const ora = require('ora')

export default class Log {
  /**
   * Wrapper for `console.log`
   */
  public static write = console.log

  /**
   * Wrapper for chalk which allows coloring the log output
   */
  public static chalk = chalk

  /**
   * Wrapper for ora which allows adding loaders to log output
   */
  public static ora = ora
}