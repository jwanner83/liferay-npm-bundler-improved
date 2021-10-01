export default class TemplatesNotFoundException extends Error {
  constructor(message) {
    super(message)
    this.name = 'TemplatesNotFoundException'
  }
}
