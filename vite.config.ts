import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join as joinPath } from "node:path";

export default defineConfig({
  server: {
    port: 25533,
    allowedHosts: [
      "https://z48wso884goc0ws4w8cwcgc8.65.21.194.249.sslip.io",
      ".z48wso884goc0ws4w8cwcgc8.65.21.194.249.sslip.io",
    ],
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },

  preview: {
    port: 25534,
    allowedHosts: [
      "https://z48wso884goc0ws4w8cwcgc8.65.21.194.249.sslip.io",
      ".z48wso884goc0ws4w8cwcgc8.65.21.194.249.sslip.io",
    ],
  },
  plugins: [
    vue({
      reactivityTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["mux-video"].includes(tag),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": joinPath(__dirname, "src"),
    },
  },
  envPrefix: "APP_",
});
