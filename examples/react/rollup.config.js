import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'commonjs',
      exports: 'default'
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    esbuild()
  ]
}