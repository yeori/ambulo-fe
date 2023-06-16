<script lang="ts">
  import page from 'page'
  import '../../assets/global.scss'
  import 'bootstrap/scss/bootstrap-grid.scss'
  import {
    MainPage,
    RegionPage,
    JourneyThemePage,
    MapPage,
    LoginPage,
    FestivalPage
  } from './page/index.js'
  import SplashView from './component/SplashView.svelte'
  import ToastView from '@/common/toast/ToastView.svelte'
  import GnbWrapper from './component/nav/GnbWrapper.svelte'
  import { fade } from 'svelte/transition'
  import { appConfigDao } from '../../common/entity/index.js'
  import { onMount } from 'svelte'
  import { Debounce } from '@/service/util/debounce.js'
  import { uiState } from '@main/domain/ui/index.js'
  import router from '@common/router/index.js'
  import { readyStore } from '@entity/index.js'
  import { sheetStore } from './component/sheet/index.js'
  import BottomSheet from './component/sheet/BottomSheet.svelte'
  import SlideMenuWrapper from './component/nav/menu/SlideMenuWrapper.svelte'
  import SearchPage from './page/SearchPage.svelte'

  let showSplash = undefined
  // console.log(db)
  const initPagination = () => {
    router.bind('/', MainPage)
    router.bind('/map', MapPage)
    router.bind('/region', RegionPage)
    router.bind('/login', LoginPage)
    router.bind('/theme/:themeId', JourneyThemePage)
    router.bind('/festivals', FestivalPage)
    page.start()
  }

  appConfigDao.isFirstOpen().then((first) => {
    showSplash = first
  })

  let debouncer: Debounce
  const handleScroll = (e) => {
    const { scrollTop, offsetHeight } = e.target
    uiState.updateScroll(scrollTop, scrollTop + offsetHeight)
  }

  onMount(() => {
    const appEl = document.querySelector('#app') as HTMLElement
    debouncer = new Debounce(appEl, 'scroll', handleScroll, 100)

    readyStore.subscribe((state) => {
      if (state.all) {
        setTimeout(initPagination, 100)
        // initPagination()
      }
    })
  })
</script>

<main transition:fade>
  {#if showSplash === true}
    <SplashView on:skip={() => (showSplash = false)} />
  {:else if showSplash === false}
    <div class="inner">
      <GnbWrapper {router} />
      {#if $uiState.leftMenu.visible}
        <SlideMenuWrapper />
      {/if}
      {#key $router.params}
        <svelte:component this={$router.component} />
      {/key}
    </div>
  {/if}
  {#if $sheetStore.activeSheet}
    <BottomSheet zIndex={$sheetStore.activeSheet.zIndex}>
      <svelte:component
        this={$sheetStore.activeSheet?.component}
        {...$sheetStore.activeSheet?.props}
      />
    </BottomSheet>
  {/if}
  {#if $uiState.search.visible}
    <SearchPage />
  {/if}
  <ToastView />
</main>

<style lang="scss">
  main {
    .inner {
      z-index: 10;
    }
  }
</style>
