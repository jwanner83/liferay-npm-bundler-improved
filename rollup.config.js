import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'

export default {
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
}