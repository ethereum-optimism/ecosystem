import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@eth-optimism/contracts-ecosystem',
  entry: ['ts-abis/index.ts'],
  outDir: 'build',
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
