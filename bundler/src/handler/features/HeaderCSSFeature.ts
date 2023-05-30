import Feature from './Feature'
import File from '../File'
import { Store } from '../../Store'

export default class HeaderCSSFeature implements Feature {
  public active: boolean = false
  public path: string

  constructor() {
    const path = Store.files.pack.content.portlet['com.liferay.portlet.header-portlet-css']

    if (path) {
      this.path = File.getCleanPath(path)
      this.active = true
    }
  }
}
