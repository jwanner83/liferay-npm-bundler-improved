import { sep } from 'path'
import { promisify } from 'util'
import { readFile } from 'fs'
import * as xml from '../XMLHandler'
import * as ddm from '../DDMHandler'
import Pack from '../../types/Pack.types'
import { transformPreferences } from '../ProjectHandler'

export default class ConfigurationHandler {
  private configuration: any
  private readonly pack: Pack
  private readonly hasLocalization: boolean

  constructor(pack: Pack, hasLocalization: boolean) {
    this.pack = pack
    this.hasLocalization = hasLocalization
  }

  public async resolve(): Promise<void> {
    const file = await promisify(readFile)(`.${sep}.npmbundlerrc`)
    this.configuration = await JSON.parse(file.toString())
  }

  public addSystemConfigurationFiles(zip): void  {
    const system = this.configuration.system

    if (!system) {
      // no system configuration
      return
    }

    // Add OSGI-INF/metatype/metatype.xml file

    const name = system.name || (this.hasLocalization ? this.pack.name : this.pack.description || this.pack.name);

    const metatype = xml.createMetatype(this.pack.name, name);

    if (this.hasLocalization) {
      xml.addMetatypeLocalization(metatype, this.hasLocalization);
    }

    const fields = Object.entries(system.fields);

    fields.forEach(([id, desc]) => {
      xml.addMetatypeAttr(metatype, id, desc);
    });

    zip.folder('OSGI-INF')
      .folder('metatype')
      .file(`${this.pack.name}.xml`, xml.format(metatype));

    // Add features/metatype.json file

    const metatypeJson = {};

    if (system.category) {
      metatypeJson.category = system.category;
    }

    zip.folder('features').file(
      'metatype.json',
      JSON.stringify(metatypeJson, null, 2)
    );
  }

   public addPortletInstanceConfigurationFile(zip): void {
    const portletInstanceConfigJson = this.configuration.portletInstance

    if (!portletInstanceConfigJson) {
      return;
    }

    const ddmJson = transformPreferences(
      project,
      portletInstanceConfigJson
    );

    zip.folder('features').file(
      'portlet_preferences.json',
      JSON.stringify(ddmJson, null, 2)
    );
  }
}

