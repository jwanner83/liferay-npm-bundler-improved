export default class InvalidPackageException extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidPackageException'
  }
}
