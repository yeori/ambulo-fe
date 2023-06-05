<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { TabItem, TabModel } from './tab-model.js'
  export let model: TabModel<any>

  const dispatch = createEventDispatcher()
  const clicked = (item: TabItem<any>) => {
    model.selectItem(item)
    dispatch('tab-change', item.getData())
  }
</script>

<div class="tab-nav">
  {#each $model.items as item}
    <button
      class="nude"
      class:active={item.isActive()}
      on:click={() => clicked(item)}>{item.title}</button
    >
  {/each}
</div>

<style lang="scss">
  .tab-nav {
    button {
      &.active {
        background-color: #efefef;
      }
    }
  }
</style>
