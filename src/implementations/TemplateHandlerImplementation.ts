import TemplateHandler from '../interfaces/TemplateHandler'

export default class TemplateHandlerImplementation implements TemplateHandler {
  /**
   * The location of the templates
   * @private
   */
  private readonly base: string = '/dist/templates'

  public readonly name: string
  public readonly path: string
  public readonly raw: Buffer
  public processed: string

  constructor(name: string) {
    this.name = name
  }

  resolve()

  replace(key: string, value: string): void {}
}
