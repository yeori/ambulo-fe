<script lang="ts">
  import Picture from '@/common/picture/Picture.js'
  import type { Place } from './Place.js'
  import { placeStore } from './place-store.js'
  import ActionIcon from '@/common/ActionIcon.svelte'
  import PictureGalleryView from '@/common/picture/PictureGalleryView.svelte'
  import { mapStore } from '@/apps/main/component/map/map-store.js'
  import MapView from '@/apps/main/component/map/MapView.svelte'
  import RegionBadge from '@/common/badge/RegionBadge.svelte'
  import RegionIcon from '../region/RegionIcon.svelte'
  import type { Duration } from '../festival/Festival.js'
  import DurationView from '../festival/DurationView.svelte'
  import AppIcon from '@/common/AppIcon.svelte'
  export let place: Place
  export let isFestival: boolean
  export let duration: Duration = undefined

  type ViewType = 'info' | 'pic' | 'map'
  let viewType: ViewType = 'info'
  let pictures = []
  let detail = place.detail
  let contentEl: HTMLElement
  let resizing: ResizeObserver = undefined
  $: {
    showInfo()
  }

  const showInfo = () => {
    viewType = 'info'
    detail = undefined
    placeStore.loadPlaceDetail(place).then(() => {
      detail = place.detail
    })
  }
  const showPhoto = () => {
    placeStore.loadPhoto(place).then((res) => {
      viewType = 'pic'
      pictures = res.result.items.map((item) => new Picture(item.previewUrl))
    })
  }
  const showLocation = () => {
    mapStore.showPlace(place, isFestival)
    viewType = 'map'
  }
</script>

<section class:map={viewType === 'map'}>
  <h3>
    <span class="title">{place.title}</span><ActionIcon
      icon="info"
      on:click={showInfo}
    /><ActionIcon icon="photo" on:click={showPhoto} /><ActionIcon
      icon="location_on"
      on:click={showLocation}
    />
  </h3>
  <div class="region">
    <RegionIcon region={placeStore.findRegion(place)} />
    {#if isFestival}<DurationView {duration} /> {/if}
  </div>
  <div class="address">
    <button class="nude addr"
      >{#if detail}<span>{detail.getAddress()}</span>{/if}<AppIcon
        icon="content_copy"
      />
    </button>
  </div>
  <div class="content" bind:this={contentEl}>
    {#if viewType === 'info'}
      {#if detail}
        <div class="overview">
          {#each place.getOverview() as para}
            <p>{para}</p>
          {/each}
          {#if place.getOverview().length === 0}
            <span class="empty">설명없음</span>
          {/if}
        </div>
      {/if}
    {/if}
    {#if viewType === 'pic'}
      <PictureGalleryView {pictures} />
    {/if}
    {#if viewType === 'map'}
      <MapView spotVisible={false} />
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    padding: 0 8px 8px;
    position: relative;
    display: flex;
    flex-direction: column;
    &.map {
      height: 100%;
    }

    h3 {
      position: sticky;
      top: 0;
      background-color: white;
      display: flex;
      align-items: center;
      z-index: 1;
      .title {
        flex: 1 1 auto;
      }
    }
    .region {
      margin: 8px 0;
      display: flex;
      align-items: center;
      column-gap: 8px;
    }
    .address {
      margin-bottom: 8px;
      .nude.addr {
        font-size: 1rem;
        font-weight: 400;
        padding: 6px;
        background-color: #f1f1f1;
        display: flex;
        align-items: center;
        line-height: 0;
        border-radius: 8px;
        column-gap: 4px;
      }
    }
    .content {
      position: relative;
      flex: 1 1 auto;
      .overview {
        user-select: text;
        p {
          margin-bottom: 8px;
        }
        .empty {
          color: #010101;
          font-style: italic;
          background-color: #f0f0f0;
          padding: 4px 8px;
          display: inline-block;
          font-size: 12px;
        }
      }
    }
  }
</style>
