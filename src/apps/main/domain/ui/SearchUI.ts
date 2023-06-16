import { Page, SearchResult } from '@/common/entity/search/SearchResult.js'
import api from '@/service/api/index.js'
import util from '@/service/util/index.js'
import { get, writable, type Subscriber, type Writable } from 'svelte/store'

const update = util.svelteStore.helpUpdate

export type SearchStore = {
  keyword: string
  pending: boolean
  results: SearchResult[]
  /**
   * 검색 결과가 남아있는지 나타냄
   */
  moreSearch: boolean
  page?: Page
}
export class SearchUI {
  private store: Writable<SearchStore>
  constructor() {
    this.store = writable({
      keyword: '',
      pending: false,
      results: [],
      moreSearch: false
    })
  }
  search(
    keyword: string,
    offset: number = 0,
    size = 20,
    append: boolean = false
  ) {
    update(this.store, (state) => {
      state.keyword = keyword
      state.pending = true
    })
    api.search.byKeyword(keyword, offset, size).then((res) => {
      update(this.store, (state) => {
        state.pending = false
        const { result } = res
        if (append) {
          state.results.push(result)
        } else {
          state.results = [result]
        }
        state.moreSearch = result.page.hasMoreSearch()
        state.page = result.page
      })
      console.log(res)
    })
  }
  searchMore(size: number) {
    const { keyword, results } = get(this.store)
    if (size <= 0) {
      return
    }
    if (results.length === 0) {
      throw new Error('no initial search response')
    }

    const nextOffset = results[results.length - 1].page.end
    return this.search(keyword, nextOffset, size, true)
  }
  subscribe(callback: Subscriber<SearchStore>) {
    return this.store.subscribe(callback)
  }
  clearKeyword() {
    update(this.store, (store) => {
      store.keyword = ''
    })
  }
  hasKeyword() {
    return !!get(this.store).keyword
  }
  hasMoreSearch(): boolean {
    const { results } = get(this.store)
    if (results.length === 0) {
      return false
    }
    const recent = results[results.length - 1]
    const { page } = recent
    return page.end < page.totalItems
  }
}

export const searchUi = new SearchUI()
