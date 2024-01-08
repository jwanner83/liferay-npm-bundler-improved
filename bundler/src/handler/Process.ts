import { access, copyFile, mkdir } from 'fs'
import { sep } from 'path'
import { promisify } from 'util'
import { version } from '../../package.json'
import CopySourcesException from '../exceptions/CopySourcesException'
import { Store } from '../Store'
import npmbundlerrc from '../types/npmbundlerrc.types'
import pack from '../types/pack.types'
import Archive from './Archive'
import HeaderCSSFeature from './features/HeaderCSSFeature'
import LocalizationFeature from './features/LocalizationFeature'
import File from './File'
import Flags from './Flags'
import Template from './Template'
import ConfigurationFeature from './features/ConfigurationFeature'
import Folder from './Folder'

export default class Process {
  public async initialize(): Promise<void> {
    // adding flags
    Store.flags = new Flags()

    // adding files
    const pack = await File.getFile<pack>('./package.json', true)
    pack.validate(['name', 'version', 'main'])
    Store.files.pack = pack
    Store.files.npmbundlerrc = await File.getFile<npmbundlerrc>('./.npmbundlerrc', false)

    // adding features
    Store.features.headerCSS = new HeaderCSSFeature()
    if (Store.features.headerCSS.active) {
      await Store.features.headerCSS.resolve()
    }
    Store.features.localization = new LocalizationFeature()
    if (Store.features.localization.active) {
      await Store.features.localization.resolve()
    }
    Store.features.configuration = new ConfigurationFeature()
    if (Store.features.configuration.active) {
      await Store.features.configuration.resolve()
    }

    // adding archive
    const archive = new Archive()
    await archive.initialize()
    Store.archive = archive

    // resolve input file qualifiers
    let filename = Store.files.pack.content.main
    let name = Store.files.pack.content.main
    if (name.endsWith('.js')) {
      name = name.replace('.js', '')
    } else if (name.endsWith('.cjs')) {
      name = name.replace('.cjs', '')
    } else {
      filename = `${filename}.js`
    }
    Store.portlet.input.name = name
    Store.portlet.input.filename = filename
    Store.portlet.input.dir = `.${sep}/build`
    Store.portlet.input.path = `${Store.portlet.input.dir}${sep}${filename}`

    // copy sources
    if (Store.flags.COPY_SOURCES) {
      const path = `.${sep}src${sep}${filename}`
      try {
        await promisify(mkdir)(Store.portlet.input.dir, { recursive: true })
        await promisify(access)(path)
        await promisify(copyFile)(path, Store.portlet.input.path)
      } catch {
        throw new CopySourcesException(
          `source could not be copied from '${path}' into ${Store.portlet.input.path}`
        )
      }
    }

    // resolve entry file
    Store.portlet.input.file = await File.getFile(Store.portlet.input.path, true, false)
  }

  async process(): Promise<void> {
    // process wrapper js file
    const wrapper = await Template.getTemplate('wrapper.js')
    wrapper.replace('name', Store.files.pack.content.name)
    wrapper.replace('version', Store.files.pack.content.version)
    wrapper.replace('main', Store.portlet.input.name)

    if (Store.flags.WATCH) {
      // process watch mode
      const dev = await Template.getTemplate('dev.js')
      dev.replace('port', '3002')
      dev.replace('name', Store.files.pack.content.name)
      dev.replace('version', Store.files.pack.content.version)
      wrapper.replace('bundle', dev.processed)
    } else {
      wrapper.replace('bundle', Store.portlet.input.file.content)
    }

    await wrapper.seal(Store.portlet.input.path)

    // process MANIFEST.MF
    const manifestMF = await Template.getTemplate('MANIFEST.MF')
    manifestMF.replace('name', Store.files.pack.content.name)
    manifestMF.replace('version', Store.files.pack.content.version)
    manifestMF.replace('description', Store.files.pack.content.description)
    manifestMF.replace('tool-version', version)

    if (Store.features.localization.active) {
      manifestMF.replace(
        'language-resource',
        ',liferay.resource.bundle;resource.bundle.base.name="content.Language"'
      )
    } else {
      manifestMF.replace('language-resource', '')
    }

    // process manifest.json
    const manifestJSON = await Template.getTemplate('manifest.json')
    manifestJSON.replace('name', Store.files.pack.content.name)
    manifestJSON.replace('version', Store.files.pack.content.version)

    Store.archive.file.append(manifestMF.processed, { name: `/META-INF/${manifestMF.name}` })
    Store.archive.file.append(manifestJSON.processed, {
      name: `/META-INF/resources/${manifestJSON.name}`
    })
    Store.archive.file.append(wrapper.processed, {
      name: `/META-INF/resources/${Store.portlet.input.filename}`
    })
    Store.archive.file.append(JSON.stringify(Store.files.pack.content, null, 2), {
      name: '/META-INF/resources/package.json'
    })

    // process localization
    if (Store.features.localization.active) {
      for (const [file, content] of Store.features.localization.files) {
        Store.archive.file.append(content, { name: `/content/${file}` })
      }
    }

    // process header css
    if (Store.features.headerCSS.active && Store.features.headerCSS.file) {
      Store.archive.file.append(Store.features.headerCSS.file.content, {
        name: `/META-INF/resources/${Store.features.headerCSS.file.name}`
      })
    }

    // process configuration
    if (Store.features.configuration.active) {
      Store.archive.file.append(JSON.stringify(Store.features.configuration.processed, null, 2), {
        name: `/features/portlet_preferences.json`
      })
    }

    // handle copy assets
    if (Store.flags.COPY_ASSETS) {
      addFolder(await Folder.getFolder(`.${sep}assets`, true))
      function addFolder (folder: Folder): void {
        for (const file of folder.files) {
          Store.archive.file.append(file.content, {
            name: `/META-INF/resources/${file.name}`
          })
        }
        for (const subfolder of folder.folders) {
          addFolder(subfolder)
        }
      }
    }
  }
}
