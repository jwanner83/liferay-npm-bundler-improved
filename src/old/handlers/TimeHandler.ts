import Log from '../classes/Log'

/**
 * Time handler which serves as a timer and has some neat features which
 * prevent code duplications
 */
export default class TimeHandler {
  /**
     * The start date
     * @private
     */
  private startDate: Date

  /**
     * The end date
     * @private
     */
  private endDate: Date

  constructor (start: boolean = true) {
    if (start) {
      this.startDate = new Date()
    }
  }

  /**
     * Start the timer
     */
  public start (): void {
    this.startDate = new Date()
  }

  /**
     * End the timer
     */
  public end (): void {
    this.endDate = new Date()
  }

  /**
     * Reset the timer
     */
  public reset (start: boolean = true): void {
    this.endDate = undefined

    if (start) {
      this.startDate = new Date()
    }
  }

  /**
     * Get the difference between start and end in seconds
     */
  public getSeconds (end: boolean = true): string {
    if (end) {
      this.end()
    }

    return `${(this.endDate.getTime() - this.startDate.getTime()) / 1000}s`
  }

  /**
     * Get the difference between start and end in seconds as white text on dark background
     * @param end
     */
  public getSecondsPretty (end: boolean = true): string {
    return Log.chalk.bgBlack(` ${this.getSeconds(end)} `)
  }
}
