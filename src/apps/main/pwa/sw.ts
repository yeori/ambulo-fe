/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// @ts-ignore
const staticAssets = self.__WB_MANIFEST
console.log('[START Precache]')
console.log(staticAssets)
console.log('[END Precache]')
precacheAndRoute(staticAssets)

cleanupOutdatedCaches()
