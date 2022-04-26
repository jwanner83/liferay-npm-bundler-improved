import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import lnbi from 'rollup-plugin-lnbi'

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
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    lnbi()
  ]
}
