import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
    exclude: [],
  },
  server: {
    port: 5173,
    open: false,
    cors: true,
  },
  preview: {
    port: 4173,
    open: false,
  },
})
