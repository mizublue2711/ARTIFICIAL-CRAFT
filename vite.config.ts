import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'zustand': fileURLToPath(new URL('./src/lib/zustand-shim.ts', import.meta.url)),
      'zod': fileURLToPath(new URL('./src/lib/zod-shim.ts', import.meta.url)),
      'next/server': fileURLToPath(new URL('./src/lib/next-server-shim.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});