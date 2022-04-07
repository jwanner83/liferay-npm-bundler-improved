import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'
import { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: 'src/mod.ts',
  plugins: [
    preserveShebangs(),
    eslint(),
    commonjs(),
    json(),
    esbuild({
      minify: true
    }),
    copy({
      targets: [
        {
          src: 'src/templates/*',
          dest: 'dist/templates/'
        }
      ]
    })
  ],
  output: [
    {
      file: 'bin/bundler.js',
      format: 'cjs',
      compact: true,
      banner: '#!/usr/bin/env node'
    }
  ],
  external: ['fs', 'fs/promises', 'path', 'archiver', 'chalk']
}

export default config
