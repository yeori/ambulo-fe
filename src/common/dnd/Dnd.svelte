<script lang="ts">
  import { onMount } from 'svelte'
  import { DndEvent, type IDndHandler } from './dnd.js'

  export let handler: IDndHandler
  const beforeDrag = (_) => {}
  const dragging = (_) => {}
  const afterDrag = (_) => {}

  onMount(() => {
    if (handler) {
      if (!handler.beforeDrag) handler.beforeDrag = beforeDrag
      if (!handler.dragging) handler.dragging = dragging
      if (!handler.afterDrag) handler.afterDrag = afterDrag
    }
  })
  const convToMouseEvent = (te) => {
    let touch = te.touches[0]
    if (te.type === 'touchend') {
      touch = te.changedTouches[0]
    }
    te.clientX = touch.clientX
    te.clientY = touch.clientY
    te.layerX = 0
    te.layerY = 0
    te.offsetX = 0
    te.offsetY = 0
    te.pageX = touch.pageX
    te.pageY = touch.pageY
    te.screenX = touch.screenX
    te.screenY = touch.screenY
  }
  const ctx = {
    touchTimer: undefined,
    dragging: undefined
  }
  const ghost = {
    el: null,
    init() {
      const div = (this.el = document.createElement('DIV'))
      div.style.position = 'fixed'
      div.style['z-index'] = 10000
      div.style.display = 'none'
      div.style['pointer-events'] = 'none'
      document.body.append(div)
      return div
    },
    clear() {
      if (this.el) {
        this.el.remove()
        this.el = null
      }
    }
  }
  const clearTouchTimer = () => {
    clearTimeout(ctx.touchTimer)
    ctx.touchTimer = null
  }
  const mousedown = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!handler.accept(target)) {
      return
    }
    // document.querySelector('body').style.cursor = 'e-resize'
    ctx.dragging = new DndEvent(target, e)
    handler.beforeDrag(ctx.dragging)
  }
  const mousemove = (e: MouseEvent) => {
    if (ctx.dragging) {
      e.preventDefault()
      ctx.dragging.update(e)
      // ctx.dragging.ghost.style.display = 'block'
      handler.dragging(ctx.dragging)
    }
  }
  const mouseup = (e) => {
    if (ctx.dragging) {
      ctx.dragging.update(e)
      handler.afterDrag(ctx.dragging)
      ctx.dragging = undefined
    }
    /*
    document.querySelector('body').style.cursor = ''
    try {
      ghost.clear()
      if (ctx.dragging) {
        afterDrag(ctx.dragging)
      }
    } catch (e) {
      console.log('[DND error]', e)
    } finally {
      ctx.dragging = null
    }
    */
  }
  const touchstart = (e) => {
    ctx.touchTimer = setTimeout(() => {
      convToMouseEvent(e)
      mousedown(e)
    }, 0)
  }
  const touchmove = (e) => {
    clearTouchTimer()
    convToMouseEvent(e)
    mousemove(e)
  }
  const touchend = (e) => {
    clearTouchTimer()
    convToMouseEvent(e)
    mouseup(e)
  }
</script>

<slot name="drag" />

<svelte:window
  on:mousedown={mousedown}
  on:mousemove={mousemove}
  on:mouseup={mouseup}
  on:touchstart={touchstart}
  on:touchmove|nonpassive={touchmove}
  on:touchend={touchend}
/>

<style lang="scss">
  .ghost {
    position: fixed;
    z-index: 1000;
  }
</style>
