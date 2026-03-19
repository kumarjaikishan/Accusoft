// vite.config.js
import { defineConfig } from "file:///C:/Users/good%20nature/OneDrive/Desktop/CODING/Accusoft/frontend%20copy/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/good%20nature/OneDrive/Desktop/CODING/Accusoft/frontend%20copy/node_modules/@vitejs/plugin-react/dist/index.js";
import viteCompression from "file:///C:/Users/good%20nature/OneDrive/Desktop/CODING/Accusoft/frontend%20copy/node_modules/vite-plugin-compression/dist/index.mjs";
import svgrPlugin from "file:///C:/Users/good%20nature/OneDrive/Desktop/CODING/Accusoft/frontend%20copy/node_modules/vite-plugin-svgr/dist/index.js";
import { visualizer } from "file:///C:/Users/good%20nature/OneDrive/Desktop/CODING/Accusoft/frontend%20copy/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import tailwindcss from "file:///C:/Users/good%20nature/OneDrive/Desktop/CODING/Accusoft/frontend%20copy/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:5000/"
  //   }
  // },
  build: {
    outDir: "build"
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
        icon: true
      }
    }),
    // Brotli (best)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      deleteOriginFile: false,
      filter: (file) => /\.(js|css|html|svg)$/.test(file),
      threshold: 1024
    }),
    // Gzip (fallback)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      deleteOriginFile: false,
      filter: (file) => /\.(js|css|html|svg)$/.test(file),
      threshold: 1024
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnb29kIG5hdHVyZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXENPRElOR1xcXFxBY2N1c29mdFxcXFxmcm9udGVuZCBjb3B5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnb29kIG5hdHVyZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXENPRElOR1xcXFxBY2N1c29mdFxcXFxmcm9udGVuZCBjb3B5XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9nb29kJTIwbmF0dXJlL09uZURyaXZlL0Rlc2t0b3AvQ09ESU5HL0FjY3Vzb2Z0L2Zyb250ZW5kJTIwY29weS92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbmltcG9ydCBzdmdyUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIHNlcnZlcjoge1xuICAvLyAgIHByb3h5OiB7XG4gIC8vICAgICBcIi9hcGlcIjogXCJodHRwOi8vbG9jYWxob3N0OjUwMDAvXCJcbiAgLy8gICB9XG4gIC8vIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImJ1aWxkXCIsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHRhaWx3aW5kY3NzKCksXG4gICAgLy8gdmlzdWFsaXplcih7XG4gICAgLy8gICBmaWxlbmFtZTogJy4vc3RhdHMuaHRtbCcsXG4gICAgLy8gICBvcGVuOiB0cnVlLFxuICAgIC8vIH0pLFxuICAgIHN2Z3JQbHVnaW4oe1xuICAgICAgc3Znck9wdGlvbnM6IHtcbiAgICAgICAgaWNvbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBCcm90bGkgKGJlc3QpXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgIGV4dDogJy5icicsXG4gICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSxcbiAgICAgIGZpbHRlcjogKGZpbGUpID0+IC9cXC4oanN8Y3NzfGh0bWx8c3ZnKSQvLnRlc3QoZmlsZSksXG4gICAgICB0aHJlc2hvbGQ6IDEwMjRcbiAgICB9KSxcblxuICAgIC8vIEd6aXAgKGZhbGxiYWNrKVxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgIGV4dDogJy5neicsXG4gICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSxcbiAgICAgIGZpbHRlcjogKGZpbGUpID0+IC9cXC4oanN8Y3NzfGh0bWx8c3ZnKSQvLnRlc3QoZmlsZSksXG4gICAgICB0aHJlc2hvbGQ6IDEwMjRcbiAgICB9KVxuICBdLFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUErWSxTQUFTLG9CQUFvQjtBQUM1YSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxpQkFBaUI7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTTFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtaLFdBQVc7QUFBQSxNQUNULGFBQWE7QUFBQSxRQUNYLE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQSxJQUdELGdCQUFnQjtBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLE1BQ0wsa0JBQWtCO0FBQUEsTUFDbEIsUUFBUSxDQUFDLFNBQVMsdUJBQXVCLEtBQUssSUFBSTtBQUFBLE1BQ2xELFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQTtBQUFBLElBR0QsZ0JBQWdCO0FBQUEsTUFDZCxXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsTUFDTCxrQkFBa0I7QUFBQSxNQUNsQixRQUFRLENBQUMsU0FBUyx1QkFBdUIsS0FBSyxJQUFJO0FBQUEsTUFDbEQsV0FBVztBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
