<script lang="ts">
  import '../../assets/global.scss'
  import page from 'page'
  import { MainPage, LoginPage } from './page/index.js'
  import SplashView from './component/SplashView.svelte'
  // import Background from "./component/Background.svelte";
  // import LoginPage from "./page/LoginPage.svelte";

  let showSplash = true
  let routerView = MainPage
  page('/', () => (routerView = MainPage))
  page('/login', () => (routerView = LoginPage))
  page.start()

  setTimeout(() => (showSplash = false), 0)
</script>

<main class="abs-fill">
  {#if showSplash}
    <SplashView />
  {/if}
  <div class="inner abs-fill">
    <nav>nav</nav>
    <svelte:component this={routerView} />
  </div>
</main>

<style lang="scss">
  main {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    .inner {
      z-index: 10;

      nav {
        position: fixed;
        z-index: 100;
        top: 8px;
        left: 8px;
        right: 8px;
        height: 28px;
        background-color: #ffffffba;
        box-shadow: 2px 2px 4px #0000004d;
      }
    }
  }
</style>
