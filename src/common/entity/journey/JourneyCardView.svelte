<script lang="ts">
  import type { Journey } from './Journey.js'
  import { slide } from 'svelte/transition'
  import md from '@/common/md/index.js'
  export let journey: Journey
  export let descVisible: boolean = true

  let unfoldDesc = false

  const toggleDesc = () => {
    unfoldDesc = !unfoldDesc
  }
</script>

<section>
  <div
    class="bg imgview"
    style="background-image: url(/images/graphic/g01.jpg);"
  >
    <h3><span>{journey.name}</span></h3>
  </div>
  <div class="desc">
    {#if descVisible || unfoldDesc}
      <div class="markdown" in:slide|local={{ duration: 500 }}>
        {@html md.parse(journey.description)}
      </div>
    {:else}
      <div class="more">
        <button on:click={toggleDesc} class="nude blue">열기</button>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    margin-bottom: 24px;
    .bg {
      height: 120px;
      background-position: center bottom;
      background-size: cover;
      position: relative;
      h3 {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: brown;
        color: white;
        padding: 6px 12px;
      }
    }
    .desc {
      padding: 0 8px;
    }
  }
</style>
