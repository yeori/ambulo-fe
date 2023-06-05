import type { Unsubscriber } from 'svelte/store'
import type { IMapContext } from './IMapContext.js'
import { placeStore } from '@/common/entity/place/place-store.js'
import type { IMapSpec } from '../IMapSpec.js'
import { ShapeGroup } from '../ShapeGroup.js'
import type { Place } from '@/common/entity/place/Place.js'
import type { IShape } from '../IShape.js'

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
  }
  getInitialPos(): { lat: number; lng: number } {
    throw new Error('Method not implemented.')
  }
  on(eventName: string, target: any) {
    throw new Error('Method not implemented.')
  }
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
