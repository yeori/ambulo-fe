<script lang="ts">
  import "../../assets/global.scss";
  import page from "page";
  import { MainPage, LoginPage } from "./page/index.js";
  import SplashView from "./component/SplashView.svelte";
  // import Background from "./component/Background.svelte";
  // import LoginPage from "./page/LoginPage.svelte";

  const showSplash = true;
  let routerView = MainPage;
  page("/", () => (routerView = MainPage));
  page("/login", () => (routerView = LoginPage));
  page.start();
</script>

<main class="abs-fill">
  {#if showSplash}
    <SplashView />
  {:else}
    <div class="inner abs-fill">
      <nav>nav</nav>
      <svelte:component this="{routerView}" />
    </div>
  {/if}
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
