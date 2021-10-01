import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import eslint from '@rollup/plugin-eslint'

export default {
  input: 'src/mod.ts',
  plugins: [
    preserveShebangs(),
    eslint(),
    resolve({
      preferBuiltins: true
    }),
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
  ]
}
