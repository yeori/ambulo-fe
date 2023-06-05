<script lang="ts">
  import type Picture from './Picture.js'
  export let pictures: Picture[] = []
</script>

<section>
  {#each pictures as pic}
    <div class="pic" style="background-image: url({pic.url})" />
  {/each}
</section>

<style lang="scss">
  section {
    display: flex;
    flex-wrap: wrap;
    .pic {
      flex: 1 1 25%;
      aspect-ratio: 1/1;
      background-position: center;
      background-size: cover;
    }
  }
</style>
