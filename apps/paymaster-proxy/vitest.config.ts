import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    exclude: [
      '**/e2eTests/*.spec.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    hookTimeout: 20_000,
    testTimeout: 20_000,
    setupFiles: [
      './src/testUtils/setup.ts',
      './src/testUtils/setupExtendedMatchers.ts',
    ],
  },
})
