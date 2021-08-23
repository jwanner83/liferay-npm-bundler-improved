import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'

export default {
  input: 'src/mod.ts',
  plugins: [
    preserveShebangs(),
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    typescript(),
    terser()
  ],
  output: [
    {
      file: 'bin/bundler.js',
      format: 'cjs',
      compact: true
    }
  ]
}
