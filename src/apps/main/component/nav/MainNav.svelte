<script lang="ts">
  import router from '@router'
  import AmbuloBadge from '@/common/AmbuloBadge.svelte'
  import userLocation from '../geolocation/user-location.js'
  import toast from '@/common/toast/index.js'
  import GeoPermissionView from '../GeoPermissionView.svelte'
  import { uiState } from '@main/domain/ui/index.js'
  import dgk from '@/service/api/dgk.js'
  import UserIcon from '@/common/entity/user/UserIcon.svelte'
  import ActionIcon from '@/common/ActionIcon.svelte'
  import SearchField from '@/common/search/SearchField.svelte'

  const goToMap = (path) => {
    router.push(path)
  }
  const gotoSearch = () => {
    router.push('/search')
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
  const doSearch = (e) => {
    console.log(e.detail)
  }
  const send = () => {
    dgk.getCode()
  }
</script>

<nav class:visible={$uiState.scrollTop >= 30 || $uiState.search.visible}>
  <div class="container">
    <div class="inner">
      <!-- {#if $provinceStore.activeProvince}
            {#key $provinceStore.activeProvince}
              <ProvinceBadge province={$provinceStore.activeProvince} />
            {/key}
          {:else}
            <h3>Ambulo</h3>
          {/if} -->
      {#if $uiState.search.visible}
        <ActionIcon
          icon="chevron_left_400"
          size="lg"
          on:click={() => uiState.setSearchVisible(false)}
        />
        <SearchField on:keyword={doSearch} />
      {:else}
        <AmbuloBadge on:click={() => uiState.setMenuVisible(true)} />
        <UserIcon />
        <ActionIcon
          class="btn"
          icon="search"
          size="md"
          on:click={() => uiState.setSearchVisible(true)}
        />
      {/if}
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
      padding: 8px;
      height: 50px;
    }
  }
</style>
