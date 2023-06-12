<script lang="ts">
  import ActionIcon from '@/common/ActionIcon.svelte'
  import type { Place } from './Place.js'
  import { sheetStore } from '@/apps/main/component/sheet/index.js'
  import PlaceDetailView from './PlaceDetailView.svelte'
  import type { Duration } from '../festival/Festival.js'
  import util from '@/service/util/index.js'
  import { onMount } from 'svelte'
  export let place: Place
  export let duration: Duration = undefined
  export let viewport = [0, 10000000]

  let placeEl: HTMLElement
  let done = false
  const isFestival = !!duration
  const now = util.time.ymd(new Date())
  const renderThumbnail = (vp, place) => {
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
    sheetStore.showSheet({
      component: PlaceDetailView,
      props: { place, isFestival }
    })
  }
  $: {
    renderThumbnail(viewport, place)
  }
  onMount(() => {
    renderThumbnail(viewport, place)
  })
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
    {#if isFestival}
      <div class="dur">
        <span
          class="status"
          class:expired={duration.compare(now) === 1}
          class:active={duration.compare(now) === -1}
          class:ready={duration.compare(now) === 0}
          >{duration.getStatus(now)}</span
        >
      </div>
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
  {#if isFestival}
    <h4>
      {#if duration.isOneDay()}
        <span class="date">{duration.start}</span>
      {:else if duration.isSameYear()}
        <span class="year">{duration.start.substring(0, 4)}</span><span
          class="md"
          ><span>{duration.start.substring(5)}</span> ~
          <span>{duration.end.substring(5)}</span></span
        >
      {:else}
        <span class="date">{duration.start}</span><span class="date"
          >{duration.end}</span
        >
      {/if}
    </h4>
  {/if}
  <div class="ctrl">
    <!--#dd0025-->
    <ActionIcon icon="favorite_on" size="md" shadow color="#cacaca" />
  </div>
</div>

<style lang="scss">
  .place {
    position: relative;
    background-color: #bcdaff;
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
      .dur {
        position: absolute;
        z-index: 5;
        top: 0;
        left: 0px;
        span {
          padding: 8px 8px;
          display: inline-flex;
          border-bottom-right-radius: 8px;
          font-size: 12px;
          &.expired {
            background-color: #efefef;
            color: #444;
          }
          &.active {
            background-color: #009708;
            color: white;
            font-weight: 600;
          }
          &.ready {
            background-color: #f8ff2a;
            color: rgb(87, 87, 87);
            font-weight: 600;
          }
        }
      }
    }
    h4 {
      padding: 0px 8px 8px;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      & > span {
        background-color: white;
        padding: 4px 4px;
        border-radius: 6px;
        &.year {
          margin-right: 8px;
        }
      }
    }
    h5 {
      font-size: 1rem;
      padding: 0px 8px;
      font-weight: 400;
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
