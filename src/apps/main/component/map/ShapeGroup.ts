import type { IMapPos, IMapSpec } from './IMapSpec.js'

export type ShapeGroupOption<T> = {
  name: string
  driver: IMapSpec
  objects: ShapeObject<T>[]
  posExtractor: (obj: T) => { lat: number; lng: number }
}

export type ShapeObject<T> = {
  type: string
  data: T
  id: string
}
export class ShapeGroup<T> {
  private points: IMapPos[]
  name: string
  driver: IMapSpec
  objects: ShapeObject<T>[]
  posExtractor: (obj: T) => { lat: number; lng: number }
  shapes: any[]
  constructor({ name, driver, objects, posExtractor }: ShapeGroupOption<T>) {
    this.name = name
    this.driver = driver
    this.objects = objects
    this.posExtractor = posExtractor
  }
  repaint() {
    setTimeout(() => {
      this.render()
    }, 0)
  }
  render() {
    const contentFn = (obj) =>
      document.querySelector(`#${obj.id}`) as HTMLElement
    this.shapes = this.objects.map((obj) => {
      const pos = this.posExtractor(obj.data)
      const content = contentFn(obj)
      return this.driver.drawOverlay({
        position: pos,
        anchor: { x: 0.5, y: 1 },
        content: contentFn(obj),
        zIndex: 1000,
        click: false
      })
    })
  }
  renderObjects(objects: ShapeObject<T>[]) {
    this.objects = objects
  }
  dispose() {
    this.shapes.forEach((shape) => {
      shape.setMap(null)
    })
  }
}
