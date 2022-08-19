import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BUILD': JSON.stringify('web')
    })
  ],
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['cjs']
    }
  }
})
