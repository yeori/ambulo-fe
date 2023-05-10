import { VitePWA } from 'vite-plugin-pwa'

// TODO pwa icon 필요함
export default VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src/apps/main/pwa',
  filename: 'sw.ts',
  registerType: 'autoUpdate',
  minify: false,
  devOptions: {
    enabled: false,
    type: 'module',
    navigateFallback: 'index.html',
    navigateFallbackAllowlist: []
  },
  manifest: {
    name: 'ambulo',
    short_name: 'ambulo',
    start_url: '/',
    display: 'standalone',
    theme_color: '#f2ffdf',
    background_color: '#ffffff',
    description: 'We walk along the road',
    lang: 'en',
    scope: '/',
    prefer_related_applications: false
    // shortcuts: [] : https://marshallku.com/web/tips/pwa%EC%9D%98-manifest-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0
    // icons: pwaIcons
  },
  injectManifest: {
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 4,
    globPatterns: ['**/*.{js,js.map,css,ico,png,jpg,svg,html,ttf}'],
    additionalManifestEntries: []
  }
})
