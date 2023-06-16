import util from '@/service/util/index.js'
import { writable, type Subscriber } from 'svelte/store'
const update = util.svelteStore.helpUpdate

export type SheetSpec = {
  component: any
  props: any
  zIndex: number
}
export type IBottomSheet = {
  sheets: SheetSpec[]
  activeSheet: SheetSpec
}
export class BottomSheetStore {
  readonly store = writable({
    sheets: [] as SheetSpec[],
    activeSheet: undefined
  })
  constructor() {}
  showSheet(spec: SheetSpec) {
    update(this.store, (store) => {
      store.sheets = []
      store.sheets.push(spec)
      store.activeSheet = spec
    })
  }
  clear() {
    update(this.store, (store) => {
      store.sheets = []
      store.activeSheet = undefined
    })
  }
  subscribe(callback: Subscriber<IBottomSheet>) {
    return this.store.subscribe(callback)
  }
}

export const sheetStore = new BottomSheetStore()
