<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { TabItem, TabModel } from './tab-model.js'
  export let model: TabModel<any>
  export let size: 'sm' | 'md' = 'md'

  const dispatch = createEventDispatcher()
  const clicked = (item: TabItem<any>) => {
    model.selectItem(item)
    dispatch('tab-change', item.getData())
  }
</script>

<div class="tab-nav">
  {#each $model.items as item}
    <button
      class="nude {size}"
      class:active={item.isActive()}
      on:click={() => clicked(item)}>{item.title}</button
    >
  {/each}
</div>

<style lang="scss">
  .tab-nav {
    button {
      &.active {
        color: #0274e9;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 3px;
          background-color: #0274e9;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      &.sm {
        padding: 4px 8px;
        font-size: 1rem;
      }
      &.md {
        padding: 6px 12px;
        font-size: 1.2rem;
      }
    }
  }
</style>
