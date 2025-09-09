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


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import replace from '@rollup/plugin-replace';

// export default defineConfig({
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   plugins: [
//     react({
//       jsxImportSource: '@emotion/react', // Add this for MUI with Emotion
//     }),
//     replace({
//       values: {
//         __DEV__: 'true',
//         'process.env.NODE_ENV': '"development"',
//       },
//       preventAssignment: true,
//     }),
//   ],
//   server: {
//     proxy: {
//       '/customizations': {
//         target: 'http://localhost:8088',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path,
//       },
//     },
//   },
//   build: {
//     chunkSizeWarningLimit: 1600,
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import replace from '@rollup/plugin-replace';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    replace({
      values: {
        __DEV__: 'true',
        'process.env.NODE_ENV': '"development"',
      },
      preventAssignment: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        includePaths: [
          path.resolve(__dirname, 'src/assets/scss'),
          path.resolve(__dirname, 'src/assets/scss/layout'),
          path.resolve(__dirname, 'src/assets/scss/components'),
          path.resolve(__dirname, 'src/assets/scss/utility'),
        ],
      },
    },
  },
  esbuild: {
    logOverride: {
      'module-directive': 'silent',
    },
  },
  server: {
    proxy: {
      '/customizations': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});