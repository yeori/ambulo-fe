<script lang="ts">
  import router from '@router'
  import Jumbotron from '../component/nav/Jumbotron.svelte'
  import { TabData, festivalTabModel } from '@/common/tab/tab-instance.js'
  import TabNavView from '@/common/tab/TabNavView.svelte'
  import FestivalListView from '../domain/province/FestivalListView.svelte'
  import { onDestroy, setContext } from 'svelte'
  import { festivalStore } from '@/common/entity/festival/festival-store.js'
  import { Pagination } from '@/service/pagination/Pagination.js'
  import type { Festival } from '@/common/entity/festival/Festival.js'
  import { uiState } from '../domain/ui/index.js'
  import type { Region } from '@/common/entity/region/Region.js'
  import RegionSelectView from '../component/nav/RegionSelectView.svelte'
  import RegionBadge from '@/common/badge/RegionBadge.svelte'
  import { fly } from 'svelte/transition'
  import { sheetStore } from '../component/sheet/index.js'

  let activeTab: TabData

  let viewport = [0, 0]

  const unsubUiState = uiState.subscribe((ui) => {
    const { scrollTop, scrollBottom } = ui
    viewport = [scrollTop, scrollBottom]
  })
  const loadActiveFestivals = () => {
    return festivalStore.loadActiveFestivals().then((festivals) => {
      const pgn = new Pagination<Festival>(festivals, {
        pageIndex: 0,
        numOfRows: 10
      })
      return Promise.resolve(pgn)
    })
  }
  const toogleRegionBox = (visible) => {
    if (visible === undefined) {
      chooseRegion = !chooseRegion
    } else {
      chooseRegion = visible
    }
  }

  let chooseRegion: boolean = false
  let activeRegion: Region = undefined

  const loadFestivalsByRegion = () => {
    return festivalStore.loadFestivals(activeRegion.regionName).then((res) => {
      return festivalStore.preparePagination()
    })
  }
  const changeRegion = (region: Region) => {
    activeRegion = region
    toogleRegionBox(false)
  }
  const unsubTab = festivalTabModel.subscribe(() => {
    activeTab = festivalTabModel.getActiveData()
    toogleRegionBox(false)
    activeRegion = undefined
  })

  setContext<{
    changeRegion: (region: Region) => void
  }>('provider', {
    changeRegion
  })
  onDestroy(() => {
    unsubTab()
    unsubUiState()
    sheetStore.clear()
  })
</script>

<section>
  {#if $uiState.scrollTop >= 200}
    {#if activeRegion}
      <div class="sticky" in:fly={{ y: -50, duration: 250, delay: 150 }}>
        <div class="container">
          <RegionBadge
            allowDisable={false}
            region={activeRegion}
            on:click={() => toogleRegionBox(undefined)}
          />
          {#if chooseRegion}
            <div class="floating">
              <RegionSelectView allowDisable={false} />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
  <Jumbotron>
    <div class="jumbo">
      <h1>행사정보</h1>
    </div>
  </Jumbotron>
  <div class="container">
    <div class="row">
      <TabNavView model={festivalTabModel} size="sm" />
    </div>
    {#if activeTab.id === 'active'}
      <FestivalListView {viewport} paginator={loadActiveFestivals} />
    {/if}
    {#if activeTab.id === 'region'}
      <div class="search">
        {#if activeRegion}
          <RegionBadge
            allowDisable={false}
            region={activeRegion}
            on:click={() => toogleRegionBox(undefined)}
          />
        {/if}
        {#if chooseRegion && $uiState.scrollTop < 200}
          <div class="floating">
            <RegionSelectView allowDisable={false} />
          </div>
        {/if}
      </div>
      {#key activeRegion}
        {#if activeRegion}
          <FestivalListView {viewport} paginator={loadFestivalsByRegion} />
        {:else}
          <RegionSelectView allowDisable={false} />
        {/if}
      {/key}
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    .sticky {
      position: fixed;
      left: 0;
      right: 0;
      top: 50px;
      height: 50px;
      z-index: 50;
      background-color: white;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3019607843),
        0 0 2px rgba(0, 0, 0, 0.5333333333);
      display: flex;
      align-items: center;
      .container {
        display: flex;
        align-items: center;
        h3 {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          .name {
            margin-right: 6px;
          }
        }
      }
    }

    .search {
      position: relative;
      z-index: 15;
      margin: 8px 0;
    }
    .floating {
      position: absolute;
      top: 100%;
      // left: 0;
      // right: 0;
      transform: translateY(8px);
      max-width: 400px;
      padding: 8px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 0 6px #0000004d;
      .upper {
        position: relative;
        top: -8px;
        left: -8px;
      }
    }
  }
</style>
