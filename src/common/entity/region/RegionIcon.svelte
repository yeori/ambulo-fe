<script lang="ts">
  import AppIcon from '@/common/AppIcon.svelte'
  import type { Region } from './Region.js'
  export let region: Region
  // your script goes here
</script>

<button class="nude region">
  <AppIcon type="custom" size="md" icon={region.getLogoUrl()} /><span
    >{region.shortName}</span
  >
</button>

<style lang="scss">
  .region {
    position: relative;
    display: flex;
    align-items: center;
    background-color: white;
    padding: 4px 8px;
    border-radius: 6px;
    column-gap: 6px;
    font-size: 1.1rem;
    box-shadow: 1px 1px 6px #0000004d;
  }
</style>
