export default class CopySourcesException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CopySourcesException'
  }
}
