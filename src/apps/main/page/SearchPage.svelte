<script lang="ts">
  import AppButton from '@/common/form/AppButton.svelte'
  import { searchUi } from '../domain/ui/SearchUI.js'
  import AppLayout from '@/common/AppLayout.svelte'
  import { onDestroy, onMount } from 'svelte'
  import PlaceDetailView from '@/common/entity/place/PlaceDetailView.svelte'
  import type { SearchItem } from '@/common/entity/search/SearchResult.js'
  import api from '@/service/api/index.js'
  import { sheetStore } from '../component/sheet/index.js'

  let searchEl: HTMLElement
  let keyword = undefined
  let unsubSearch
  const typeText = {
    SPOT: '관광',
    CULTURE: '문화',
    FESTIVAL: '행사',
    JRN: '경로'
  }
  const searchMore = (size: number) => {
    searchUi.searchMore(size)
  }

  const loadDetail = (item: SearchItem) => {
    const { cate, uuid } = item
    api.search.detail(cate, uuid).then((res) => {
      const { cate, entity } = res
      if (cate === 'PLC') {
        sheetStore.showSheet({
          zIndex: 100,
          component: PlaceDetailView,
          props: { place: entity, isFestival: false, duration: undefined }
        })
      }
    })
  }

  onMount(() => {
    unsubSearch = searchUi.subscribe((state) => {
      if (keyword !== state.keyword) {
        searchEl.scrollTo(0, 0)
      }
      keyword = state.keyword
    })
  })
  onDestroy(() => {
    if (unsubSearch) {
      unsubSearch()
    }
  })
</script>

<div class="fixed" bind:this={searchEl}>
  <AppLayout>
    <section>
      <h3 class="kw">
        <span class="word">{$searchUi.keyword}</span>{#if $searchUi.page}<span
            class="cnt">{$searchUi.page.end} / {$searchUi.page.totalItems}</span
          >{/if}
      </h3>
      {#if $searchUi.results.length > 0}
        {#each $searchUi.results as result (result.id)}
          <div class="res">
            {#each result.items as item (item.itemId)}
              <article class="search">
                <h4>
                  <span class="type {item.type.toLowerCase()}"
                    >{typeText[item.type]}</span
                  >
                  <span>{item.title}</span>
                  <AppButton
                    text="OPEN"
                    size="sm"
                    on:click={() => loadDetail(item)}
                  />
                </h4>
                <p>{item.getOverview()}</p>
              </article>
            {/each}
            <div class="stat">
              <span>{result.page.end}</span> /
              <span>{result.page.totalItems}</span>
            </div>
          </div>
        {/each}
        {#if $searchUi.moreSearch}
          <div class="pgn">
            <AppButton text="+10" round="8px" on:click={() => searchMore(10)} />
            <AppButton text="+20" round="8px" on:click={() => searchMore(20)} />
            <AppButton text="+50" round="8px" on:click={() => searchMore(50)} />
          </div>
        {/if}
      {/if}
    </section>
  </AppLayout>
</div>

<style lang="scss">
  .fixed {
    background-color: white;
    position: fixed;
    inset: 0;
    top: 50px;
    z-index: 50;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
  section {
    .kw {
      display: flex;
      align-items: center;
      background-color: white;
      position: sticky;
      top: 0px;
      padding: 8px 16px;
      .word {
        flex: 1 1 auto;
      }
      .cnt {
        font-weight: 400;
        font-size: 12px;
      }
    }
    .res {
      article {
        margin-top: 16px;
        padding: 0 16px;
        h4 {
          display: flex;
          align-items: center;
          column-gap: 8px;
          margin-bottom: 4px;
          .type {
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 20px;
            color: white;
            font-size: 10px;
            white-space: nowrap;
            &.jrn {
              background-color: crimson;
            }
            &.festival {
              background-color: #208b00;
            }
            &.spot {
              background-color: #008bd6;
            }
            &.culture {
              background-color: #aa0099;
            }
          }
        }
        p {
          line-height: 1.4;
          font-size: 1rem;
        }
      }
      .stat {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 16px;
        & > span {
          padding: 4px 8px;
        }
      }
    }

    .pgn {
      padding: 0 16px;
      margin-bottom: 16px;
    }
  }
</style>
