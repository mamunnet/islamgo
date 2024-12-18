import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'react-toastify',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid'
    ]
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@heroicons/react'],
          'data-vendor': ['@tanstack/react-query', 'axios']
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: true
    },
    proxy: {
      '/api/hadith': {
        target: 'https://api.sunnah.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hadith/, ''),
        headers: {
          'x-api-key': 'SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk'
        }
      }
    }
  }
})
