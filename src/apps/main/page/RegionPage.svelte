<script lang="ts">
  // import BottomSheet from '../component/sheet/BottomSheet.svelte'
  import router from '@router'
  import ProvinceView from '@main/domain/province/ProvinceView.svelte'
  import type { Province } from '@/apps/main/domain/province/Province.js'
  import RegionSlideView from '@main/component/RegionSlideView.svelte'
  import { provinceStore } from '@main/domain/province/province-store.js'
  import { mapStore } from '@main/component/map/map-store.js'
  import { appConfigDao } from '@/common/entity/index.js'
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import { sheetStore } from '../component/sheet/index.js'

  appConfigDao.isFirstOpen().then((firstOpen: boolean) => {
    console.log(firstOpen)
  })

  let activeProvince: Province
  const setActiveProvince = (e) => {
    activeProvince = e.detail
    $provinceStore.setActiveProvince(activeProvince)
    sheetStore.clear()
  }
  const openRegionMap = (e) => {
    const journey = e.detail as Journey
    mapStore.showRegion(journey, activeProvince.region).then(() => {
      router.push('/map')
    })
    // mapStore.setMapContext({
    //   regionSeq: $provinceStore.activeProvince.region.seq,
    //   journeySeq: journey.seq
    // })
    router.push('/map')
  }
</script>

<section>
  <!-- <SouthKoreaMap on:province={setActiveProvince} /> -->
  <RegionSlideView
    on:province={setActiveProvince}
    province={$provinceStore.activeProvince}
  />
  {#if activeProvince}
    <ProvinceView province={activeProvince} on:journey={openRegionMap} />
  {/if}
</section>

<style lang="scss">
</style>
