<script lang="ts">
  import type { Region } from '@entity/region/Region.js'
  export let region: Region
  export let allowDisable: boolean = true
</script>

<button
  class="nude region"
  disabled={allowDisable && region.journeys.length === 0}
  on:click
>
  <span
    class="logo"
    style="background-image: url({region.getLogoUrl()})"
  /><span class="name">{region.shortName}</span>
</button>

<style lang="scss">
  button.nude {
    display: flex;
    align-items: center;
    column-gap: 4px;
    padding: 0;
    border-radius: 28px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 0 2px #0000008d, 1px 1px 8px #0000004d;
    font-size: 12px;
    .logo {
      width: 28px;
      height: 20px;
      border-radius: 28px;
      margin: 4px 0 4px 8px;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
    .name {
      padding-right: 12px;
    }
  }
</style>
