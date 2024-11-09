import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    open: false,
    port: 3000,
    host: true,
  },
  preview: {
    open: false,
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
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
