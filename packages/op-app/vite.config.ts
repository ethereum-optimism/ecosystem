import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const TEST_APP_ENTRY = 'src/test-app/main.tsx'
const PROD_ENTRY = 'src/index.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  build: {
    lib: {
      entry: resolve(
        __dirname,
        process.env.MODE === 'development' ? TEST_APP_ENTRY : PROD_ENTRY,
      ),
      name: 'op-app',
    },
    rollupOptions: {
      external: ['react', 'op-wagmi', 'op-viem', 'wagmi', 'viem'],
    },
  },
})
