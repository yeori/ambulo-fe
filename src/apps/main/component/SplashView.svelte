<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import util from '../../../service/util/index.js'
  import { appConfigDao } from '@/common/entity/index.js'
  import AppButton from '@/common/form/AppButton.svelte'
  import api from '@/service/api/index.js'
  import { fly, fade } from 'svelte/transition'
  import LoadingView from '@/common/LoadingView.svelte'
  import journeyService from '@/common/entity/journey/JourneyService.js'
  import regionService from '@/common/entity/region/RegionService.js'
  const dispatch = createEventDispatcher()
  const names = ['bg000.jpg', 'bg001.jpg', 'bg002.jpg']

  let showInitButton = undefined
  let downloading = undefined
  const downloadAppData = () => {
    downloading = api.app
      .init()
      .then((res) => {
        /**
         * themes - 서해랑길, 해파랑길 등을 나타냄
         * journyes - themes에 속한 각각의 여정들
         * region - 시도광역시 목록
         */
        const { themes, journeys, regions } = res
        Promise.all([
          regionService.initRegions(regions),
          journeyService.initThemes(themes),
          journeyService.initJourneies(journeys)
        ]).then((res) => {
          appConfigDao.setInit()
          dispatch('skip')
        })
      })
      .catch((e) => {
        downloading = undefined
      })
  }
  setTimeout(() => {
    appConfigDao.isFirstOpen().then((first) => {
      if (!first) {
        dispatch('skip')
      } else {
        showInitButton = 'Y'
      }
    })
  }, 500)
</script>

<main class="abs-fill">
  <div
    transition:fade={{ duration: 250 }}
    class="bg"
    style={`background-image: url(/images/bg/${util.rand.pick(names)})`}
  />
  <h4>준비 중입니다</h4>
  <div class="ambulo abs-center">
    <h3 class="shadow">Ambulo</h3>
    <!-- <h5 class="shadow">ready to start</h5> -->
    {#if showInitButton === 'Y'}
      <div class="init" transition:fly={{ y: 100, duration: 250 }}>
        <div
          class="imgview"
          style="background-image: url(/images/graphic/g01.jpg)"
        />
        <p>앱을 시작하려면 경로 정보를 내려받아야 합니다.</p>
        {#if downloading}
          <LoadingView />
        {/if}
        <div class="footer">
          <AppButton on:click={downloadAppData} round="8px" text="내려받기" />
        </div>
      </div>
    {:else if showInitButton === 'N'}
      <button class="nude" on:click={() => dispatch('skip')}>시작</button>
    {/if}
  </div>
</main>

<style lang="scss">
  main {
    z-index: 1024;
    .bg {
      position: fixed;
      inset: 0;
      background-position: center;
      background-size: cover;
      z-index: 0;
      filter: grayscale(0.6);
    }
    h4 {
      position: fixed;
      top: 8vmin;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.15rem;
      background-color: white;
      padding: 6px 12px;
      border-radius: 120px;
      border: 1px solid #05548e;
      color: #05548e;
      box-shadow: 2px 2px 12px #004982c9, 1px 1px 2px #22395087;
    }
    .ambulo {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 4vmin;
      z-index: 10;
      width: 100%;
      max-width: 400px;
      h3 {
        font-size: 10vmin;
        font-family: 'Lato', sans-serif;
        margin: 0;
      }
      h5 {
        font-size: 5vmin;
        font-family: 'Lato', sans-serif;
        margin: 0;
      }
      .init {
        position: relative;
        background-color: white;
        // padding: 16px;
        border-radius: 8px;
        overflow: hidden;
        text-align: center;
        box-shadow: 4px 4px 24px #0000004d, 2px 2px 8px #0000004d;
        width: 92%;
        .imgview {
          height: 200px;
          background-size: cover;
          background-position: center bottom;
        }
        p {
          margin: 24px 0;
          padding: 0 24px;
        }
        .footer {
          margin: 24px 0;
        }
      }
    }
    .shadow {
      text-shadow: 1px 1px 1px #ffffff, -1px -1px 1px #ffffff,
        1px -1px 1px #ffffff, -1px 1px 1px #ffffff;
    }
  }
</style>
