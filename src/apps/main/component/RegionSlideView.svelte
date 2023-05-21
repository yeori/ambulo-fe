<script lang="ts">
  import {
    Province,
    provinceStore
  } from '@/apps/main/domain/province/province-store.js'
  import type { Journey } from '@/common/entity/journey/Journey.js'
  import journeyService from '@/common/entity/journey/JourneyService.js'
  import regionService from '@/common/entity/region/RegionService.js'
  import { liveQuery } from 'dexie'
  import { createEventDispatcher, onDestroy } from 'svelte'
  import ActionIcon from '@/common/ActionIcon.svelte'
  import AppIcon from '@/common/AppIcon.svelte'
  import { uiState } from '@main/domain/ui/index.js'
  import { fade, fly } from 'svelte/transition'
  import util from '@/service/util/index.js'
  const dispatch = createEventDispatcher()

  const regions = liveQuery(() => regionService.findRegions())
  let provinceIndex = 7
  let activeProvince: Province = undefined
  let journeys: Journey[] = []

  const flyOption = { x: -150, duration: 450, opacity: 0.0 }
  const loadJourneys = (province) => {
    journeyService.findJourneysByRegion(province.region).then((elems) => {
      journeys = elems
      dispatch('province', activeProvince)
    })
  }
  const pickRandom = (delta) => {
    const { length } = $provinceStore.provinces
    provinceIndex = (length + provinceIndex + delta) % length
    activeProvince = $provinceStore.provinces[provinceIndex]
    if (delta > 0) {
      flyOption.x = 16
    } else {
      flyOption.x = -16
    }
    loadJourneys(activeProvince)
  }

  const logoUrl = (province) => {
    const code = province.region.regionCode
    const ext = code === 'sejong' ? 'jpg' : code === 'gwangju' ? 'png' : 'svg'
    return `/images/logo/logo-${code}.${ext}`
  }

  const unsub = regions.subscribe(() => {
    provinceIndex = util.rand.nextInt($provinceStore.provinces.length)
    pickRandom(0)
  })

  onDestroy(() => {
    unsub.unsubscribe()
  })
</script>

{#if $uiState.scrollTop >= 100}
  <div class="sticky" in:fly={{ y: -50, duration: 250, delay: 150 }}>
    <div class="container">
      <h3>
        <span class="name">{activeProvince.name}</span>
      </h3>
      <ActionIcon
        on:click={() => pickRandom(-1)}
        icon="chevron_left_400"
      /><ActionIcon on:click={() => pickRandom(1)} icon="chevron_right_400" />
    </div>
  </div>
{/if}
<section>
  <div class="container">
    <div class="row">
      <div class="col-12">
        {#if activeProvince}
          <div class="region">
            {#key activeProvince}
              <div
                class="bg-logo"
                style={`background-image: url(${logoUrl(activeProvince)})`}
              />
              <div
                in:fly|local={flyOption}
                out:fade={{ duration: 0 }}
                class="imgview"
                style={`background-image: url(${logoUrl(activeProvince)})`}
              />
            {/key}
            <h3>
              <span class="name">{activeProvince.name}</span><ActionIcon
                on:click={() => pickRandom(-1)}
                size="md"
                icon="chevron_left_400"
              /><ActionIcon
                size="md"
                on:click={() => pickRandom(1)}
                icon="chevron_right_400"
              />
            </h3>
            <ul>
              <li>
                <AppIcon icon="route" />{#if journeys.length > 0}<span
                    >{journeys.length}개</span
                  >{:else}<span>경로가 없습니다.</span>{/if}
              </li>
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

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
    position: relative;
    overflow: hidden;
    padding-top: 50px;
    background-image: linear-gradient(180deg, #61c9fe 0%, #ffffff00 25%);
    // box-shadow: 0 0 12px #0000006d, 0 1px 2px #0000002d;

    .region {
      position: relative;
      height: 172px;
      padding: 16px;

      .imgview {
        position: absolute;
        background-position: 90% 50%;
        background-size: contain;
        width: 92px;
        height: 92px;
        top: 16px;
        right: 16px;
        z-index: 3;
      }
      h3 {
        display: flex;
        align-items: center;
        .name {
          font-size: 2rem;
          font-weight: 900;
        }
      }
      ul {
        margin-top: 16px;
        li {
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
