/* eslint-disable no-console */
import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@eth-optimism/viem',
  entry: ['src/index.ts'],
  outDir: 'build',
  format: ['cjs'],
  target: 'node18',
  splitting: false,
  sourcemap: true,
  clean: true,
})
