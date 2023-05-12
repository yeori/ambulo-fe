import env from '@/service/env/index.js'
import GoogleMap from './GoogleMap.js'
import { Loader } from '@googlemaps/js-api-loader'
import { GooglePos } from './GooglePos.js'
const ID_GOOGLEMAP_SDK = '_GOOGLE_SDK_'

const installSdk = (
  el: HTMLElement,
  locationLoader: Promise<GeolocationPosition>
) => {
  const loader = new Loader({
    apiKey: env.gmapApiKey,
    version: 'weekly',
    libraries: ['drawing', 'geometry', 'places']
  })
  const gmapPromise = loader.load()

  console.log('[gmap key]', env.gmapApiKey)
  const mapHandle = new GoogleMap(el, env.gmapApiKey)
  Promise.all([locationLoader, gmapPromise]).then(([geoPos]) => {
    const pos = new GooglePos(geoPos)
    mapHandle.render(pos, 18)
  })
  return mapHandle
}

export default {
  installSdk
}
