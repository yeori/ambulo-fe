<script lang="ts">
  import { onMount } from 'svelte'
  import { Debounce } from '@/service/util/debounce.js'
  import ActionIcon from '../ActionIcon.svelte'
  import { searchUi } from '@/apps/main/domain/ui/SearchUI.js'
  import { uiState } from '@/apps/main/domain/ui/index.js'
  let inputEl: HTMLInputElement

  const detectEnter = (e: KeyboardEvent) => {
    const { isComposing, key, keyCode } = e
    if (keyCode == 229 || isComposing) {
      return
    }
    if (key === 'Enter') {
      const target = e.target as HTMLInputElement
      const keyword = target.value.trim()
      searchUi.search(keyword)
    }
  }
  const exit = () => {
    if (searchUi.hasKeyword()) {
      searchUi.clearKeyword()
    } else {
      uiState.setSearchVisible(false)
    }
  }
  onMount(() => {
    // new Debounce(inputEl, 'input', doSearch, 400)
  })
</script>

<section class="search">
  <input
    type="text"
    enterkeyhint="search"
    inputmode="search"
    bind:this={inputEl}
    value={$searchUi.keyword}
    on:keydown={detectEnter}
  />
  <ActionIcon class="close" icon="close" size="md" on:click={exit} />
</section>

<style lang="scss">
  .search {
    flex: 1 1 auto;
    display: flex;
    background-color: rgb(202, 236, 255);
    border-radius: 30px;
    align-items: center;
    padding: 0 6px;
    input {
      flex: 1 1 auto;
      outline: none;
      border: none;
      background-color: transparent;
      padding: 0 8px;
    }
    :global(.close) {
      background-color: #7ac2ff;
      width: 24px;
      height: 24px;
    }
  }
</style>
