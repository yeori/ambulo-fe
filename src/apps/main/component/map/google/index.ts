import env from '@/service/env/index.js'
import GoogleMap from './GoogleMap.js'
import { Loader } from '@googlemaps/js-api-loader'
import { GooglePos } from './GooglePos.js'
const ID_GOOGLEMAP_SDK = '_GOOGLE_SDK_'

const installSdk = (
  el: HTMLElement,
  locationLoader: Promise<GeolocationPosition>,
  latlng: { lat: number; lng: number }
) => {
  const loader = new Loader({
    apiKey: env.gmapApiKey,
    version: 'weekly',
    libraries: ['drawing', 'geometry', 'places']
  })
  const gmapPromise = loader.load()

  console.log('[gmap key]', env.gmapApiKey)
  const mapHandle = new GoogleMap(el, env.gmapApiKey)
  return gmapPromise.then(() => {
    const pos = new GooglePos(latlng)
    mapHandle.render(pos, 18)
    console.log('[DONE]')
    return mapHandle
  })
  // return mapHandle
}

export default {
  installSdk
}
