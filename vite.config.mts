import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// @ts-ignore - vite-plugin-wasm types may not be available
import wasm from "vite-plugin-wasm";

export default defineConfig({
  base: "./",
  plugins: [react(), wasm()],
  define: {
    global: "globalThis",
  },
  server: {
    open: false,
    port: 3000,
    host: true,
    allowedHosts: true,
    headers: {
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  preview: {
    open: false,
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  optimizeDeps: {
    include: ["@intuweb3/web-kit"],
    exclude: ["vite-plugin-wasm"],
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      external: [
        //"@intuweb3/exp-web/services/web3/contracts/abi/VaultFactory.json",
        //"@intuweb3/exp-web"
      ],
      input: {
        main: resolve(__dirname, "index.html"),
        //nested: resolve(__dirname, 'nested/index.html')
      },
    },
  },
});
