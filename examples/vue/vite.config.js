import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    rollupOptions: {
      plugins: [
        resolve(),
        commonjs(),
        esbuild(),
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.BUILD': JSON.stringify('web')
        })
      ]
    },
    outDir: 'build',
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['cjs']
    }
  }
})
