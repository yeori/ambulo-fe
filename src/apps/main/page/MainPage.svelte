<script lang="ts">
  import router from '@router'
  import { regionStore } from '@entity/region/region-store.js'
  import { journeyThemeStore } from '@entity/journey/journey-store.js'
  import AppLayout from '@/common/AppLayout.svelte'
  import { provinceStore } from '@main/domain/province/province-store.js'
  import { type Region } from '@/common/entity/region/Region.js'
  import RegionThumbnail from '@/common/entity/region/RegionThumbnail.svelte'
  import Jumbotron from '../component/nav/Jumbotron.svelte'
  import AppIcon from '@/common/AppIcon.svelte'
  import type { JourneyTheme } from '@/common/entity/journey/JourneyTheme.js'
  import { festivalStore } from '@/common/entity/festival/festival-store.js'
  import FestivalSlideView from '@/common/entity/festival/FestivalSlideView.svelte'
  import AppButton from '@/common/form/AppButton.svelte'
  // appConfigDao.isFirstOpen().then((firstOpen: boolean) => {
  //   // console.log(firstOpen)
  // })

  let festivalStat = undefined
  let countFestival = (region: Region) => {
    const { regionCode } = region
    return festivalStat[regionCode]
  }

  const gotoRegion = (region: Region) => {
    // if (region.isEmpty()) {
    //   return
    // }
    $provinceStore.setActiveRegion(region)
    router.push('/region')
  }
  const gotoTheme = (theme: JourneyTheme): void => {
    router.push(`/theme/${theme.seq}`)
  }
  festivalStore.loadSidoStats().then((stats) => {
    festivalStat = stats
  })

  let activeFestivals = []
  festivalStore.loadActiveFestivals().then((festivals) => {
    activeFestivals = festivals
  })
</script>

<main>
  <Jumbotron>
    <div class="ambulo">
      <h1>Ambulo</h1>
      <h5>도보 여행의 동반자</h5>
    </div>
  </Jumbotron>
  <section>
    <AppLayout>
      <div class="row boxes">
        <div class="col-sm-12">
          <h2>축제</h2>
        </div>
      </div>
      <div class="row boxes">
        <div class="col-12">
          <FestivalSlideView festivals={activeFestivals} />
        </div>
        <div class="col-12">
          <AppButton text="더보기" on:click={() => router.push('/festivals')} />
        </div>
      </div>
    </AppLayout>
  </section>
  <section>
    <AppLayout>
      <div class="row boxes">
        <div class="col-sm-12">
          <h2>테마별</h2>
        </div>
      </div>
      <div class="row boxes">
        {#key $journeyThemeStore.themes.length}
          {#each journeyThemeStore.getValidThemes() as journeyTheme}
            <div class="box col-sm-6 col-md-6 col-lg-4">
              <div
                class="theme"
                on:click={() => gotoTheme(journeyTheme)}
                on:keyup={() => gotoTheme(journeyTheme)}
              >
                <div
                  class="bg imgview"
                  style="background-image: url(/images/graphic/g02.jpg)"
                >
                  <h3>{journeyTheme.routeName}</h3>
                </div>
                <div class="desc">
                  <p>{journeyTheme.routeDesc}</p>
                  <p>
                    <AppIcon icon="route_400" /><span class="mg-r-1rem"
                      >{journeyTheme.journyes.length}코스</span
                    >
                    <AppIcon icon="straighten_400" /><span
                      >약 {journeyTheme.countDistance()}Km</span
                    >
                  </p>
                </div>
              </div>
            </div>
          {/each}
        {/key}
      </div>
    </AppLayout>
  </section>
  <section style="background: linear-gradient(236deg, #cb30bc5e 0%, #8cc5ff)">
    <AppLayout>
      <div class="row boxes">
        <div class="col-sm-12">
          <h2>지역별</h2>
        </div>
      </div>
      <div class="row boxes">
        {#each $regionStore.regions || [] as region}
          <div class="box col-6 col-sm-6 col-md-4 col-lg-3">
            <RegionThumbnail
              {region}
              countFestival={festivalStat ? countFestival : undefined}
              on:click={() => gotoRegion(region)}
            />
          </div>
        {/each}
      </div>
    </AppLayout>
  </section>
</main>

<style lang="scss">
  main {
    & > section {
      padding: 2rem 0;
      h2 {
        font-size: 1.8rem;
        margin-bottom: 16px;
      }
    }
    .boxes {
      // margin: 0;
      @media (max-width: 575px) {
        margin: 0;
      }
      .box {
        padding-bottom: calc(1.5rem * 0.8);
      }
      .theme {
        position: relative;
        height: 100%;
        box-shadow: 2px 2px 8px #00000026, 0px 0px 4px #00000020;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          transform: scale(1.02);
        }
        .bg {
          height: 120px;
          background-position: center bottom;
          background-size: cover;
          position: relative;
          h3 {
            background-color: rgb(0, 90, 187);
            color: white;
            position: absolute;
            padding: 6px 12px;
            left: 0;
            bottom: 0;
          }
        }
        .desc {
          padding: 12px;
          p {
            display: flex;
            align-items: center;
            column-gap: 4px;
          }
          p + p {
            margin-top: 8px;
          }
        }
      }
    }
  }
</style>
