import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.tsx',
  output: {
    file: 'build/index.js',
    format: 'commonjs',
    exports: 'default'
  },
  plugins: [
    resolve(),
    commonjs(),
    esbuild(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}