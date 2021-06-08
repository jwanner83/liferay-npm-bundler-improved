import resolve from '@rollup/plugin-node-resolve'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'

export default {
  input: 'src/index.js',
  plugins: [
    preserveShebangs(),
    resolve()
  ],
  output: [
    {
      file: 'bin/index.js',
      format: 'cjs',
      compact: true
    }
  ]
}