export default class TemplateSealException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TemplateSealException'
  }
}
