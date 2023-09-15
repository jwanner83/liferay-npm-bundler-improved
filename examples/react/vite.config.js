import replace from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BUILD': JSON.stringify('web')
    }),
    tsconfigPaths()
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
