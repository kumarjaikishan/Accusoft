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
  resolve: {
    mainFields: ['module', 'browser', 'main'],
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux') || id.includes('redux-persist')) {
              return 'redux';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'charts';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('sonner')) {
              return 'ui';
            }
          }
        }
      }
    }
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
    // viteCompression({
    //   algorithm: 'brotliCompress',
    //   ext: '.br',
    //   deleteOriginFile: false,
    //   filter: (file) => /\.(js|css|html|svg)$/.test(file),
    //   threshold: 1024
    // }),

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