import { liveQuery } from 'dexie'
import regionService from '@/common/entity/region/RegionService.js'
import journeyService from '../journey/JourneyService.js'
import { get, type Subscriber, type Writable } from 'svelte/store'
import type { Region } from './Region.js'
import { writable } from 'svelte/store'
import util from '@/service/util/index.js'
import type { Journey } from '../journey/Journey.js'

const observe = liveQuery(() => regionService.findRegions())

const observeJourneys = liveQuery(() => journeyService.findAllJourneys())

const update = util.svelteStore.helpUpdate

export interface IRegionStore {
  regions: Region[]
  ready: false
}
export class RegionStore {
  private store: Writable<IRegionStore>
  constructor() {
    this.store = writable({ regions: [] } as IRegionStore)
  }
  subscribe(callback: Subscriber<IRegionStore>) {
    return this.store.subscribe(callback)
  }
  prepare(regions: Region[]) {
    update(this.store, (store) => {
      store.regions = regions
    })
    this.loadRegions()
  }
  loadRegions() {
    // const { regions } = get(this.store)
    journeyService.findAllJourneys().then((journeys) => {
      this.bindJourneys(journeys)
    })
  }
  bindJourneys(journeys: Journey[]) {
    const { regions } = get(this.store)
    regions.forEach((region) => {
      const elems = journeys.filter((jr) => jr.regionRef.includes(region.seq))
      region.journeys = elems
      // console.log(region.shortName, region.journeys)
    })

    update(this.store)
  }
  filter(predicate: (region: Region) => boolean): Region[] {
    return get(this.store).regions.filter(predicate)
  }
  findRegion(predicate: (region: Region) => boolean): Region {
    const { regions } = get(this.store)
    const found = regions.filter(predicate)
    return found.length > 0 ? found[0] : undefined
  }
}

export const regionStore = new RegionStore()

observe.subscribe((regions) => {
  // console.log('[loaded]', regions)
  regionStore.prepare(regions)
})

observeJourneys.subscribe((journeys) => {
  if (journeys.length > 0) {
    regionStore.bindJourneys(journeys)
  }
})
