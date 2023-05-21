import { writable, type Subscriber } from 'svelte/store'

export type UiStateInfo = {
  scrollTop: number
}

export class UiState {
  private store = writable({ scrollTop: 0 } as UiStateInfo)
  constructor() {}
  subscribe(callback: Subscriber<UiStateInfo>) {
    return this.store.subscribe(callback)
  }

  updateScroll(scrollTop: number) {
    this.store.update((state) => {
      state.scrollTop = scrollTop
      return state
    })
  }
}
