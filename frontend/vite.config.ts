// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ["lucide-react"],
//   },
//   server: {
//     port: 5173,
//     host: true,
//   },
//   build: {
//     outDir: "dist",
//     sourcemap: true,
//   },
// });




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['axios', 'react-hot-toast']
        }
      }
    }
  },
  preview: {
    port: 4173,
    host: true,
  },
});
