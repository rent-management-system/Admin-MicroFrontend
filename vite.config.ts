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
      // Handle API requests
      '^/api': {
        target: 'http://localhost:8020',
        changeOrigin: true,
        secure: false,
        configure: (proxy: any) => {
          proxy.on('error', (err: Error) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
    // Handle health check endpoint
    configureServer: (server: { middlewares: { use: (path: string, handler: (req: any, res: any) => void) => void } }) => {
      server.middlewares.use('/health', (_: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          status: 'ok', 
          version: 'development',
          timestamp: new Date().toISOString() 
        }));
      });
    },
    fs: {
      strict: true,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
