import Portlet from './Portlet'

interface Pack {
  /**
   * The name of the module
   */
  readonly name: string

  /**
   * The module description
   */
  readonly description: string

  /**
   * The version
   */
  readonly version: string

  /**
   * The main entry point
   */
  readonly main: string

  /**
   * The portlet configuration
   */
  readonly portlet: Portlet
}

export default Pack
