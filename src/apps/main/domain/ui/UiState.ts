import util from '@/service/util/index.js'
import { writable, type Subscriber } from 'svelte/store'
const update = util.svelteStore.helpUpdate

import { type SearchUI, searchUi } from './SearchUI.js'

export type SlideMenu = {
  visible: boolean
  width: number
  dir: 'left' | 'right'
}
export type SearchInfo = {
  visible: boolean
  ui: SearchUI
}
export type UiStateInfo = {
  scrollTop: number
  scrollBottom: number
  leftMenu: SlideMenu
  search: SearchInfo
}

export class UiState {
  resetScroll() {
    const el = document.querySelector('#app') as HTMLElement
    el.scrollTo({ top: 0 })
    // const { scrollTo, offsetHeight } = el
  }
  private store = writable({
    scrollTop: 0,
    leftMenu: { visible: false, dir: 'left', width: 280 },
    search: { visible: false, ui: searchUi }
  } as UiStateInfo)
  constructor() {}
  subscribe(callback: Subscriber<UiStateInfo>) {
    return this.store.subscribe(callback)
  }

  updateScroll(scrollTop: number, scrollBottom?: number) {
    update(this.store, (state) => {
      state.scrollTop = scrollTop
      state.scrollBottom = scrollBottom
    })
  }
  setMenuVisible(visible: boolean) {
    update(this.store, (state) => {
      state.leftMenu.visible = visible
    })
  }
  setSearchVisible(visible: boolean) {
    update(this.store, (state) => {
      state.search.visible = visible
    })
  }
}
