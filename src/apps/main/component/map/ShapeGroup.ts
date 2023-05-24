import type { IMapPos, IMapSpec } from './IMapSpec.js'

export type ShapeGroupOption<T> = {
  name: string
  driver: IMapSpec
  objects: T[]
  posExtractor: (obj: T) => { lat: number; lng: number }
}
export class ShapeGroup<T> {
  private points: IMapPos[]
  name: string
  driver: IMapSpec
  objects: T[]
  posExtractor: (obj: T) => { lat: number; lng: number }
  shapes: any[]
  constructor({ name, driver, objects, posExtractor }: ShapeGroupOption<T>) {
    this.name = name
    this.driver = driver
    this.objects = objects
    this.posExtractor = posExtractor
  }
  render(contentFn: (obj: T) => string | HTMLElement) {
    this.shapes = this.objects.map((obj) => {
      const pos = this.posExtractor(obj)
      const content = contentFn(obj)
      return this.driver.drawOverlay({
        position: pos,
        anchor: { x: 0.5, y: 1 },
        content,
        zIndex: 1000,
        click: false
      })
    })
  }
  dispose() {
    this.shapes.forEach((shape) => {
      shape.setMap(null)
    })
  }
}
