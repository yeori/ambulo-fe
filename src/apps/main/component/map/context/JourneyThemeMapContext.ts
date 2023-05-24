import type { Journey } from '@/common/entity/journey/Journey.js'
import type { IMapSpec } from '../IMapSpec.js'
import type { IMapContext } from './IMapContext.js'
import {
  journeyThemeStore,
  journeyStore
} from '@/common/entity/journey/journey-store.js'
import api from '@/service/api/index.js'
import { ShapeGroup, type ShapeObject } from '../ShapeGroup.js'
import type { Unsubscriber, Writable } from 'svelte/store'
import type { JourneyTheme } from '@/common/entity/journey/JourneyTheme.js'
import { mapStore, type JourneyState } from '../map-store.js'
import type { JourneyPath } from '../JourneyPath.js'
import { regionStore } from '@/common/entity/region/region-store.js'
import type { Region } from '@/common/entity/region/Region.js'
import type { Coord } from '@/common/entity/coord/Coord.js'

// type ThemePoint = {
//   type: string
//   id: string
//   data: Journey
// }
export class JourneyThemeContext implements IMapContext {
  private driver: IMapSpec
  pos: { lat: number; lng: number }
  params: JourneyState

  shapeStore: Writable<any>

  journey?: Journey
  theme?: JourneyTheme
  region: Region
  journeyPath: JourneyPath
  startPointGroup: ShapeGroup<Journey>
  private journeys: Journey[]
  private uuid: number = 0
  private themePoints: ShapeObject<Journey>[]
  usubscriber: Unsubscriber
  initialPos: Coord
  constructor(params: JourneyState) {
    this.params = params
    if (this.params.journeySeq) {
      const journey = journeyStore.findJourney(
        (jr) => jr.seq === this.params.journeySeq
      )
      this.initialPos = journey.courses[0].startPos
    }
  }
  on(eventName: string, elem: ShapeObject<Journey>) {
    const journey: Journey = elem.data
    mapStore.upateJourneyPath(journey)
    // this.updateJourneyPath(journey)
    // console.log(journey)
    // mapStore.setMapContext({
    //   journeySeq: journey.seq
    // })
  }
  installMapDriver(driver: IMapSpec, shapeStore: Writable<any>) {
    this.shapeStore = shapeStore
    this.driver = driver
  }
  getInitialPos(): { lat: number; lng: number } {
    return this.initialPos
  }
  updateJourneyPath(journey) {
    if (this.journeyPath) {
      this.journeyPath.dispose()
      this.journeyPath = undefined
    }
    this.journey = journey
    api.journey.get(this.journey.seq).then((res) => {
      const { journey } = res
      this.journey = journey
      this.journeyPath = this.driver.createJourneyPath(res.journey)
    })
  }
  renderTheme() {
    // this.updateJourneyPath(this.journeys[0])
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
      posExtractor: (data) => data.courses[0].startPos
    })
    this.startPointGroup.repaint()
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
      const { once, target, themeSeq, regionSeq, journeySeq } = option
      let journey = journeyStore.findJourney((jr) => jr.seq === journeySeq)
      this.updateJourneyPath(journey)
      if (once) {
        // journey만 클릭
        return
      }

      // let journeys = undefined
      let journeys = undefined
      if (target === 'region') {
        const region = regionStore.findRegion((rgn) => rgn.seq === regionSeq)
        this.region = region
        journeys = region.journeys
      } else if (target === 'theme') {
        const theme = journeyThemeStore.findTheme((thm) => thm.seq === themeSeq)
        this.theme = theme
        journeys = theme.journyes
      } else {
        // throw new Error('invalid target: ' + target)
      }

      if (journeys) {
        if (!journey) {
          journey = journeys[0]
        }
        this.clear()
        this.uuid++
        this.journeys = journeys
        this.renderTheme()
      }
    })
  }
  dispose() {
    this.usubscriber()
  }
}
