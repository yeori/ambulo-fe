<script lang="ts">
  import type { DndEvent, IDndHandler } from '@/common/dnd/dnd.js'
  import type { Festival } from './Festival.js'
  import { type Writable, writable, get } from 'svelte/store'
  import Dnd from '@/common/dnd/Dnd.svelte'
  import util from '@/service/util/index.js'
  import FestivalThumbnail from './FestivalThumbnail.svelte'

  export let festivals: Festival[]

  const update = util.svelteStore.helpUpdate

  let scrollEl: HTMLElement

  let scrollX = 0
  let dragging: boolean = false

  let active: Writable<Festival> = writable(undefined)
  class ScrollHandler implements IDndHandler {
    relativeX: number = 0
    // range: number[]
    store: Writable<any>
    constructor() {
      this.store = writable({ range: [] })
    }
    subscribe(callback) {
      return this.store.subscribe(callback)
    }
    accept(elem: HTMLElement) {
      return elem.closest('.scrollable') === scrollEl
    }
    beforeDrag(e: DndEvent) {
      const { sx } = e
      const contentWidth = scrollEl.querySelector('ul').offsetWidth
      const viewportWidth = scrollEl.offsetWidth
      this.relativeX = sx - scrollX
      dragging = true
      update(this.store, (store) => {
        store.range = [0, viewportWidth - contentWidth]
      })
    }
    dragging(e: DndEvent) {
      scrollX = 2 * e.dx + e.sx - this.relativeX
      const { range } = get(this.store)
      if (scrollX > 0) {
        scrollX = 0
      }
      if (scrollX < range[1]) {
        scrollX = range[1]
      }
    }
    afterDrag(e: DndEvent) {
      setTimeout(() => {
        dragging = false
        console.log(';done')
      }, 1000)
    }
  }
  const scrollHandler = new ScrollHandler()

  const handleScroll = () => {
    // if (!dragging) {
    //   scrollHandler.relativeX = e.pageX - scrollX
    // }
    // dragging = true
    // clearTimeout(timer)
    // timer = setTimeout(() => {
    //   dragging = false
    //   console.log(';done')
    // }, 1000)
    // const { deltaY } = e
    // scrollX = deltaY - scrollHandler.relativeX
    // if (scrollX > 0) {
    //   scrollX = 0
    // }
    // const { range } = get(scrollHandler.store)
    // if (scrollX < range[1]) {
    //   scrollX = range[1]
    // }
  }
</script>

<div class="slide">
  <Dnd handler={scrollHandler}>
    <div
      slot="drag"
      class="scrollable"
      bind:this={scrollEl}
      on:wheel={handleScroll}
    >
      {#if scrollX < -30}
        <div class="shadow left" />
      {/if}
      {#if scrollX > $scrollHandler.range[1] + 30}
        <div class="shadow right" />
      {/if}
      <ul style="transform: translateX({scrollX}px)" class:dragging>
        {#each festivals as fv}
          <li>
            <FestivalThumbnail {fv} {active} />
          </li>
        {/each}
      </ul>
    </div>
  </Dnd>
</div>

<style lang="scss">
  .slide {
    overflow: hidden;
    width: 100%;
    border-radius: 8px;
    .scrollable {
      position: relative;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-drag: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      ul {
        display: table;
        list-style: none;
        transition-property: transform;
        transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
        transition-duration: 0ms;
        &.dragging {
          transition-duration: 1000ms;
        }

        li {
          display: table-cell;
        }
      }
      .shadow {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 40px;
        overflow: hidden;
        /* opacity: 0.5; */
        z-index: 5;
        &.left {
          left: 0;
          background-image: linear-gradient(
            270deg,
            transparent 0%,
            #e0e0e0 100%
          );
        }
        &.right {
          right: 0;
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            #e0e0e0 100%
          );
        }
      }
    }
  }
</style>
