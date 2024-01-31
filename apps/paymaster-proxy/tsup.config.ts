/* eslint-disable no-console */
import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@eth-optimism/paymaster-proxy',
  entry: ['src/cmd/runProxyService.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
