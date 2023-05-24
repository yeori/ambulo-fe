import type { Journey } from '@/common/entity/journey/Journey.js'
import type { IMapSpec } from '../IMapSpec.js'
import type { IMapContext } from './IMapContext.js'
import type { Unsubscriber, Writable } from 'svelte/store'
import api from '@/service/api/index.js'
import { ShapeGroup } from '../ShapeGroup.js'
import type { JourneyPath } from '../JourneyPath.js'
import { journeyStore } from '@/common/entity/journey/journey-store.js'
import type { Region } from '@/common/entity/region/Region.js'
import { ContextType, mapStore } from '../map-store.js'
import { regionStore } from '@/common/entity/region/region-store.js'

type RegionMapOption = {
  regionSeq: number
  journeySeq: number
}
export class RegionContext implements IMapContext {
  private driver: IMapSpec
  params: RegionMapOption
  region?: Region
  journey?: Journey
  shapeStore: Writable<any>
  startPoints: ShapeGroup<Journey>
  journeyPath: JourneyPath
  usubscriber: Unsubscriber
  constructor(params: RegionMapOption) {
    this.params = params
    if (this.params.journeySeq) {
      this.journey = journeyStore.findJourney(
        (jr) => jr.seq === this.params.journeySeq
      )
    }
  }
  installMapDriver(driver: IMapSpec, shapeStore: Writable<any>) {
    this.shapeStore = shapeStore
    this.driver = driver
  }
  on(eventName: string, elem: any) {
    const journey: Journey = elem.data
    mapStore.setMapContext(ContextType.REGION_MAP, {
      regionSeq: this.region.seq,
      journeySeq: journey.seq
    })
  }
  renderRegion(region: Region) {
    this.shapeStore.update((shapes: any[]) => {
      shapes.splice(0, shapes.length)
      const points = region.journeys.map((jr) => ({
        type: 'jrtheme',
        data: jr,
        id: jr.courseIndex
      }))
      shapes.push(...points)
      return shapes
    })

    if (this.journeyPath) {
      this.journeyPath.dispose()
    }
    if (!this.startPoints) {
      this.startPoints = new ShapeGroup({
        name: 'start-point',
        driver: this.driver,
        objects: this.region.journeys,
        posExtractor: (journey) => journey.courses[0].startPos
      })
      setTimeout(() => {
        this.startPoints.render(
          (jr) => document.querySelector(`#${jr.courseIndex}`) as HTMLElement
        )
      }, 0)
    }
    api.journey.get(this.journey.seq).then((res) => {
      const { journey } = res
      this.journey = journey
      this.journeyPath = this.driver.createJourneyPath(res.journey)
    })
  }
  getInitialPos(): { lat: number; lng: number } {
    return this.journey.courses[0].startPos
  }
  start() {
    this.usubscriber = mapStore.subscribe((option) => {
      this.params = option.params
      if (this.params.journeySeq) {
        this.journey = journeyStore.findJourney(
          (jr) => jr.seq === this.params.journeySeq
        )
      }
      const regions: Region[] = regionStore.filter(
        (region) => region.seq === this.params.regionSeq
      )
      this.region = regions[0]
      this.renderRegion(this.region)
    })
  }
  dispose() {
    this.usubscriber()
  }
}
