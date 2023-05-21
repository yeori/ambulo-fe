import type { IMapPath, PathPoint } from '../IMapSpec.js'
import { GooglePos } from './GooglePos.js'

export default class GooglePath implements IMapPath {
  shape: google.maps.Polyline
  points: PathPoint[]
  active: boolean = false
  private milestones: google.maps.OverlayView[]
  constructor(
    readonly pathId: string,
    readonly mapHandle: google.maps.Map,
    points: PathPoint[] = []
  ) {
    this.points = points
    this.shape = new window.google.maps.Polyline({
      path: this.points,
      strokeWeight: 4,
      strokeColor: '#6d10cd',
      strokeOpacity: 0.8,
      map: mapHandle
    })
  }
  getDistance(): number {
    const end = this.points[this.points.length - 1]
    return end ? end.distance : 0
  }
  getPoints(): PathPoint[] {
    return this.points
  }
  addPosition(pos: { lat: number; lng: number }) {
    // FIXME  order, distance 계산 해야 함
    this.points.push(new GooglePos(pos))
    this.shape.setPath(this.points.map((pos) => pos.toLatLng()))
    return this
  }
  addListener(eventName: string, callback: (e: any) => void): void {
    google.maps.event.addListener(this.shape, eventName, callback)
  }
  setActive(active: boolean): IMapPath {
    this.active = active
    return this
  }
  setMileStoneVisible(visible: boolean): IMapPath {
    if (visible) {
      this.milestones = []
    } else {
    }
    return this
  }
}
