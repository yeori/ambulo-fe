<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { KakaoMap, KakaoPos } from "./kakao/KakaoMap.js"
  import env from '@/service/env/index.js'
  import userLocation, {
    locationStore
  } from '@/apps/main/component/geolocation/user-location.js'

  const ID_KAKAO_SDK = '_KAKAO_SDK_'
  let el: HTMLElement
  let map = undefined

  const { geo } = userLocation

  const startSession = () => {
    userLocation.resume()
  }
  const stopSession = () => {
    userLocation.stop()
  }

  onMount(() => {
    let map = new KakaoMap(el, env.kakaoApiKey)
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
    const locationLoader = geo
      .checkPermission()
      .then((pos: GeolocationPosition) => pos)

    Promise.all([locationLoader, scriptLoader]).then(([geoPos]) => {
      console.log(geoPos)
      const pos = new KakaoPos(geoPos)
      window.kakao.maps.load(() => {
        map.render(pos, 3)
      })
    })
  })
  onDestroy(() => {
    userLocation.clearTimer()
  })
</script>

<section class="abs-fill">
  <div bind:this={el} class="abs-fill" />
  <div class="session">
    {#if $locationStore.scanning}
      <button class="nude" on:click={stopSession}>중지</button>
    {:else}
      <button class="nude" on:click={startSession}>시작</button>
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    .session {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 4px;
    }
  }
</style>
