import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import eslint from '@rollup/plugin-eslint'
import { RollupOptions } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

const config: RollupOptions = {
  input: 'src/mod.ts',
  plugins: [
    eslint(),
    esbuild({
      minify: true
    }),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env']
    })
  ],
  output: [
    {
      file: 'dist/mod.js',
      format: 'cjs',
      exports: 'default',
      compact: true
    }
  ]
}

export default config
