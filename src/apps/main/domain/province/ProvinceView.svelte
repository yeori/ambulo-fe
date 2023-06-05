<script lang="ts">
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import journeyService from '@/common/entity/journey/JourneyService.js'
  import JourneyCardView from '@/common/entity/journey/JourneyCardView.svelte'
  import { fade } from 'svelte/transition'
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { TabModel } from '@/common/tab/tab-model.js'
  import TabNavView from '@/common/tab/TabNavView.svelte'
  import {
    PlacePagination,
    placeStore
  } from '@/common/entity/place/place-store.js'
  import PlaceCardView from '@/common/entity/place/PlaceCardView.svelte'
  import { uiState } from '../ui/index.js'
  import type { Province } from './Province.js'
  import { sheetStore } from '../../component/sheet/index.js'
  import AppButton from '@/common/form/AppButton.svelte'

  export let province: Province
  class TabNav {
    constructor(readonly id: string, readonly text: string) {}
  }

  const tabs = [
    new TabNav('route', '코스'),
    new TabNav('place', '관광지'),
    new TabNav('festival', '행사')
  ]

  const tabModel: TabModel<TabNav> = TabModel.create(
    tabs,
    (tab) => tab.id,
    (tab) => tab.text
  )
  let viewport = [0, 0]
  const dispatch = createEventDispatcher()

  let journeys: Journey[] = []
  let paging: PlacePagination = undefined

  const flyOption = { x: -150, duration: 450, opacity: 0.0 }
  $: {
    journeyService.findJourneysByRegion(province.region).then((elem) => {
      journeys = elem
    })
    placeStore.loadPlaces(undefined, province.region.regionName).then(() => {
      if (paging) {
        paging.reset(
          $placeStore.visibles.filter((place) => place.type !== 'P15')
        )
      }
    })
  }
  const unsub = uiState.subscribe((ui) => {
    const { scrollTop, scrollBottom } = ui
    viewport = [scrollTop, scrollBottom]
  })
  const updateTabBody = (e) => {
    const tab: TabNav = e.detail
    if (tab.id === 'place') {
      paging = placeStore.preparePagination((place) => place.type !== 'P15')
      setTimeout(() => {
        // cardview 렌더링 유도
        viewport = [...viewport]
      })
    } else {
      paging = undefined
      sheetStore.clear()
    }
  }
  onDestroy(() => {
    unsub()
    sheetStore.clear()
  })
</script>

<section in:fade={{ duration: 150 }}>
  <div class="container">
    <TabNavView model={tabModel} on:tab-change={updateTabBody} />
    <div class="row">
      {#if $tabModel.activeId === 'route'}
        {#if journeys.length === 0}
          <div class="col-12">
            <div class="none" />
            <p>이용 가능한 여정이 없습니다.</p>
          </div>
        {/if}
        {#each journeys as jr}
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <JourneyCardView
              journey={jr}
              on:click={() => dispatch('journey', jr)}
            />
          </div>
        {/each}
      {/if}
      {#if $tabModel.activeId === 'place'}
        {#each $paging.places as place (place.uuid)}
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <PlaceCardView {place} {viewport} />
          </div>
        {/each}
        {#if paging.hasNext()}
          <div class="more">
            <AppButton
              text="More"
              round="8px"
              on:click={() => paging.loadMore()}
            />
          </div>
        {/if}
      {/if}
      {#if $tabModel.activeId === 'festival'}
        {#each $placeStore.visibles.filter((p) => p.type === 'P15') as place (place.uuid)}
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <PlaceCardView {place} {viewport} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  section {
    // padding: 0 16px;

    .none {
      position: relative;
      height: 48vmin;
      background-image: url('/images/graphic/g00.svg');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    p {
      margin-top: 24px;
      font-size: 1.5rem;
      text-align: center;
    }
    .more {
      margin: 8px 0;
    }
  }
</style>
