<script lang="ts">
  import type { Province } from './province-store.js'
  // import AppIcon from '@/common/AppIcon.svelte'
  export let province: Province
</script>

<button class="nude shadow-1"><span>{province.name}</span></button>

<style lang="scss">
  .nude {
    display: inline-flex;
    align-items: center;
    column-gap: 8px;
    font-size: 16px;
    border-radius: 20px;
    padding: 0 12px;
  }
</style>
