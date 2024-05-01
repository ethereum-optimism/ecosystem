import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    allowOnly: true,
    include: ['**/e2eTests/*.spec.ts'],
    setupFiles: [
      './src/testUtils/setupE2eEnv.ts',
      './src/testUtils/setupExtendedMatchers.ts',
    ],
  },
})
