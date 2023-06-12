<script lang="ts">
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import JourneyCardView from '@/common/entity/journey/JourneyCardView.svelte'
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  export let journeys: Journey[]

  const dispatch = createEventDispatcher()
  const flyOption = { x: -150, duration: 450, opacity: 0.0 }
</script>

<section in:fade={{ duration: 150 }}>
  {#if !journeys || journeys.length === 0}
    <p class="none">없음</p>
  {/if}
  <div class="row">
    {#each journeys as jr}
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
        <JourneyCardView
          journey={jr}
          on:click={() => dispatch('journey', jr)}
        />
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  section {
    padding: 0 16px;

    .none {
      position: relative;
      height: 48vmin;
      background-image: url('/images/graphic/g00.svg');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    p {
      margin-top: 24px;
      font-size: 1.5rem;
      text-align: center;
    }
  }
</style>
