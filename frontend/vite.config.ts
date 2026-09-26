import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';

// `--mode preview` produces a single self-contained HTML file (hash routing,
// inlined assets) for static demo hosting. The default build is a normal
// code-split SPA intended to sit behind a CDN with history-API fallback.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
    sourcemap: mode !== 'preview',
    rollupOptions:
      mode === 'preview'
        ? {}
        : {
            output: {
              manualChunks: {
                react: ['react', 'react-dom', 'react-router-dom'],
                icons: ['lucide-react'],
              },
            },
          },
  },
}));
