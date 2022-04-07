interface Portlet {
  /**
   * The name of the portlet
   */
  readonly 'javax.portlet.name': string

  /**
   * The location of the resource bundles
   */
  readonly 'javax.portlet.resource-bundle': string
}

export default Portlet
