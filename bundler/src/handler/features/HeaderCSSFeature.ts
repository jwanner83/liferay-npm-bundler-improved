import Feature from './Feature'
import File from '../File'
import { Store } from '../../Store'
import { join } from 'path'
import { log } from '../../log'

export default class HeaderCSSFeature implements Feature {
  public active: boolean = false
  public path: string
  public file: File<string>

  constructor() {
    const path = Store.files.pack.content.portlet['com.liferay.portlet.header-portlet-css']

    if (path) {
      this.path = path
      this.active = true
    }
  }

  async resolve(): Promise<void> {
    if (this.active) {
      const build = await File.getFile(join('build', File.getCleanPath(this.path)), false, false)
      const src = await File.getFile(join('src', File.getCleanPath(this.path)), false, false)

      if (build.exists) {
        this.file = build
      } else if (src.exists) {
        this.file = src
      } else {
        log.warn(
          `the 'com.liferay.portlet.header-portlet-css' property is set but the according css file can't either be found in '${src.path}' or in '${build.path}'. please make sure, the css file is present in one of the directories or remove the property.`
        )
      }
    }
  }
}
