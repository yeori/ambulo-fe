import type { Place } from '@/common/entity/place/Place.js'
import type { IMapContext } from './IMapContext.js'
import { placeStore } from '@/common/entity/place/place-store.js'
import type { IMapSpec } from '../IMapSpec.js'
export class PlaceContext implements IMapContext {
  private place: Place
  private driver: IMapSpec
  constructor(readonly uuid: string) {
    if (uuid) {
      this.place = placeStore.findPlace((place) => place.uuid === uuid)
    }
  }
  getInitialPos(): { lat: number; lng: number } {
    const { lat, lng } = this.place.getPosition()
    return { lat, lng }
  }
  installMapDriver(driver) {
    this.driver = driver
  }
  start() {
    this.driver.setCenter(this.getInitialPos())
    this.driver.createMarker({ pos: this.place.getPosition() })
  }
  on(eventName: string, target: any) {}
  dispose() {}
  static fromPlace(place: Place): any {
    const ctx = new PlaceContext(undefined)
    ctx.place = place
    return ctx
  }
}
