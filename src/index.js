#!/usr/bin/env node
const rollup = require('rollup')
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
  file: 'build/index.js',
  format: 'cjs',
  strict: false
}

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const code = output[0].code
  await bundle.close();

  const file = getCode(pack, code)
  await writeFilePromisified(process.cwd() + '/build/index.js', file)
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

build();