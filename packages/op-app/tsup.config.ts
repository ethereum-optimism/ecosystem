/* eslint-disable no-console */
import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'op-app',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
})
