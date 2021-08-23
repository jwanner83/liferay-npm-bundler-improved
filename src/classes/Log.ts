import chalk from 'chalk'

export default class Log {
  /**
   * Wrapper for `console.log`
   */
  public static write = console.log

  /**
   * Wrapper for chalk which allows coloring the log output
   */
  public static chalk = chalk
}