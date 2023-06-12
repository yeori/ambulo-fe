<script lang="ts">
  import type { Pagination } from '@/service/pagination/Pagination.js'
  import type { Province } from './Province.js'
  import type { Place } from '@/common/entity/place/Place.js'
  import AppButton from '@/common/form/AppButton.svelte'
  import PlaceCardView from '@/common/entity/place/PlaceCardView.svelte'
  import { placeStore } from '@/common/entity/place/place-store.js'
  import { fade } from 'svelte/transition'

  export let province: Province
  export let viewport
  let paging: Pagination<Place> = undefined

  const updateViewport = () => {
    setTimeout(() => {
      viewport = [...viewport]
    })
  }
  const doPgn = (province: Province) => {
    paging = undefined
    placeStore.loadPlaces(undefined, province.region.regionName).then(() => {
      paging = placeStore.preparePagination((place) => place.type !== 'P15')
    })
  }
  $: {
    doPgn(province)
  }
</script>

{#if paging}
  <div class="row" in:fade={{ duration: 150 }} on:introend={updateViewport}>
    {#each $paging.items as place (place.uuid)}
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
        <PlaceCardView {place} {viewport} />
      </div>
    {/each}
    {#if paging.hasNext()}
      <div class="more">
        <AppButton
          text="+20"
          round="8px"
          on:click={() => paging.loadMore(20)}
        />
        <AppButton
          text="+50"
          round="8px"
          on:click={() => paging.loadMore(50)}
        />
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .more {
    margin: 8px 0;
  }
</style>
