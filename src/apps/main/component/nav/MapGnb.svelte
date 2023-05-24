<script lang="ts">
  import AmbuloBadge from '@/common/AmbuloBadge.svelte'
  import router from '@common/router/index.js'
  import { mapStore, type JourneyState } from '../map/map-store.js'
  import { onDestroy, setContext } from 'svelte'
  import { journeyStore } from '@/common/entity/journey/journey-store.js'
  import { regionStore } from '@/common/entity/region/region-store.js'
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import JourneyBadge from '@/common/badge/JourneyBadge.svelte'
  import DifficultyBadge from '@/common/badge/DifficultyBadge.svelte'
  import type { Region } from '@/common/entity/region/Region.js'
  import JourneyThemeSelect from './JourneyThemeSelect.svelte'
  import { fly } from 'svelte/transition'
  import type { JourneyTheme } from '@/common/entity/journey/JourneyTheme.js'
  import RegionBadge from '@/common/badge/RegionBadge.svelte'
  import RegionSelectView from './RegionSelectView.svelte'

  const floatingBox = {
    visible: false,
    left: 0,
    width: 0,
    component: undefined
  }
  const goToMap = (path: string) => {
    router.push(path)
  }
  let journey: Journey = undefined
  let region: Region = undefined

  const toggleThemePopup = (e, comp) => {
    const el = e.currentTarget as HTMLElement

    const { component, visible } = floatingBox
    if (!component || component === comp) {
      floatingBox.visible = !visible
    }
    if (floatingBox.visible) {
      const rect = el.getBoundingClientRect()
      floatingBox.left = rect.left
      floatingBox.width = rect.width
      floatingBox.component = comp
    } else {
      floatingBox.component = undefined
    }
  }
  const changeTheme = (theme: JourneyTheme) => {
    floatingBox.visible = false
    mapStore.showJouneyTheme(theme.journyes[0], theme)
  }
  const changeRegion = (region: Region) => {
    mapStore.showRegion(region.journeys[0], region)
  }
  const unsub = mapStore.subscribe((store) => {
    const { journeySeq, regionSeq } = store
    journey = journeyStore.findJourney((jr) => jr.seq === journeySeq)
    region = regionStore.findRegion((rgn) => rgn.seq === regionSeq)
  })

  setContext<{
    changeTheme: (theme: JourneyTheme) => void
    changeRegion: (region: Region) => void
  }>('provider', {
    changeTheme,
    changeRegion
  })

  onDestroy(unsub)
</script>

<nav>
  <AmbuloBadge on:click={() => goToMap('/')} />
  {#key $regionStore}
    {#if region}
      <RegionBadge
        {region}
        on:click={(e) => toggleThemePopup(e, RegionSelectView)}
      />
    {/if}
  {/key}
  {#if journey}
    <JourneyBadge
      {journey}
      on:click={(e) => toggleThemePopup(e, JourneyThemeSelect)}
    />
    <DifficultyBadge {journey} />
  {/if}
  {#if floatingBox.visible}
    <div
      transition:fly={{ duration: 150, y: -20, opacity: 0 }}
      class="floating-box"
      style="left: {floatingBox.left}px;width: {floatingBox.width}px;"
    >
      <svelte:component this={floatingBox.component} on:theme={changeTheme} />
    </div>
  {/if}
</nav>

<style lang="scss">
  nav {
    position: fixed;
    z-index: 100;
    top: 0px;
    left: 0;
    right: 0;
    display: flex;
    column-gap: 8px;
    height: 40px;
    transition: background-color 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);

    display: flex;
    align-items: center;
    &.visible {
      background-color: white;
      box-shadow: 0 0 8px #0000004d, 0 0 2px #00000088;
    }
    .floating-box {
      position: absolute;
      top: 100%;
      left: 42px;
    }
  }
</style>
