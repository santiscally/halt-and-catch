import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El frontend llama a /api (relativo). En dev lo proxeamos al backend local;
// en prod nginx hace el mismo proxy hacia el contenedor del backend.
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:4000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
