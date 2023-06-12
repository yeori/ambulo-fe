<script lang="ts">
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import journeyService from '@/common/entity/journey/JourneyService.js'
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import TabNavView from '@/common/tab/TabNavView.svelte'
  import { uiState } from '../ui/index.js'
  import type { Province } from './Province.js'
  import { sheetStore } from '../../component/sheet/index.js'
  import { type TabData, regionTabModel } from '@/common/tab/tab-instance.js'
  import JourneyListView from '@/common/entity/journey/JourneyListView.svelte'
  import TourSiteView from './TourSiteView.svelte'
  import FestivalListView from './FestivalListView.svelte'

  export let province: Province
  let viewport = [0, 0]

  let journeys: Journey[] = []
  let activeTab: TabData

  const unsub = uiState.subscribe((ui) => {
    const { scrollTop, scrollBottom } = ui
    viewport = [scrollTop, scrollBottom]
  })
  const updateTabBody = (e) => {
    activeTab = e.detail
    sheetStore.clear()
  }
  const unsubTab = regionTabModel.subscribe(() => {
    updateTabBody({ detail: regionTabModel.getActiveData() })
  })

  const loadJourney = (province: Province) => {
    journeyService.findJourneysByRegion(province.region).then((elem) => {
      journeys = elem
    })
  }
  $: {
    loadJourney(province)
  }

  onDestroy(() => {
    unsub()
    unsubTab()
    sheetStore.clear()
  })
</script>

<section in:fade={{ duration: 150 }}>
  <div class="container">
    <TabNavView model={regionTabModel} />
    {#if activeTab.id === 'route'}
      <JourneyListView {journeys} on:journey />
    {/if}
    {#if activeTab.id === 'place'}
      <TourSiteView {province} {viewport} />
    {/if}
    {#if activeTab.id === 'festival'}
      <FestivalListView {province} {viewport} />
    {/if}
  </div>
</section>

<style lang="scss">
</style>
