import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import replace from '@rollup/plugin-replace'
import esbuild from 'rollup-plugin-esbuild'

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.js',
    format: 'commonjs',
    exports: 'default'
  },
  plugins: [
    resolve(),
    commonjs(),
    vue(),
    esbuild(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
