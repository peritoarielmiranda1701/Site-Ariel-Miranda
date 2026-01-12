import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que process.env funcione para o SDK do Gemini no Vite
    'process.env': process.env
  }
});