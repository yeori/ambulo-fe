import { writable, type Subscriber, type Writable, get } from 'svelte/store'
import util from '@/service/util/index.js'
import { local } from '@/service/storage/index.js'
import { JourneyThemeContext } from './context/JourneyThemeMapContext.js'
import { RegionContext } from './context/RegionContext.js'

const update = util.svelteStore.helpUpdate

// export const enum ContextType {
//   REGION_MAP = 'REGION_MAP',
//   JOURNEY_THEME_MAP = 'JOURNEY_THEME_MAP',
//   USER_SESSION_MAP = 'USER_SESSION_MAP'
// }
export type JourneyContextParam = {
  regionSeq?: number
  themeSeq?: number
  journeySeq?: number
}

export class MapStore {
  private store: Writable<JourneyContextParam>
  constructor(data?: JourneyContextParam) {
    this.store = writable(data)
    if (data) {
      update(this.store, () => data)
    }
  }
  subscribe(callback: Subscriber<JourneyContextParam>) {
    return this.store.subscribe(callback)
  }
  setMapContext(params: JourneyContextParam) {
    const { journeySeq, regionSeq, themeSeq } = params
    update(this.store, () => {
      const data = Object.assign({}, local.get('ambulo.map.context'))
      // theme 또는 region중 하나만 저장되어야 함
      if (themeSeq !== undefined) {
        data.themeSeq = themeSeq
        delete data.regionSeq
      }
      if (regionSeq !== undefined) {
        data.regionSeq = regionSeq
        delete data.themeSeq
        // delete data.journeySeq
      }
      if (journeySeq !== undefined) {
        data.journeySeq = journeySeq
      }
      local.save('ambulo.map.context', data)

      return params
    })
  }
  getMapContext() {
    // FIXME 여기 있으면 안될거 같다. IMapContext 가  MapStore를 참조함. 양방향 참조 중
    const params = get(this.store)
    return new JourneyThemeContext(params as JourneyContextParam)
  }
}
export const mapStore = new MapStore(local.get('ambulo.map.context'))
