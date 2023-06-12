<script lang="ts">
  import { regionStore } from '@/common/entity/region/region-store.js'
  import RegionBadge from '@/common/badge/RegionBadge.svelte'
  import { getContext } from 'svelte'
  export let allowDisable: boolean = true
  const proivder = getContext('provider') as any
</script>

<section>
  {#each $regionStore.regions as region}
    <RegionBadge
      {allowDisable}
      {region}
      on:click={() => proivder.changeRegion(region)}
    />
  {/each}
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
</style>
