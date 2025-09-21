import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      // ngrok hostname를 여기에 추가하세요. 여러 개 가능
      'a1640a6783ce.ngrok-free.app',
      '7119b37e9bc2.ngrok-free.app',
      'c9bb5b3e7f02.ngrok-free.app',
      '*'
    ],
    proxy: {
      '/api': {
        target:  'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/sales': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
