import env from '@/service/env/index.js'
import { KakaoPos } from './KakaoPos.js'
import { KakaoMap } from './KakaoMap.js'

const ID_KAKAO_SDK = '_KAKAO_SDK_'

const installSdk = (
  el: HTMLElement,
  locationLoader: Promise<GeolocationPosition>
) => {
  const mapHandle = new KakaoMap(el, env.kakaoApiKey)
  const scriptLoader = new Promise((ok, fail) => {
    if (document.querySelector(`#${ID_KAKAO_SDK}`)) {
      console.log('[existing')
      ok(true)
      return
    }
    const script = document.createElement('script')
    script.setAttribute('id', ID_KAKAO_SDK)
    script.setAttribute(
      'src',
      `//dapi.kakao.com/v2/maps/sdk.js?appkey=${env.kakaoApiKey}&libraries=services&autoload=false`
    )

    script.onload = () => {
      ok(true)
    }
    script.onerror = () => {
      fail({ cause: 'MAP_LOAD_ERROR' })
    }
    document.head.appendChild(script)
  })

  Promise.all([locationLoader, scriptLoader]).then(([geoPos]) => {
    console.log(geoPos)
    const pos = new KakaoPos(geoPos)
    kakao.maps.load(() => {
      mapHandle.render(pos, 3)
    })
  })
  return mapHandle
}

export default {
  installSdk
}
