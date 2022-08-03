interface Portlet {
  /**
   * The name of the portlet
   */
  readonly 'javax.portlet.name': string

  /**
   * The location of the resource bundles
   */
  readonly 'javax.portlet.resource-bundle': string

  /**
   * The location of a css file which should be included in the page
   */
  readonly 'com.liferay.portlet.header-portlet-css'?: string
}

export default Portlet
