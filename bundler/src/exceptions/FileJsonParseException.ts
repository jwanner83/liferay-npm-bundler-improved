export default class FileJsonParseException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileJsonParseException'
  }
}
