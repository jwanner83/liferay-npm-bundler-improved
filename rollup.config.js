import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'

export default [
  {
    input: 'src/index.js',
    plugins: [
      preserveShebangs(),
      resolve(),
      commonjs()
    ],
    output: [
      {
        file: 'bin/index.js',
        format: 'cjs',
        compact: true
      }
    ]
  },
  {
    input: 'src/new/mod.ts',
    plugins: [
      preserveShebangs(),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json(),
      typescript()
    ],
    output: [
      {
        file: 'bin/bundler.js',
        format: 'cjs',
        compact: true
      }
    ]
  }
]