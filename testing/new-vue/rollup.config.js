import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vuePlugin from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    vuePlugin(),
    commonjs(),
    terser({
      format: {
        comments: false
      }
    })
  ],
  output: [
    {
      file: 'dist/index.js',
      format: 'commonjs'
    }
  ]
}