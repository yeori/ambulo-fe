import { writable, type Subscriber, type Writable, get } from 'svelte/store'
import util from '@/service/util/index.js'
import { local } from '@/service/storage/index.js'
import { JourneyThemeContext } from './context/JourneyThemeMapContext.js'
import { PlaceContext } from './context/PlaceContext.js'
import type { JourneyTheme } from '@/common/entity/journey/JourneyTheme.js'
import type { Journey } from '@/common/entity/journey/Journey.js'
import type { Region } from '@/common/entity/region/Region.js'
import type { Place } from '@/common/entity/place/Place.js'
import type { Festival } from '@/common/entity/festival/Festival.js'
import { FestivalConText } from './context/FestivalContext.js'

const KEY_MAP_STORE = 'ambulo.map.context'
const KEY_VIEWPORT_STATE = 'ambulo.map.viewport'
const update = util.svelteStore.helpUpdate
export type JourneyState = {
  target: 'region' | 'theme' | 'place' | 'festival'
  once: boolean
  regionSeq?: number
  themeSeq?: number
  journeySeq?: number
  uuid?: string
}

export type ViewportState = {
  lat: number
  lng: number
  level: number
}
const DEFAULT_MAP_CONFIG = {
  target: undefined,
  once: false,
  regionSeq: undefined,
  themeSeq: undefined,
  journeySeq: undefined
}
const DEFAULT_VIEWPORT_CONFIG = {
  lat: undefined,
  lng: undefined,
  level: 6
}
export class MapStore {
  private journeyState: Writable<JourneyState>
  private viewportState: Writable<ViewportState>
  constructor(data?: JourneyState) {
    this.journeyState = writable(data)
    if (data) {
      update(this.journeyState, (store) => {
        store.once = false
      })
    }
    this.viewportState = writable(
      local.get(KEY_VIEWPORT_STATE, DEFAULT_VIEWPORT_CONFIG)
    )
  }
  subscribe(callback: Subscriber<JourneyState>) {
    return this.journeyState.subscribe(callback)
  }
  viewport() {
    return get(this.viewportState)
  }
  setViewport(writer: (viewport: ViewportState) => void) {
    update(this.viewportState, (state) => {
      writer(state)
      local.save(KEY_VIEWPORT_STATE, state)
    })
  }
  upateJourneyPath(journey: Journey) {
    this.journeyState.update((store) => {
      store.journeySeq = journey.seq
      store.once = true
      local.save(KEY_MAP_STORE, store)
      return store
    })
  }
  showJouneyTheme(journey: Journey, theme: JourneyTheme): Promise<void> {
    return new Promise((yes, no) => {
      const regionSeq = journey.regionRef[0]
      update(this.journeyState, (store) => {
        store.target = 'theme'
        store.once = false
        store.themeSeq = theme.seq
        store.journeySeq = journey.seq
        store.regionSeq = regionSeq
        local.save(KEY_MAP_STORE, store)
      })

      yes()
    })
  }
  showRegion(journey: Journey, region: Region): Promise<void> {
    const journyes = region.journeys.map((jr) => jr.seq)
    return new Promise((yes, no) => {
      update(this.journeyState, (store) => {
        store.target = 'region'
        store.once = false
        store.themeSeq = journey.themeRef
        store.journeySeq = journey.seq
        store.regionSeq = region.seq
        local.save(KEY_MAP_STORE, store)
      })
      yes()
    })
  }
  showPlace(place: Place, isFestival: boolean): Promise<void> {
    return new Promise((yes, no) => {
      update(this.journeyState, (store) => {
        store.target = isFestival ? 'festival' : 'place'
        store.once = false
        store.themeSeq = undefined
        store.journeySeq = undefined
        store.regionSeq = undefined
        store.uuid = place.uuid
      })
      const pos = place.getPosition()
      this.setViewport((vp) => {
        vp.lat = pos.lat
        vp.lng = pos.lng
        vp.level = 4
      })
      yes()
    })
  }
  getMapContext() {
    // FIXME 여기 있으면 안될거 같다. IMapContext 가  MapStore를 참조함. 양방향 참조 중
    const params = get(this.journeyState)
    const { target, uuid } = params
    if (target === 'place') {
      return new PlaceContext(uuid)
    } else if (target === 'festival') {
      return new FestivalConText(uuid)
    } else {
      return new JourneyThemeContext(params as JourneyState)
    }
  }
}
export const mapStore = new MapStore(
  local.get(KEY_MAP_STORE, DEFAULT_MAP_CONFIG)
)
