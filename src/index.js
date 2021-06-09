#!/usr/bin/env node

const loadConfigFile = require('rollup/dist/loadConfigFile');
const path = require('path');
const rollup = require('rollup').rollup
const JSZip = require('jszip')
const vuePlugin = require('rollup-plugin-vue')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')

import { promisify } from 'util'
import { readFile } from 'fs'

const readFilePromisified = promisify(readFile)

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

export async function bundle () {
  const { options, warnings } = await loadConfigFile(process.cwd() + '/rollup.config.js')

  const bundle = await rollup(options[0])

  await bundle.write(options[0].output[0])
  await bundle.close()

  return await readFilePromisified('dist/index.js')
}

build();