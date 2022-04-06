export default class FeaturesHandler {
  public hasLocalization = false

  determine(pack: any): void {
    if (pack.portlet['javax.portlet.resource-bundle']) {
      this.hasLocalization = true
    }
  }
}
