import type { Unsubscriber } from 'svelte/store'
import type { IMapContext } from './IMapContext.js'
import { placeStore } from '@/common/entity/place/place-store.js'
import type { IMapSpec } from '../IMapSpec.js'
import type { IShape } from '../IShape.js'
import { Debounce } from '@/service/util/debounce.js'

const clearShape = (placeMarkers: IShape[]) => {
  placeMarkers.forEach((marker) => marker.dispose())
}

export class TourSpotMapContext implements IMapContext {
  private unsubscribe: Unsubscriber
  private driver: IMapSpec
  private shapes: IShape[]
  constructor(driver: IMapSpec) {
    this.driver = driver
    this.shapes = []
    const dbn = new Debounce(undefined, '', (e) => this.updatePlace(e), 200)
    this.driver.on((e) => {
      const { type } = e
      if (type === 'center') {
        dbn.debounce(e)
      }
    })
  }
  updatePlace(e) {
    this.driver.queryAddress(e.lat, e.lng).then((res) => {
      placeStore.loadPlaces(this.driver.getBounds(), res[0].region_1depth_name)
    })
  }
  getInitialPos(): { lat: number; lng: number } {
    throw new Error('Method not implemented.')
  }
  on(eventName: string, target: any) {}
  start() {
    this.unsubscribe = placeStore.subscribe((store) => {
      const { visibles } = store
      clearShape(this.shapes)
      visibles.forEach((place) => {
        const mk = this.driver.createMarker({
          pos: place.getPosition(),
          title: place.title
        })
        this.shapes.push(mk)
      })
    })
  }
  dispose() {
    this.unsubscribe()
  }
}
