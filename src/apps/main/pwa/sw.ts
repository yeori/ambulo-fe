/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
//@ts-ignore
self.skipWaiting()

// @ts-ignore
const staticAssets = self.__WB_MANIFEST
console.log('[START Precache]')
console.log(staticAssets)
console.log('[END Precache]')
precacheAndRoute(staticAssets)

cleanupOutdatedCaches()
clientsClaim()
