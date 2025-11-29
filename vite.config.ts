import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: process.env.VITE_DEV_SERVER_HOST || '::',
    port: parseInt(process.env.VITE_DEV_SERVER_PORT || '8080', 10),
    strictPort: true,
    proxy: {
      // Proxy all API calls to the backend server
      '^/api/.*': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
        },
      },
      // Health check endpoint
      '^/health': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
