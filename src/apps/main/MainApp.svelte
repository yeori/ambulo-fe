<script lang="ts">
  import page from 'page'
  import '../../assets/global.scss'
  import 'bootstrap/scss/bootstrap-grid.scss'
  import {
    MainPage,
    RegionPage,
    JourneyThemePage,
    MapPage,
    LoginPage
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

  let showSplash = undefined
  // console.log(db)
  const initPagination = () => {
    router.bind('/', MainPage)
    router.bind('/map', MapPage)
    router.bind('/region', RegionPage)
    router.bind('/login', LoginPage)
    router.bind('/theme/:themeId', JourneyThemePage)
    page.start()
  }
  initPagination()

  appConfigDao.isFirstOpen().then((first) => {
    showSplash = first
  })

  let debouncer: Debounce
  const handleScroll = (e) => {
    uiState.updateScroll(e.target.scrollTop)
  }

  onMount(() => {
    const appEl = document.querySelector('#app') as HTMLElement
    debouncer = new Debounce(appEl, 'scroll', handleScroll, 10)
  })
</script>

<main transition:fade>
  {#if showSplash === true}
    <SplashView on:skip={() => (showSplash = false)} />
  {:else if showSplash === false}
    <div class="inner" in:fade={{ duration: 150, delay: 350 }}>
      <GnbWrapper {router} />
      {#key $router.params}
        <svelte:component this={$router.component} {router} />
      {/key}
    </div>
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
