<script lang="ts">
  import type { Festival } from './Festival.js'
  import { placeStore } from '../place/place-store.js'
  import AppIcon from '@/common/AppIcon.svelte'
  import { fade, fly } from 'svelte/transition'
  import AppButton from '@/common/form/AppButton.svelte'
  import type { Writable } from 'svelte/store'
  export let fv: Festival
  export let active: Writable<Festival>

  const showDetail = () => {
    placeStore.loadPlaceDetail(fv.place).then(() => {
      active.update(() => fv)
    })
  }
  const goToFestival = (e: MouseEvent) => {
    e.stopPropagation()
  }
</script>

<div class="fv" on:click={showDetail} on:keyup={showDetail}>
  <div class="desc">
    <h3><span>{fv.place.title}</span></h3>
    <div class="dur">
      <span class="date">{fv.endDate}까지</span>
    </div>
    {#if $active === fv}
      <div class="detail" in:fade={{ duration: 250 }}>
        {#each fv.place.getOverview() as para}
          <p>{para}</p>
        {/each}
      </div>
    {/if}
  </div>
  {#if $active === fv}
    <div class="region detail" in:fly={{ duration: 150, x: 250, delay: 150 }}>
      <AppButton theme="none" text="열기" size="sm" on:click={goToFestival} />
    </div>
  {:else}
    <div class="region" out:fly={{ duration: 150, x: -10 }}>
      <AppIcon
        type="custom"
        size="md"
        icon={placeStore.findRegion(fv.place).getLogoUrl()}
      /><span>{placeStore.findRegion(fv.place).shortName}</span>
    </div>
  {/if}

  <div
    class="img fg"
    style="background-image: url({fv.place.getThumbnail()});"
  />
</div>

<style lang="scss">
  .fv {
    width: 200px;
    height: 200px;
    margin: 4px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    .desc {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background: linear-gradient(180deg, black 30%, transparent 100%);
      color: white;
      padding: 8px 8px 24px;

      .detail {
        padding-bottom: 0;
        height: 100%;
      }
      h3 {
        font-weight: 600;
        font-size: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 6px;
      }
    }
    .region {
      position: absolute;
      right: 4px;
      bottom: 4px;
      display: flex;
      align-items: center;
      z-index: 1;
      background-color: white;
      padding: 4px 8px;
      border-radius: 6px;
      column-gap: 8px;
      font-size: 0.9rem;
      box-shadow: 1px 1px 6px #0000004d;
      &.detail {
        padding: 0;
      }
    }
    .img {
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;
      &.fg {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-size: cover;
        filter: drop-shadow(0px 0px 5px #0000004d);
      }
    }
  }
</style>
