<script lang="ts">
  export let height = '180px'
</script>

<section class="jmb" style="--jmb-height: {height}">
  <div class="container">
    <slot />
  </div>
</section>

<style lang="scss">
  .jmb {
    position: relative;
    overflow: hidden;
    padding-top: 50px;
    background-image: linear-gradient(180deg, #61c9fe 0%, #ffffff00 25%);
    height: var(--jmb-height, 180px);
    .container {
      padding: 0;
      height: 100%;
    }
  }
</style>
