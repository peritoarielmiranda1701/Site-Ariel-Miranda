import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    // Enable minification (using esbuild, default and faster)
    minify: 'esbuild',
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'directus': ['@directus/sdk'],
          // 'icons': ['lucide-react'], // Let Vite split icons automatically for better tree-shaking
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  define: {
    // Garante que process.env funcione para o SDK do Gemini no Vite
    'process.env': process.env
  }
});