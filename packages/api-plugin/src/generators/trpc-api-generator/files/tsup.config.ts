/* eslint-disable no-console */
import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@eth-optimism/<%= name %>',
  entry: ['src/index.ts', 'src/cmd/run.ts'],
  outDir: 'build',
  format: ['cjs'],
  target: 'node18',
  splitting: false,
  sourcemap: true,
  clean: true,
})
