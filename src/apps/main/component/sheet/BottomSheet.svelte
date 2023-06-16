<script lang="ts">
  import { fly } from 'svelte/transition'
  import Dnd from '@common/dnd/Dnd.svelte'
  import { DndEvent, type IDndHandler } from '@common/dnd/dnd.js'
  import { sheetStore } from './index.js'
  export let zIndex = 25

  let sheetEl: HTMLElement
  let innerEl: HTMLElement
  class DragHandler implements IDndHandler {
    innerHeight: number = 0
    height: number = 0
    maxHeight: number
    accept(el: HTMLElement) {
      return el.classList.contains('dh') && el.parentElement === sheetEl
    }
    beforeDrag(e: DndEvent) {
      this.innerHeight = innerEl.offsetHeight
      this.maxHeight = 200

      innerEl.style.height = `${this.innerHeight}px`
      innerEl.style['max-height'] = 'unset'
    }
    dragging(e: DndEvent) {
      this.height = this.innerHeight - e.dy
      innerEl.style.height = `${this.height}px`
    }
    afterDrag(e: DndEvent) {
      if (this.height < 180) {
        sheetStore.clear()
      }
    }
  }
</script>

<section
  style="--z-index: {zIndex}"
  transition:fly={{
    x: 0,
    y: 40,
    duration: 140
  }}
>
  <div class="container" bind:this={sheetEl}>
    <Dnd handler={new DragHandler()}>
      <div slot="drag" class="dh" />
    </Dnd>
    <div class="inner" bind:this={innerEl}>
      <slot />
    </div>
  </div>
</section>

<!-- markup (zero or more items) goes here -->

<style lang="scss">
  section {
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
    z-index: var(--z-index);

    div.container {
      box-shadow: 0 0 8px #0000004d, 0 0 1px #0000006d;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: white;
      padding: 0;
      // height: 100%;
    }
    .dh {
      height: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &::after {
        content: '';
        display: block;
        width: 48px;
        height: 6px;
        border-radius: 3px;
        background-color: #ccc;
      }
    }
    .inner {
      position: relative;
      top: 0px;
      height: 300px;
      overflow-y: auto;
    }
  }
</style>
