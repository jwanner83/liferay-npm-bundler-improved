import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vuePlugin from 'rollup-plugin-vue'
import injectProcessEnv from 'rollup-plugin-inject-process-env'

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    vuePlugin(),
    commonjs(),
    injectProcessEnv()
  ],
  output: [
    {
      file: 'dist/index.js',
      format: 'commonjs',
      exports: 'default'
    }
  ]
}