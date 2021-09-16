import Log from '../classes/Log'

export default class WarningHandler {
    public static warnings: Array<unknown> = []

    public static warn (...text: unknown[]) {
        Log.warn(text)
        this.warnings.push(text)
    }
}