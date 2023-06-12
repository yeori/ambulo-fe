<script lang="ts">
  import AppIcon from '@/common/AppIcon.svelte'
  import type { Region } from './Region.js'
  export let region: Region
  export let countFestival: (region: Region) => number
</script>

<div class="region" on:click on:keydown>
  <div
    class="imgview"
    style={`background-image: url(${region.getLogoUrl()})`}
  />
  <h4>{region.shortName}</h4>
  <p>
    <AppIcon icon="route" /> 코스 {#if region.isEmpty()}
      <span>없음</span>
    {:else}
      <span>{region.journeys.length}개</span>
    {/if}
  </p>
  <p>
    <AppIcon icon="festival" /> 행사 {#if countFestival}
      <span>{countFestival(region)}개</span>
    {/if}
  </p>
</div>

<style lang="scss">
  .region {
    position: relative;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 2px 2px 8px #00000026, 0px 0px 4px #00000020;
    background-color: white;
    cursor: pointer;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0px 0px 18px #0000002d;
    }
    h4 {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }
    p {
      display: flex;
      align-items: center;
      column-gap: 4px;
    }
    .imgview {
      position: absolute;
      background-position: 90% 50%;
      background-size: contain;
      width: 56px;
      height: 56px;
      top: 12px;
      right: 12px;
      z-index: 3;
      border-radius: 8px;
    }
  }
</style>
