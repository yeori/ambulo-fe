<script lang="ts">
  // import SouthKoreaMap from '@/common/map/SouthKoreaMap.svelte'
  import BottomSheet from '../component/sheet/BottomSheet.svelte'
  import ProvinceView from '@main/domain/province/ProvinceView.svelte'
  import type { Province } from '@/apps/main/domain/province/province-store.js'
  import RegionSlideView from '@main/component/RegionSlideView.svelte'
  import { provinceStore } from '@main/domain/province/province-store.js'
  import { appConfigDao } from '@/common/entity/index.js'

  appConfigDao.isFirstOpen().then((firstOpen: boolean) => {
    console.log(firstOpen)
  })

  let activeProvince: Province
  const setActiveProvince = (e) => {
    activeProvince = e.detail
    $provinceStore.setActiveProvince(activeProvince)
  }
</script>

<section>
  <!-- <SouthKoreaMap on:province={setActiveProvince} /> -->
  <RegionSlideView on:province={setActiveProvince} />
  {#if activeProvince}
    <ProvinceView province={activeProvince} />
  {/if}
</section>

<style lang="scss">
  section {
    flex: 1 1 auto;
    .pad {
      height: 60px;
    }
  }
</style>
