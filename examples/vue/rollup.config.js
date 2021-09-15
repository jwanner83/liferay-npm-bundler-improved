import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vuePlugin from 'rollup-plugin-vue'
import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    vuePlugin(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  output: [
    {
      format: 'commonjs',
      exports: 'default'
    }
  ]
}