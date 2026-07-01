import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

dotenv.config({
  path: path.resolve(import.meta.dirname, "../../.env"),
});

const port = Number(process.env.VITE_PORT || 5173);
const basePath = process.env.BASE_PATH || "/";
const backendPort = process.env.PORT || 4000;

export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    tailwindcss({ optimize: false }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },

server: {
  port,
  strictPort: true,
  host: "0.0.0.0",
  allowedHosts: true,

proxy: {
  "/api": {
    target: `http://localhost:${backendPort}`,
    changeOrigin: true,
    secure: false,
  },
},

  fs: {
    strict: true,
  },
},

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});