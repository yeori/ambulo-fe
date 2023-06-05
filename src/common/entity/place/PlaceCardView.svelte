<script lang="ts">
  import ActionIcon from '@/common/ActionIcon.svelte'
  import type { Place } from './Place.js'
  import { sheetStore } from '@/apps/main/component/sheet/index.js'
  import PlaceDetailView from './PlaceDetailView.svelte'
  export let place: Place
  export let viewport = [0, 10000000]

  let placeEl: HTMLElement
  let done = false
  const renderThumbnail = (vp) => {
    if (!placeEl || done) {
      return
    }
    const { offsetTop, offsetHeight } = placeEl
    if (offsetTop <= vp[1] && offsetTop + offsetHeight >= vp[0]) {
      const imgs = placeEl.querySelectorAll(
        '.thumbnail .img'
      ) as NodeListOf<HTMLElement>
      imgs.forEach((el) => {
        el.style.backgroundImage = `url(${place.getThumbnail()})`
      })
      done = true
    }
  }
  const showPlaceInfo = () => {
    console.log(place)
    sheetStore.showSheet({ component: PlaceDetailView, props: { place } })
  }
  $: {
    renderThumbnail(viewport)
  }
</script>

<div class="place" data-place={place.uuid} bind:this={placeEl}>
  <div class="thumbnail">
    <div
      class="img bg"
      style="background-image: url(/images/graphic/g01.jpg)"
    />
    {#if done}
      <div
        class="img fg"
        style="background-image: url({place.getThumbnail()});"
      />
    {/if}
  </div>
  <h5>
    <span>{place.title}</span><ActionIcon
      icon="link"
      size="md"
      color="#0044ff"
      on:click={showPlaceInfo}
    />
  </h5>
  <div class="ctrl">
    <!--#dd0025-->
    <ActionIcon icon="favorite_on" size="md" shadow color="#cacaca" />
  </div>
</div>

<style lang="scss">
  .place {
    position: relative;
    background-color: #e3e3e3;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    overflow: hidden;
    .thumbnail {
      position: relative;
      height: 180px;
      overflow: hidden;
      .img {
        background-position: center;
        background-repeat: no-repeat;
        &.bg {
          background-size: cover;
          filter: blur(5px) grayscale(0.5);
          transform: scale(1.1);
          height: 100%;
        }
        &.fg {
          position: absolute;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          background-size: contain;
          filter: drop-shadow(0px 0px 5px #0000004d);
        }
      }
    }
    h5 {
      font-size: 1rem;
      padding: 2px 8px;
      display: flex;
      align-items: center;
    }
    .ctrl {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }
</style>
