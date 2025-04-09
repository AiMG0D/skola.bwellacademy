import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join as joinPath } from 'node:path';

export default defineConfig({
  server: {
    port: 25533,
  },
  plugins: [
    vue({
      reactivityTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['mux-video'].includes(tag),
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': joinPath(__dirname, 'src'),
    },
  },
  envPrefix: 'APP_',
});
