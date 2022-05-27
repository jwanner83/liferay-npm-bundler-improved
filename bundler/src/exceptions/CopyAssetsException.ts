export default class CopyAssetsException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CopyAssetsException'
  }
}
