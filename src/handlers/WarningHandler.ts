import Log from '../classes/Log'

/**
 * Handler to track warnings
 */
export default class WarningHandler {
  public static warnings: unknown[] = []

  /**
     * Add warning to log and track it inside module
     * @param text
     */
  public static warn (...text: unknown[]) {
    Log.warn(text)
    this.warnings.push(text)
  }
}
