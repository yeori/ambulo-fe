<script lang="ts">
  import page from 'page'
  import '../../assets/global.scss'
  import 'bootstrap/scss/bootstrap-grid.scss'
  import { MainPage, MapPage, LoginPage } from './page/index.js'
  import SplashView from './component/SplashView.svelte'
  import ToastView from '@/common/toast/ToastView.svelte'
  import MainNav from './component/nav/MainNav.svelte'
  import { fade } from 'svelte/transition'
  import { appConfigDao } from '../../common/entity/index.js'
  import { onMount } from 'svelte'
  import { Debounce } from '@/service/util/debounce.js'
  import { uiState } from '@main/domain/ui/index.js'

  // import Background from "./component/Background.svelte";
  // import LoginPage from "./page/LoginPage.svelte";

  let showSplash = undefined
  let routerView = MainPage

  // console.log(db)
  const initPagination = () => {
    page('/', () => (routerView = MainPage))
    page('/map', () => (routerView = MapPage))
    page('/login', () => (routerView = LoginPage))
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

<main class="abs-fill" transition:fade>
  {#if showSplash === true}
    <SplashView on:skip={() => (showSplash = false)} />
  {:else if showSplash === false}
    <div class="inner abs-fill" in:fade={{ duration: 150, delay: 350 }}>
      <MainNav />
      <svelte:component this={routerView} />
    </div>
  {/if}

  <ToastView />
</main>

<style lang="scss">
  main {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    .inner {
      z-index: 10;
    }
  }
</style>
