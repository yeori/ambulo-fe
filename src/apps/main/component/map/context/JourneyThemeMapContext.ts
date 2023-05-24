import type { Journey } from '@/common/entity/journey/Journey.js'
import type { IMapPos, IMapSpec } from '../IMapSpec.js'
import type { IMapContext } from './IMapContext.js'
import {
  journeyThemeStore,
  journeyStore
} from '@/common/entity/journey/journey-store.js'
import api from '@/service/api/index.js'
import { ShapeGroup } from '../ShapeGroup.js'
import type { Unsubscriber, Writable } from 'svelte/store'
import type { JourneyTheme } from '@/common/entity/journey/JourneyTheme.js'
import { mapStore, type JourneyContextParam } from '../map-store.js'
import type { JourneyPath } from '../JourneyPath.js'
import { regionStore } from '@/common/entity/region/region-store.js'
import type { Region } from '@/common/entity/region/Region.js'
import type { Coord } from '@/common/entity/coord/Coord.js'

// export const enum MapSubject {
//   REGION = 'Region Map',
//   THEME = 'JourneyTheme Map',
//   USER_SESSION = 'User Session Map'
// }
// type JourneyThemeMapOption = {
//   themeSeq: number
//   journeySeq: number
// }

type ThemePoint = {
  type: string
  id: string
  data: Journey
}
export class JourneyThemeContext implements IMapContext {
  private driver: IMapSpec
  pos: { lat: number; lng: number }
  params: JourneyContextParam
  journey?: Journey
  theme?: JourneyTheme
  region: Region
  shapeStore: Writable<any>
  startPointGroup: ShapeGroup<ThemePoint>
  journeyPath: JourneyPath
  private journeys: Journey[]
  private uuid: number = 0
  private themePoints: ThemePoint[]
  usubscriber: Unsubscriber
  initialPos: Coord
  constructor(params: JourneyContextParam) {
    this.params = params
    if (this.params.journeySeq) {
      const journey = journeyStore.findJourney(
        (jr) => jr.seq === this.params.journeySeq
      )
      this.initialPos = journey.courses[0].startPos
    }
  }
  on(eventName: string, elem: any) {
    const journey: Journey = elem.data
    // console.log(journey)
    mapStore.setMapContext({
      journeySeq: journey.seq
    })
  }
  installMapDriver(driver: IMapSpec, shapeStore: Writable<any>) {
    this.shapeStore = shapeStore
    this.driver = driver
  }
  getInitialPos(): { lat: number; lng: number } {
    return this.initialPos
  }
  updateJourneyPath() {
    if (this.journeyPath) {
      this.journeyPath.dispose()
      this.journeyPath = undefined
    }
    api.journey.get(this.journey.seq).then((res) => {
      const { journey } = res
      this.journey = journey
      this.journeyPath = this.driver.createJourneyPath(res.journey)
    })
  }
  renderTheme() {
    this.updateJourneyPath()
    this.shapeStore.update((shapes: any[]) => {
      shapes.splice(0, shapes.length)
      this.themePoints = this.journeys.map((jr) => ({
        type: 'jrtheme',
        data: jr,
        id: jr.courseIndex + '_' + this.uuid
      }))
      shapes.push(...this.themePoints)
      return shapes
    })

    this.startPointGroup = new ShapeGroup({
      name: 'start-point',
      driver: this.driver,
      objects: this.themePoints,
      posExtractor: (point) => point.data.courses[0].startPos
    })

    // 지역 또는 테마길을 구성하는 각 시작 위치들
    setTimeout(() => {
      this.startPointGroup.render(
        (point) => document.querySelector(`#${point.id}`) as HTMLElement
      )
      const pos = this.themePoints[0].data.courses[0].startPos
      this.driver.setCenter(this.journey.getStartPos())
    }, 0)
  }
  clear() {
    if (this.startPointGroup) {
      this.startPointGroup.dispose()
      this.startPointGroup = undefined
    }
    if (this.journeyPath) {
      this.journeyPath.dispose()
      this.journeyPath = undefined
    }
    this.shapeStore.update(() => [])
  }
  start() {
    this.usubscriber = mapStore.subscribe((option) => {
      const { themeSeq, regionSeq, journeySeq } = option

      let journeys = undefined
      if (regionSeq !== undefined) {
        this.uuid++
        this.clear()
        const region = regionStore.findRegion((rgn) => rgn.seq === regionSeq)
        this.region = region
        journeys = [...region.journeys]
        this.journey =
          journeySeq === undefined
            ? journeys[0]
            : journeys.find((jr) => jr.seq === journeySeq)

        if (!this.journey) {
          this.journey = this.region.journeys[0]
        }
        // this.region = region
      } else if (themeSeq !== undefined) {
        this.uuid++
        this.clear()
        const theme = journeyThemeStore.findTheme((thm) => thm.seq === themeSeq)
        this.theme = theme
        journeys = [...theme.journyes]
        this.journey =
          journeySeq === undefined
            ? journeys[0]
            : journeys.find((jr) => jr.seq === journeySeq)
      } else {
        // journey만 클릭함
        const journey = journeyStore.findJourney((jr) => jr.seq === journeySeq)
        this.journey = journey
        this.updateJourneyPath()
      }
      if (journeys) {
        this.journeys = journeys
        this.renderTheme()
      }
    })
  }
  dispose() {
    this.usubscriber()
  }
}
