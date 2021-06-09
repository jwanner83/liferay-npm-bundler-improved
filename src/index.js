#!/usr/bin/env node

const rollup = require('rollup').rollup
const JSZip = require('jszip')
import { saveAsZip } from './save'
import { getJavaScript, getManifestJSON, getManifestMF } from './create'

const pack = require(process.cwd() + '/package.json')

async function build() {
  console.log('liferay npm bundler - improved')
  console.log('')
  console.log('start bundle code with rollup')
  const code = await bundle()
  console.log('finished bundle code with rollup')
  console.log('')
  console.log('start wrapping bundled code into Liferay.Loader')
  const javascript = getJavaScript(pack, code)
  console.log('finished wrapping bundled code into Liferay.Loader')
  console.log('')
  console.log('start creating MANIFEST.mf')
  const manifestMF = getManifestMF(pack)
  console.log('finished creating MANIFEST.mf')
  console.log('')
  console.log('start creating manifest.json')
  const manifestJSON = getManifestJSON(pack)
  console.log('finished creating manifest.json')
  console.log('')
  console.log('start creating jar')
  const zip = new JSZip()

  console.log('adding META-INF folder')
  const metainf = zip.folder('META-INF')

  console.log('adding MANIFEST.MF file to META-INF folder')
  metainf.file('MANIFEST.MF', manifestMF)

  console.log('adding resources folder to META-INF folder')
  const resources = metainf.folder('resources')

  console.log('adding manifest.json file to resources folder')
  resources.file('manifest.json', manifestJSON)

  console.log('adding package.json file to resources folder')
  resources.file('package.json', JSON.stringify(pack))

  console.log('adding index.js file to resources folder')
  resources.file('index.js', javascript)

  console.log('finished creating jar')
  console.log('')
  console.log('start saving jar')
  await saveAsZip(`dist/${pack.name}-${pack.version}.jar`, zip)
  console.log('finished saving jar')
  console.log('')
  console.log(`build finished`)
}

const inputOptions = {
  input: 'src/index.js'
}
const outputOptions = {
  format: 'cjs',
  strict: false
}

export async function bundle () {
  const bundle = await rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)
  const code = output[0].code
  await bundle.close()

  return code
}

build();