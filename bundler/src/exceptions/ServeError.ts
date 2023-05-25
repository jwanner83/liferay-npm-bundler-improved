export default class ServeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServeError'
  }
}
