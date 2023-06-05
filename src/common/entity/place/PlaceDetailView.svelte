<script lang="ts">
  import Picture from '@/common/picture/Picture.js'
  import type { Place } from './Place.js'
  import { placeStore } from './place-store.js'
  import ActionIcon from '@/common/ActionIcon.svelte'
  import PictureGalleryView from '@/common/picture/PictureGalleryView.svelte'
  import { mapStore } from '@/apps/main/component/map/map-store.js'
  import MapView from '@/apps/main/component/map/MapView.svelte'
  export let place: Place

  type ViewType = 'info' | 'pic' | 'map'
  let viewType: ViewType = 'info'
  let pictures = []
  let detail = place.detail
  $: {
    place
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
    mapStore.showPlace(place)
    viewType = 'map'
  }
</script>

<section>
  <h3>
    <span class="title">{place.title}</span><ActionIcon
      icon="info"
      on:click={showInfo}
    /><ActionIcon icon="photo" on:click={showPhoto} /><ActionIcon
      icon="location_on"
      on:click={showLocation}
    />
  </h3>
  <div class="content">
    {#if viewType === 'info'}
      {#if detail}
        <div class="overview">
          {#each place.getOverview() as para}
            <p>{para}</p>
          {/each}
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
    height: 100%;
    h3 {
      position: sticky;
      top: 0;
      background-color: white;
      display: flex;
      align-items: center;
      .title {
        flex: 1 1 auto;
      }
    }
    .content {
      position: relative;
      flex: 1 1 auto;
      .overview {
        p {
          margin-bottom: 8px;
        }
      }
    }
  }
</style>
