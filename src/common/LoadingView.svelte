<script lang="ts">
  import { fade } from 'svelte/transition'

  export let delay = 1300
  let visible = false
  setTimeout(() => {
    visible = true
  }, delay)
</script>

<div>
  {#if visible}
    <p transition:fade={{ duration: 100 }}>LOADING...</p>
  {/if}
</div>

<style lang="scss">
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff8d;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      font-weight: 600;
      color: #777;
      font-size: 1.5rem;
    }
  }
</style>
