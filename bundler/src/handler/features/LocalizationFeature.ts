import Feature from './Feature'
import File from '../File'
import { Store } from '../../stores/Store'
import { sep } from 'path'

export default class LocalizationFeature implements Feature {
  public active: boolean = false
  public path: string

  constructor() {
    if (Store.files.pack.content.portlet['javax.portlet.resource-bundle']) {
      const path = Store.files.npmbundlerrc?.content['create-jar']?.features?.localization

      if (path) {
        const cleanPath = File.getCleanPath(path)
        const split = cleanPath.split(sep)
        split.pop()
        this.path = split.join(sep)
        this.active = true
      }
    }
  }
}
