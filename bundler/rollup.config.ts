import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'
import { RollupOptions } from 'rollup'
import replace from '@rollup/plugin-replace'

const config: RollupOptions[] = [
  {
    input: 'src/templates/dev/mod.tsx',
    plugins: [
      resolve(),
      json(),
      commonjs(),
      esbuild(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    output: {
      file: 'dist/templates/dev.js',
      format: 'commonjs',
      exports: 'default'
    }
  },
  {
    input: 'src/mod.ts',
    plugins: [
      preserveShebangs(),
      eslint(),
      commonjs({
        transformMixedEsModules: true
      }),
      json(),
      esbuild({
        minify: true
      }),
      copy({
        targets: [
          {
            src: 'src/templates/plain/*',
            dest: 'dist/templates/'
          }
        ]
      }),
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      })
    ],
    output: [
      {
        file: 'bin/bundler.js',
        format: 'cjs',
        compact: true,
        banner: '#!/usr/bin/env node'
      }
    ],
    external: [
      'fs',
      'util',
      'regenerator-runtime/runtime',
      'path',
      'archiver',
      'chalk',
      'readline',
      'arg',
      'vite',
      'connect',
      'http-proxy',
      'http',
      'harmon',
      'ws',
      'chokidar',
      'dotenv',
      'dayjs'
    ]
  }
]

export default config
