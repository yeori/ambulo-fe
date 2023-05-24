<script lang="ts">
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import journeyService from '@/common/entity/journey/JourneyService.js'
  import JourneyCardView from '@/common/entity/journey/JourneyCardView.svelte'
  import { fade } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let province

  let journeys: Journey[] = []
  const flyOption = { x: -150, duration: 450, opacity: 0.0 }
  $: {
    journeyService.findJourneysByRegion(province.region).then((elem) => {
      journeys = elem
    })
  }
</script>

{#key province}
  <section in:fade={{ duration: 150 }}>
    <div class="container">
      <div class="row">
        {#if journeys.length === 0}
          <div class="col-12">
            <div class="none" />
            <p>이용 가능한 여정이 없습니다.</p>
          </div>
        {/if}
        {#each journeys as jr}
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <JourneyCardView
              journey={jr}
              on:click={() => dispatch('journey', jr)}
            />
          </div>
        {/each}
      </div>
    </div>
  </section>
{/key}

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
