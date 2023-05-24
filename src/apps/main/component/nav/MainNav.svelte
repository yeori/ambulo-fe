<script lang="ts">
  import page from 'page'
  import AmbuloBadge from '@/common/AmbuloBadge.svelte'
  import userLocation from '../geolocation/user-location.js'
  import toast from '@/common/toast/index.js'
  import GeoPermissionView from '../GeoPermissionView.svelte'
  import { provinceStore } from '@main/domain/province/province-store.js'
  import ProvinceBadge from '../../domain/province/ProvinceBadge.svelte'
  import { uiState } from '@main/domain/ui/index.js'

  const goToMap = (path) => {
    page(path)
  }
  const queryUserLocation = () => {
    userLocation.checkGeoPermission().then((res) => {
      // toast.info('dd: ' + res, 400000)
      toast.embed({
        component: GeoPermissionView,
        duration: 0
      })
    })
  }
</script>

<nav class:visible={$uiState.scrollTop >= 30}>
  <div class="container">
    <div class="inner">
      <AmbuloBadge on:click={() => goToMap('/')} />
      <!-- {#if $provinceStore.activeProvince}
            {#key $provinceStore.activeProvince}
              <ProvinceBadge province={$provinceStore.activeProvince} />
            {/key}
          {:else}
            <h3>Ambulo</h3>
          {/if} -->
    </div>
  </div>
</nav>

<style lang="scss">
  nav {
    position: fixed;
    z-index: 100;
    top: 0px;
    left: 0;
    right: 0;
    display: flex;
    column-gap: 8px;
    transition: background-color 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
    .container {
      padding: 0;
    }
    &.visible {
      background-color: white;
      box-shadow: 0 0 8px #0000004d, 0 0 2px #00000088;
    }

    // background-color: #ffffff;
    // box-shadow: 2px 2px 4px #0000004d;

    // padding: 4px;
    // border-radius: 40px;
    .inner {
      display: flex;
      padding: 8px 0;
      height: 50px;
    }
  }
</style>
