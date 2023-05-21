<script>
  import { fly } from 'svelte/transition'
  // your script goes here
</script>

<section
  transition:fly={{
    x: 0,
    y: 40,
    duration: 140
  }}
>
  <div class="dh" />
  <div class="inner">
    <slot />
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
    background-color: white;
    box-shadow: 0 0 8px #0000004d, 0 0 1px #0000006d;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    .dh {
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
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
      padding: 8px 16px;
    }
  }
</style>
