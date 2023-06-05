export class DndEvent {
  originalEvent: Event
  sx: number
  sy: number
  dx: number
  dy: number
  constructor(readonly target: HTMLElement, e: MouseEvent) {
    this.dx = 0
    this.dy = 0
    this.sx = e.pageX
    this.sy = e.pageY
    this.originalEvent = e
  }
  update(e: MouseEvent) {
    this.originalEvent = e
    this.dx = e.pageX - this.sx
    this.dy = e.pageY - this.sy
  }
}
export interface IDndHandler {
  accept: (el: HTMLElement) => boolean
  beforeDrag: (e: DndEvent) => void
  dragging: (e: DndEvent) => void
  afterDrag: (e: DndEvent) => void
}
