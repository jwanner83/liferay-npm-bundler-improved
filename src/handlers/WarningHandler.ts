import Log from '../classes/Log'

/**
 * Handler to track warnings
 */
export default class WarningHandler {
    public static warnings: Array<unknown> = []

    /**
     * Add warning to log and track it inside module
     * @param text
     */
    public static warn (...text: unknown[]) {
        Log.warn(text)
        this.warnings.push(text)
    }
}