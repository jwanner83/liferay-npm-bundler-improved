export default class TemplatesNotFoundException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TemplatesNotFoundException'
  }
}
