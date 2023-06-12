import type { Festival } from '@/common/entity/festival/Festival.js'
import type { IMapContext } from './IMapContext.js'
import { festivalStore } from '@/common/entity/festival/festival-store.js'
import type { IMapSpec } from '../IMapSpec.js'

export class FestivalConText implements IMapContext {
  private festival: Festival
  private driver: IMapSpec
  constructor(readonly uuid: string) {
    this.festival = festivalStore.find((fv) => fv.place.uuid === uuid)
  }
  getInitialPos(): { lat: number; lng: number } {
    const { lat, lng } = this.festival.place.getPosition()
    return { lat, lng }
  }
  installMapDriver(driver) {
    this.driver = driver
  }
  start() {
    this.driver.createMarker({ pos: this.festival.place.getPosition() })
  }
  on(eventName: string, target: any) {}
  dispose() {}
}
