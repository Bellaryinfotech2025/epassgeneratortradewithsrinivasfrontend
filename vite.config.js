import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [
      'tradewithsrinivas.bellaryinfotech.com',
      'tradewithsrinivas.bellaryinfotech.com',
    ],
    proxy: {
      '/api': {
        target: 'https://tradeepass.bellaryinfotech.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})