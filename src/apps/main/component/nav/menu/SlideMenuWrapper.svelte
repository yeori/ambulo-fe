<script lang="ts">
  import { uiState } from '@main/domain/ui/index.js'
  import Dimmer from '@/common/Dimmer.svelte'
  import { fly } from 'svelte/transition'
  import UserInfoMenu from './item/UserInfoMenu.svelte'
  import HomeMenu from './item/HomeMenu.svelte'

  const closeMenu = () => {
    uiState.setMenuVisible(false)
  }
</script>

<div class="menu">
  <Dimmer on:click={closeMenu} />
  <div class="inner" transition:fly={{ duration: 150, x: -200 }}>
    <UserInfoMenu />
    <HomeMenu />
  </div>
</div>

<style lang="scss">
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
    .inner {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100%;
      width: 200px;
      z-index: 100;
      background-color: white;
      box-shadow: 0px 0px 16px #0000004d, 0 0 4px #0000002d;
    }
  }
</style>
