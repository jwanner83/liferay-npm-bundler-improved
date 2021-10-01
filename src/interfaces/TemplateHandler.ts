import Buffer from 'buffer'

interface TemplateHandler {
  /**
   * The name of the template
   */
  readonly name: string

  /**
   * The path to the template
   */
  readonly path: string

  /**
   * The raw content of the template as buffer
   */
  readonly raw: Buffer

  /**
   * The processed content of the template
   */
  processed: string

  /**
   * Replaces all variables with the given key with the value
   * @param key
   * @param value
   */
  replace: (key: string, value: string) => void
}

export default TemplateHandler
