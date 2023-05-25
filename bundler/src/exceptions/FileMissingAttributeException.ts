export default class FileMissingAttributeException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileMissingAttributeException'
  }
}
