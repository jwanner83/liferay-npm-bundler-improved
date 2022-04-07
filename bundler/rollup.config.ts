import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'

export default {
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
      compact: true
    }
  ],
  external: ['fs', 'fs/promises', 'path', 'archiver', 'chalk']
}
