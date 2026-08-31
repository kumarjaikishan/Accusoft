import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgrPlugin({
      include: "**/*.svg?react",
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "redux-persist",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion",
      "lucide-react",
      "sonner",
      "chart.js",
      "react-chartjs-2",
      "dayjs"
    ],
  },
  build: {
    outDir: "build",
    target: "esnext",
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react-router-dom") ||
              id.includes("react-dom") ||
              id.includes("/react/")
            ) {
              return "vendor";
            }
            if (
              id.includes("@reduxjs/toolkit") ||
              id.includes("react-redux") ||
              id.includes("redux-persist")
            ) {
              return "redux";
            }
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "charts";
            }
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "mui";
            }
            if (
              id.includes("framer-motion") ||
              id.includes("lucide-react") ||
              id.includes("sonner")
            ) {
              return "ui";
            }
          }
        },
      },
    },
  },
});
