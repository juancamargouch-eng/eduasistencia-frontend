import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y ReactDOM en su propio chunk
          'react-vendor': ['react', 'react-dom'],
          // Separar React Router
          'router-vendor': ['react-router-dom'],
          // Separar face-api.js (es muy grande)
          'face-api': ['face-api.js'],
          // Separar librerías de UI
          'ui-vendor': ['framer-motion', 'recharts', 'lucide-react'],
          // Separar utilidades
          'utils-vendor': ['axios', 'qrcode.react', 'xlsx', 'sonner'],
        },
      },
    },
  },
})
