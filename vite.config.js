// import { build, defineConfig } from "vite";
// import reactRefresh from "@vitejs/plugin-react-refresh";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import rollupReplace from "@rollup/plugin-replace";
// // https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: [
//       {
//         // "@": path.resolve(__dirname, "./src"),
//         find: "@",
//         replacement: path.resolve(__dirname, "./src"),
//       },
//     ],
//   },

//   plugins: [
//     rollupReplace({
//       preventAssignment: true,
//       values: {
//         __DEV__: JSON.stringify(true),
//         "process.env.NODE_ENV": JSON.stringify("development"),
//       },
//     }),
//     react(),
//     reactRefresh(),
//   ],

//    server: {
//     proxy: {
//       '/customizations': {
//         target: 'http://localhost:8088',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   // build:{chunkSizeWarningLimit:1600},
// build:{chunkSizeWarningLimit:1600}
// });




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    replace({
      values: {
        __DEV__: 'true',
        'process.env.NODE_ENV': '"development"',
      },
      preventAssignment: true,
    }),
  ],
  server: {
    proxy: {
      '/customizations': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Preserve /customizations path
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
