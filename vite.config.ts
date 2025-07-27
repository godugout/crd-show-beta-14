
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false, // Disable error overlay to save memory
    },
  },
  plugins: [
    react(),
    // Temporarily disabled lovable-tagger to fix server startup
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/components/cards/hooks/__tests__/setup.ts'],
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    exclude: ['@/workers/cardDetectionWorker.ts']
  },
  // Memory optimization settings
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunks to save memory
      },
    },
  },
  // Disable source maps in development to save memory
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
