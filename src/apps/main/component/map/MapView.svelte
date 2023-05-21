<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import { onDestroy, onMount } from 'svelte'
  import userLocation, {
    locationStore
  } from '@/apps/main/component/geolocation/user-location.js'
  import { AmbuloSession } from '@main/session/AmbuloSession.js'
  import type { Unsubscriber } from 'svelte/store'
  import type { IMapPos, IMapSpec } from './IMapSpec.js'
  import api from '@/service/api/index.js'
  import { Journey } from '@/common/entity/journey/Journey.js'
  import googleInstaller from './google/index.js'
  import kakaoInstaller from './kakao/index.js'

  const DEFAULT_PLACES = [
    { region: 'busan', lat: 35.10077, lng: 129.03376 },
    { region: 'suncheon', lat: 34.92809, lng: 127.50398 },
    { region: 'seoul', lat: 37.57848, lng: 126.97589 }
  ]

  let el: HTMLElement
  let mapHandle: IMapSpec = undefined

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
        const { latitude: lat, longitude: lng } = state.pos.coords
        userPath.addPosition({ lat, lng } as IMapPos)
      }
    })
  }
  const stopSession = () => {
    userLocation.stop()
    unsub()
    unsub = undefined
  }

  let positionVisible = false
  const locationLoader = geo
    .requestPermission()
    .then((pos: GeolocationPosition) => pos)
  onMount(() => {
    // googleInstaller
    //   .installSdk(el, locationLoader, {
    //     lat: 35.110036569346555,
    //     lng: 129.10929084725
    //   })
    //   .then((handle) => {
    //     mapHandle = handle
    //     api.journey.get(1340).then((res) => {
    //       const journeyPath = mapHandle.createJourneyPath(
    //         new Journey(res.journey)
    //       )
    //     })
    //   })
    kakaoInstaller
      .installSdk(el, locationLoader, {
        lat: 35.110036569346555,
        lng: 129.10929084725
      })
      .then((handle) => {
        mapHandle = handle
        api.journey.get(1429).then((res) => {
          const journeyPath = mapHandle.createJourneyPath(
            new Journey(res.journey)
          )
        })
      })
  })
  onDestroy(() => {
    if (unsub) {
      unsub()
    }
    userLocation.stop()
    if ($session) {
      $session.close()
    }
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
