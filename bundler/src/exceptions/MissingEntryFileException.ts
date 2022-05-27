export default class MissingEntryFileException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingEntryFileException'
  }
}
