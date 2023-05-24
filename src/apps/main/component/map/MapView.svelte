<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import { onDestroy, onMount } from 'svelte'
  import userLocation, {
    locationStore
  } from '@/apps/main/component/geolocation/user-location.js'
  import { AmbuloSession } from '@main/session/AmbuloSession.js'
  import type { Unsubscriber } from 'svelte/store'
  import type { IMapPos, IMapSpec } from './IMapSpec.js'
  import googleInstaller from './google/index.js'
  import kakaoInstaller from './kakao/index.js'
  import { mapStore } from './map-store.js'

  const DEFAULT_PLACES = [
    { region: 'busan', lat: 35.10077, lng: 129.03376 },
    { region: 'suncheon', lat: 34.92809, lng: 127.50398 },
    { region: 'seoul', lat: 37.57848, lng: 126.97589 }
  ]

  const shapeStore = writable([] as any[])
  const mapContext = mapStore.getMapContext()

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

  const themeClicked = (elem) => {
    // console.log(elem)
    mapContext.on('click', elem)
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
    /*
    {
        lat: 35.110036569346555,
        lng: 129.10929084725
      }
      */
    kakaoInstaller.installSdk(el, locationLoader).then((handle) => {
      mapHandle = handle
      const pos = mapHandle.createPosition(mapContext.getInitialPos())
      mapHandle.render(pos, 6)
      mapContext.installMapDriver(mapHandle, shapeStore)
      mapContext.start()
    })
  })
  onDestroy(() => {
    if (unsub) {
      unsub()
    }
    mapContext.dispose()
    userLocation.stop()
    if ($session) {
      $session.close()
    }
  })
</script>

<section class="abs-fill">
  <div class="shape-holder">
    {#each $shapeStore as shape (shape.id)}
      <div
        id={shape.id}
        class="shape jrtheme start theme-{shape.data
          .themeRef} {shape.data.getDifficultyText()}"
        on:click={() => themeClicked(shape)}
        on:keyup={() => themeClicked(shape)}
      >
        <h5><span>{shape.data.getMinifiedName()}</span></h5>
      </div>
    {/each}
  </div>
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
    .shape-holder {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      top: -1;
      left: -1;
    }
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
