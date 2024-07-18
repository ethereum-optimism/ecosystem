import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://kyc-optimism-io-faq.netlify.app/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
