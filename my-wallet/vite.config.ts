import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/manifest.json', dest: '.' },
        { src: 'public/background.js', dest: '.' },
        { src: 'public/contentScript.js', dest: '.' },
        { src: 'public/injected.js', dest: '.' } // ✅ <-- THIS is critical
      ]
    })
  ],
  define: {
    global: {}, // for Buffer polyfill
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer']
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
