<script lang="ts">
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import journeyService from '@/common/entity/journey/JourneyService.js'
  import JourneyCardView from '@/common/entity/journey/JourneyCardView.svelte'
  import { fade } from 'svelte/transition'
  import { createEventDispatcher, onDestroy } from 'svelte'
  import TabNavView from '@/common/tab/TabNavView.svelte'
  import { placeStore } from '@/common/entity/place/place-store.js'
  import { festivalStore } from '@/common/entity/festival/festival-store.js'
  import PlaceCardView from '@/common/entity/place/PlaceCardView.svelte'
  import { uiState } from '../ui/index.js'
  import type { Province } from './Province.js'
  import { sheetStore } from '../../component/sheet/index.js'
  import AppButton from '@/common/form/AppButton.svelte'
  import { type TabData, regionTabModel } from '@/common/tab/tab-instance.js'
  import type { Festival } from '@/common/entity/festival/Festival.js'
  import { Place } from '@/common/entity/place/Place.js'
  import type { Pagination } from '@/service/pagination/Pagination.js'

  export let province: Province
  let viewport = [0, 0]
  const dispatch = createEventDispatcher()

  let journeys: Journey[] = []
  let paging: Pagination<Place | Festival> = undefined
  let activeTab: TabData
  const flyOption = { x: -150, duration: 450, opacity: 0.0 }
  $: {
    journeyService.findJourneysByRegion(province.region).then((elem) => {
      journeys = elem
    })
  }
  const unsub = uiState.subscribe((ui) => {
    const { scrollTop, scrollBottom } = ui
    viewport = [scrollTop, scrollBottom]
  })
  const asPlaces = (items: any[]) => items as Place[]
  const asFestivals = (items: any[]) => items as Festival[]
  const updateTabBody = (e) => {
    const tab: TabData = e.detail
    activeTab = tab
    paging = undefined
    if (tab.id === 'place') {
      placeStore.loadPlaces(undefined, province.region.regionName).then(() => {
        paging = placeStore.preparePagination((place) => place.type !== 'P15')
        setTimeout(() => {
          // cardview 렌더링 유도
          viewport = [...viewport]
        })
      })
    } else if (tab.id === 'festival') {
      festivalStore.loadFestivals(province.region.regionName).then(() => {
        paging = festivalStore.preparePagination()
      })
    } else {
      paging = undefined
      sheetStore.clear()
    }
  }
  const unsubTab = regionTabModel.subscribe(() => {
    updateTabBody({ detail: regionTabModel.getActiveData() })
  })
  onDestroy(() => {
    unsub()
    unsubTab()
    sheetStore.clear()
  })
</script>

<section in:fade={{ duration: 150 }}>
  <div class="container">
    <TabNavView model={regionTabModel} />
    <div class="row">
      {#if $regionTabModel.activeId === 'route'}
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
      {#if paging && $regionTabModel.activeId === 'place'}
        {#each asPlaces($paging.items) as place (place.uuid)}
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <PlaceCardView {place} {viewport} />
          </div>
        {/each}
        {#if paging.hasNext()}
          <div class="more">
            <AppButton
              text="+20"
              round="8px"
              on:click={() => paging.loadMore(20)}
            />
            <AppButton
              text="+50"
              round="8px"
              on:click={() => paging.loadMore(50)}
            />
          </div>
        {/if}
      {/if}
      {#if paging && $regionTabModel.activeId === 'festival'}
        {#each asFestivals($paging.items) as festival (festival.place.uuid)}
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <PlaceCardView
              place={festival.place}
              duration={festival}
              {viewport}
            />
          </div>
        {/each}
        {#if paging.hasNext()}
          <div class="more">
            <AppButton
              text="+20"
              round="8px"
              on:click={() => paging.loadMore(20)}
            />
            <AppButton
              text="+50"
              round="8px"
              on:click={() => paging.loadMore(50)}
            />
          </div>
        {/if}
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
