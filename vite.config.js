import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy auth endpoints
      '/auth': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        secure: false,
      },
      // Health check endpoint
      '/health': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Optimize dependencies for development
  optimizeDeps: {
    include: ['@emotion/styled'],
  },
}));
