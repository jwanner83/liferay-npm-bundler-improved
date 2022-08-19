import replace from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BUILD': JSON.stringify('web')
    })
  ],
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/index.tsx',
      fileName: 'index',
      formats: ['cjs']
    }
  }
})
