<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import { onDestroy, onMount } from 'svelte'
  import { KakaoMap, KakaoPos } from './kakao/KakaoMap.js'
  import env from '@/service/env/index.js'
  import userLocation, {
    locationStore
  } from '@/apps/main/component/geolocation/user-location.js'
  import { AmbuloSession } from '@main/session/AmbuloSession.js'
  import type { Unsubscriber } from 'svelte/store'

  const ID_KAKAO_SDK = '_KAKAO_SDK_'
  let el: HTMLElement
  let mapHandle: KakaoMap = undefined

  const { geo } = userLocation

  let session: Writable<AmbuloSession> = writable(null)
  let unsub: Unsubscriber

  const startSession = () => {
    session.update(() => new AmbuloSession())
    userLocation.resume()
    const userPath = mapHandle.createPath()
    unsub = locationStore.subscribe((state) => {
      if (state.pos) {
        $session.mark(state.pos.coords)
        userPath.addPosition(state.pos)
      }
    })
  }
  const stopSession = () => {
    userLocation.stop()
    unsub()
  }

  let positionVisible = false

  onMount(() => {
    mapHandle = new KakaoMap(el, env.kakaoApiKey)
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
        mapHandle.render(pos, 3)
      })
    })
  })
  onDestroy(() => {
    userLocation.stop()
  })
</script>

<section class="abs-fill">
  <div bind:this={el} class="abs-fill" />
  {#if positionVisible}
    <div
      class="user-pos"
      on:click={() => (positionVisible = false)}
      on:keyup={() => (positionVisible = false)}
    >
      <ul>
        {#each $session.positions as pos}
          <li>lat: {pos.latitude}, lng: {pos.longitude}</li>
        {/each}
      </ul>
    </div>
  {/if}
  <div class="session">
    {#if $locationStore.scanning}
      <button class="nude" on:click={stopSession}>중지</button>
      <button class="nud" on:click={() => (positionVisible = true)}
        >{$session.positions.length}</button
      >
    {:else}
      <button class="nude" on:click={startSession}>시작</button>
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    .user-pos {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      box-shadow: 0 0 8px #0000004d;
      border-radius: 8px;
      z-index: 200;
      padding: 16px;
      ul {
        padding: 0;
        list-style: none;
        margin: 0;
      }
    }
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
