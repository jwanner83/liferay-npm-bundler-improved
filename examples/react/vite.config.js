import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react()
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
      entry: 'src/index.tsx',
      fileName: 'index',
      formats: ['cjs']
    }
  }
})
