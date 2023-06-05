import { writable, type Subscriber } from 'svelte/store'

export type UiStateInfo = {
  scrollTop: number
  scrollBottom: number
}

export class UiState {
  resetScroll() {
    const el = document.querySelector('#app') as HTMLElement
    el.scrollTo({ top: 0 })
    // const { scrollTo, offsetHeight } = el
  }
  private store = writable({ scrollTop: 0 } as UiStateInfo)
  constructor() {}
  subscribe(callback: Subscriber<UiStateInfo>) {
    return this.store.subscribe(callback)
  }

  updateScroll(scrollTop: number, scrollBottom?: number) {
    this.store.update((state) => {
      state.scrollTop = scrollTop
      state.scrollBottom = scrollBottom
      return state
    })
  }
}
