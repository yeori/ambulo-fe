import util from '@/service/util/index.js'
import { writable, type Subscriber, type Writable, get } from 'svelte/store'
const update = util.svelteStore.helpUpdate
export type TabItemType<T> = {
  active?: boolean
  data: T
  tabId: string
  titleFn: (data: T) => string
}
export class TabItem<T> {
  setActive(active: boolean) {
    this.active = active
  }
  private data: T
  private titleFn: (userData: T) => string
  readonly tabId: string
  private active: boolean
  constructor({ active, tabId, data, titleFn }: TabItemType<T>) {
    this.active = active || false
    this.data = data
    this.tabId = tabId
    this.titleFn = titleFn || ((data) => data.toString())
  }
  getData(): any {
    return this.data
  }
  get title() {
    return this.titleFn(this.data)
  }
  isActive() {
    return this.active
  }
  select() {
    this.active = true
  }
}
export type TabModelStore<T> = {
  activeId: string
  items: TabItem<T>[]
  activeIndex: number
}
export class TabModel<T> {
  selectItem(item: TabItem<T>) {
    update(this.store, (store) => {
      const { activeIndex, items } = store
      if (activeIndex >= 0) {
        items[activeIndex].setActive(false)
      }
      const idx = items.findIndex((elem) => elem.tabId === item.tabId)
      if (idx >= 0) {
        items[idx].select()
      }
      store.activeId = items[idx].tabId
      store.activeIndex = idx
    })
  }
  private readonly store: Writable<TabModelStore<T>>
  constructor(tabItems: TabItem<T>[]) {
    let idx = tabItems.findIndex((item) => item.isActive())

    if (idx < 0) {
      idx = 0
      tabItems[idx].select()
    }
    let activeId = tabItems[idx].tabId
    this.store = writable({ activeId, items: tabItems, activeIndex: idx })
  }
  subscribe(callback: Subscriber<TabModelStore<T>>) {
    return this.store.subscribe(callback)
  }
  getActiveData() {
    const { activeIndex, items } = get(this.store)
    if (activeIndex >= 0) {
      return items[activeIndex].getData()
    } else {
      return undefined
    }
  }

  static create<T>(
    userData: T[],
    idFn: (data: T) => string,
    titleFn: (tab: T) => string
  ) {
    const tabItems = userData.map(
      (data) => new TabItem({ active: false, tabId: idFn(data), data, titleFn })
    )
    return new TabModel(tabItems)
  }
}
