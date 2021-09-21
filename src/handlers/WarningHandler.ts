import Log from '../classes/Log'

/**
 * Handler to track warnings
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class WarningHandler {
  public static warnings: unknown[] = []

  /**
     * Add warning to log and track it inside module
     * @param text
     */
  public static warn (...text: unknown[]): void {
    Log.warn(text)
    this.warnings.push(text)
  }
}
