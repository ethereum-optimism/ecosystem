/* eslint-disable no-console */
import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@eth-optimism/api-plugin',
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
