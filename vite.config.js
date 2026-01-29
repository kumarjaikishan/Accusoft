import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from 'vite-plugin-compression';
import svgrPlugin from "vite-plugin-svgr";
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:5000/"
  //   }
  // },
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    tailwindcss(),
    // visualizer({
    //   filename: './stats.html',
    //   open: true,
    // }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),

    // Brotli (best)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
      filter: (file) => /\.(js|css|html|svg)$/.test(file),
      threshold: 1024
    }),

    // Gzip (fallback)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
      filter: (file) => /\.(js|css|html|svg)$/.test(file),
      threshold: 1024
    })
  ],
});