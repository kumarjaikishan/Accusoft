import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import viteCompression from 'vite-plugin-compression';
import svgrPlugin from "vite-plugin-svgr";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [
    reactRefresh(),
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