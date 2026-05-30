import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Manual chunks pra dividir vendors grandes (melhor cache)
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router'
            if (id.includes('@supabase'))    return 'supabase'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('react-hot-toast')) return 'toast'
            if (id.includes('react') || id.includes('scheduler')) return 'react'
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 800
  },
  preview: {
    port: 4173,
    host: true
  }
})
