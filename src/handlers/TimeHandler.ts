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
  public start () {
    this.startDate = new Date()
  }

  /**
     * End the timer
     */
  public end () {
    this.endDate = new Date()
  }

  /**
     * Reset the timer
     */
  public reset (start: boolean = true) {
    this.endDate = undefined

    if (start) {
      this.startDate = new Date()
    }
  }

  /**
     * Get the difference between start and end in seconds
     */
  public getSeconds (end: boolean = true) {
    if (end) {
      this.end()
    }

    return `${(this.endDate.getTime() - this.startDate.getTime()) / 1000}s`
  }

  /**
     * Get the difference between start and end in seconds as white text on dark background
     * @param end
     */
  public getSecondsPretty (end: boolean = true) {
    return Log.chalk.bgBlack(` ${this.getSeconds(end)} `)
  }
}
