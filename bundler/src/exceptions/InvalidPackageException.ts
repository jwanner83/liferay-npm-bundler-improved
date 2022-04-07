export default class InvalidPackageException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPackageException'
  }
}
