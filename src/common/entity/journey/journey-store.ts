import api from '@/service/api/index.js'
import { writable, type Subscriber, type Writable, get } from 'svelte/store'
import type { Journey } from './Journey.js'
import type { JourneyTheme } from './JourneyTheme.js'
import journeyService from './JourneyService.js'
import util from '@/service/util/index.js'
import { liveQuery } from 'dexie'

const observeJourneys = liveQuery(() => journeyService.findAllJourneys())

const objserveThemes = liveQuery(() => journeyService.findThemes())
const update = util.svelteStore.helpUpdate

export type JourenyThemeStoreType = {
  themes: JourneyTheme[]
  ready: boolean
}
export class JourneyThemeStore {
  private store: Writable<JourenyThemeStoreType>
  constructor() {
    this.store = writable({ themes: [], ready: false })
    // journeyService.findThemes().then((themes) => {
    //   update(this.store, (store) => {
    //     store.themes = themes
    //   })
    // })
  }
  prepare(themes: JourneyTheme[], journeys: Journey[]) {
    // const { themes } = get(this.store)
    const map = util.array.partition(
      journeys,
      (jr) => jr.themeRef,
      (jr) => jr
    )
    themes.forEach((jrTheme) => {
      jrTheme.setJourneys(map.get(jrTheme.seq))
    })
    update(this.store, (store) => {
      store.themes = themes
      store.ready = true
    })
  }
  subscribe(callback: Subscriber<JourenyThemeStoreType>) {
    return this.store.subscribe(callback)
  }
  getValidThemes() {
    const { themes } = get(this.store)
    if (!themes) {
      return []
    }
    return themes.filter((thm) => thm.seq > 1)
  }
  filterThemes(
    predicate: (
      value: JourneyTheme,
      index: number,
      array: JourneyTheme[]
    ) => boolean
  ) {
    const { themes } = get(this.store)
    return themes.filter(predicate)
  }
  findTheme(predicate: (theme: JourneyTheme) => boolean) {
    const themes = this.filterThemes(predicate)
    return themes.length > 0 ? themes[0] : undefined
  }
}
export const journeyThemeStore = new JourneyThemeStore()

export type JourneyStoreType = {
  journeys: Journey[]
  ready: boolean
}
export class JourneyStore {
  store: Writable<JourneyStoreType>
  constructor() {
    this.store = writable({ journeys: [], ready: false })
  }
  prepare(journeys: Journey[]) {
    update(this.store, (store) => {
      store.journeys = journeys
      store.ready = true
    })
  }
  subscribe(callback: Subscriber<JourneyStoreType>) {
    return this.store.subscribe(callback)
  }
  findJourney(predicate: (jr: Journey) => boolean): Journey {
    const { journeys } = get(this.store)
    return journeys.find(predicate)
  }

  loadSummaries() {
    api.journey.summaries().then((res) => {
      console.log(res)
    })
  }
}
export const journeyStore = new JourneyStore()

observeJourneys.subscribe((journeys) => {
  journeyStore.prepare(journeys)
  objserveThemes.subscribe((themes) => {
    journeyThemeStore.prepare(themes, journeys)
  })
})
