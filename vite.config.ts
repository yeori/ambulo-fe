import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

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
    })
  ],
  server: {
    port: 3000
  }
})
