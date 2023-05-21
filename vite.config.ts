import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
// import { VitePWA } from 'vite-plugin-pwa'
import vitePwaConfiguration from './xconfig/pwa'

const mode = process.env.NODE_ENV
console.log('[mode]', mode)
console.log('import.meta: ', import.meta)
const devMode = mode === 'development'
const prodMode = mode === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: !devMode,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, devMode ? './index.html' : './index.html')
        // editor: path.resolve(
        //   __dirname,
        //   devMode ? './editor/index.dev.html' : './editor/index.html'
        // )
        // dao: path.resolve(__dirname, 'src/database')
      }
    },
    manifest: 'precache.json'
  },
  plugins: [
    svelte({
      compilerOptions: { dev: !prodMode }
    }),
    vitePwaConfiguration
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, './src/common'),
      '@main': path.resolve(__dirname, './src/apps/main'),
      '@admin': path.resolve(__dirname, './src/apps/admin')
    }
  },
  server: {
    port: 3000
  }
})
