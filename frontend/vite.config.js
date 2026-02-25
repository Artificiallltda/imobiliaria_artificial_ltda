import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/uploads": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/properties": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/conversations": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/leads": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/favorites": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/settings": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
})