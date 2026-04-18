import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    allowedHosts: 'all',
  },
  worker: {
    format: 'es',   // necesario para workers con dynamic imports (ONNX/piper)
  },
  build: {
    rollupOptions: {
      input: {
        main:   resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor.html'),
      },
    },
  },
});
