<script lang="ts">
  import type { Pagination } from '@/service/pagination/Pagination.js'
  import type { Province } from './Province.js'
  import AppButton from '@/common/form/AppButton.svelte'
  import PlaceCardView from '@/common/entity/place/PlaceCardView.svelte'
  import type { Festival } from '@/common/entity/festival/Festival.js'
  import { fade } from 'svelte/transition'

  // export let province: Province
  export let viewport
  export let paginator: () => Promise<Pagination<Festival>>

  let paging: Pagination<Festival> = undefined
  const doPgn = () => {
    paginator().then((pgn) => {
      paging = pgn
    })
  }
  $: {
    doPgn()
  }
</script>

{#if paging}
  <div class="row" in:fade={{ duration: 150 }}>
    {#each $paging.items as festival (festival.place.uuid)}
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
        <PlaceCardView place={festival.place} duration={festival} {viewport} />
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
