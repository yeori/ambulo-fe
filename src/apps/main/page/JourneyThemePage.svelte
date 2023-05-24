<script lang="ts">
  import AppLayout from '@/common/AppLayout.svelte'
  import Jumbotron from '../component/nav/Jumbotron.svelte'
  import { journeyThemeStore } from '@entity/journey/journey-store.js'
  import type { JourneyTheme } from '@/common/entity/journey/JourneyTheme.js'
  import JourneyListView from '@/common/entity/journey/JourneyListView.svelte'
  import { uiState } from '@main/domain/ui/index.js'
  import { fly } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { mapStore } from '@main/component/map/map-store.js'
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import router from '@router'

  let journeyTheme: JourneyTheme = $journeyThemeStore.themes.find(
    (thm) => thm.seq === router.intParam('themeId')
  )

  const selectTheme = (theme) => {
    router.push('/theme/' + theme.seq)
  }
  const openJourneyMap = (e) => {
    console.log(e.detail)
    const journey = e.detail as Journey
    mapStore.setMapContext({
      themeSeq: journeyTheme.seq,
      journeySeq: journey.seq
    })
    router.push('/map')
  }
  onMount(() => {
    console.log('[params]', $router)
  })
</script>

<section>
  {#if $uiState.scrollTop >= 100}
    <div class="sticky" in:fly={{ y: -50, duration: 250, delay: 150 }}>
      <div class="container">
        <h3>{journeyTheme.routeName}</h3>
      </div>
    </div>
  {/if}
  <Jumbotron>
    <div class="intro">
      <div>
        <h1>{journeyTheme.routeName}</h1>
        <h5>{journeyTheme.routeDesc}</h5>
      </div>
      <div class="btns">
        {#each $journeyThemeStore.themes.filter((thm) => thm.seq > 1) as theme}
          <button on:click={() => selectTheme(theme)} class="nude"
            >{theme.routeName}</button
          >
        {/each}
      </div>
    </div>
  </Jumbotron>
  <AppLayout>
    {#if journeyTheme}
      <JourneyListView
        journeys={journeyTheme.journyes}
        on:journey={openJourneyMap}
      />
    {/if}
  </AppLayout>
</section>

<!-- markup (zero or more items) goes here -->

<style lang="scss">
  .sticky {
    position: fixed;
    left: 0;
    right: 0;
    top: 50px;
    height: 50px;
    z-index: 50;
    background-color: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3019607843),
      0 0 2px rgba(0, 0, 0, 0.5333333333);
    display: flex;
    align-items: center;
    .container {
      display: flex;
      align-items: center;
      h3 {
        flex: 1 1 auto;
      }
    }
  }
  section {
    .intro {
      height: 100%;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 8px;
    }
  }
</style>
