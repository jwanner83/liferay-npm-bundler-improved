#!/usr/bin/env node
const rollup = require('rollup')
const JSZip = require('jszip')
const pack = require(process.cwd() + '/package.json')

import { promisify } from 'util'
import { writeFile } from 'fs'

/**
 * Promisified write file method
 */
const writeFilePromisified = promisify(writeFile)


const inputOptions = {
  input: 'src/index.js'
}
const outputOptions = {
  format: 'cjs',
  strict: false
}

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const code = output[0].code
  await bundle.close();

  const manifestMF = getManifestMF(pack)
  const manifestJSON = getManifestJSON(pack)

  const zip = new JSZip()

  const metainf = zip.folder('META-INF')
  metainf.file('MANIFEST.MF', manifestMF)

  const resources = metainf.folder('resources')
  resources.file('manifest.json', manifestJSON)
  resources.file('package.json', JSON.stringify(pack))
  resources.file('index.js', getCode(pack, code))

  zip.generateAsync({
    type: 'nodebuffer'
  }).then(function(content) {
    writeFilePromisified(`dist/${pack.name}-${pack.version}.jar`, content)
  })
}

function getCode (pack, code) {
  return `Liferay.Loader.define('${pack.name}@${pack.version}/index', ['module', 'exports', 'require'], function (module, exports, require) {
    var define = undefined;
    var global = window;
    {
      ${code}
    }
  });
  `
}

function getManifestJSON (pack) {
  return JSON.stringify({
    "packages": {
      "/": {
        "dest": {
          "dir": "./build",
          "id": "/",
          "name": pack.name,
          "version": pack.version
        },
        "src": {
          "dir": ".",
          "id": "/",
          "name": pack.name,
          "version": pack.version
        }
      }
    }
  })
}

function getManifestMF (pack) {
  return `Manifest-Version: 1.0
  Bundle-ManifestVersion: 2
  Bundle-Name: ${pack.description}
  Bundle-SymbolicName: ${pack.name}
  Bundle-Version: ${pack.version}
  Provide-Capability: osgi.webresource;osgi.webresource=old;version:Version="1.0.0"
  Require-Capability: osgi.extender;filter:="(&(osgi.extender=liferay.frontend.js.portlet)(version>=1.0.0))"
  Tool: liferay-npm-bundler-improved-1.0.0
  Web-ContextPath: /${pack.name}`
}

build();