import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create a simple middleware for health checks
  const healthCheck = (_: any, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', version: 'development' }));
  };

  return {
    server: {
      host: process.env.VITE_DEV_SERVER_HOST || '::',
      port: parseInt(process.env.VITE_DEV_SERVER_PORT || '8080', 10),
      strictPort: true,
      proxy: {
        // Handle API requests
        '^/api': {
          target: 'http://localhost:8020',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
          configure: (proxy: any) => {
            proxy.on('error', (err: Error) => {
              console.error('Proxy error:', err);
            });
          },
        },
        // Handle health check locally
        '^/health': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          bypass: () => '/health',
        },
      },
      // Add middleware for health check
      open: '/health',
      fs: {
        strict: true,
      },
      // Use configureServer instead of before for Vite
      configureServer: (server: { middlewares: { use: (path: string, handler: any) => void } }) => {
        server.middlewares.use('/health', healthCheck);
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
