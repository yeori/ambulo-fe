import type { IMapPath, IMapPos, PathPoint } from '../IMapSpec.js'
import { KakaoPos } from './KakaoPos.js'
export class KakaoPath implements IMapPath {
  shape: kakao.maps.Polyline
  // pathes: KakaoPos[]
  points: PathPoint[]
  active: boolean = false
  private milestones: kakao.maps.CustomOverlay[]
  constructor(
    readonly pathId: string,
    readonly mapHandle: kakao.maps.Map,
    points: PathPoint[] = []
  ) {
    this.points = points
    this.shape = new kakao.maps.Polyline({
      path: this.points.map((pos) => pos.toLatLng()),
      strokeWeight: 4,
      strokeColor: '#6d10cd',
      strokeOpacity: 0.5
    })

    // this.points = latLngs.map((pos) => {
    //   return new kakao.maps.Circle({
    //     map: mapHandle,
    //     fillColor: '#ff0000',
    //     center: pos,
    //     radius: 2.5,
    //     fillOpacity: 1,
    //     zIndex: 50
    //   })
    // })

    this.shape.setMap(mapHandle)
  }
  setStyle(
    idleOption: kakao.maps.PolylineOption,
    hoverOption: kakao.maps.PolylineOption
  ) {
    if (idleOption) {
      this.shape.setOptions(idleOption)
    }
    if (hoverOption) {
      const hover = Object.assign({}, idleOption, hoverOption)
    }
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
    this.points.push(new KakaoPos(pos))
    this.shape.setPath(this.points.map((pos) => pos.toLatLng()))
    return this
  }
  addListener(eventName: string, callback: (e: any) => void): void {
    kakao.maps.event.addListener(this.shape, eventName, callback)
  }
  setActive(active: boolean): IMapPath {
    this.active = active
    return this
  }
  setMileStoneVisible(visible: boolean): IMapPath {
    if (visible) {
      this.milestones = this.points
        .filter((p, idx) => idx > 0 && p.milestone)
        .map(
          (p) =>
            new kakao.maps.CustomOverlay({
              map: this.mapHandle,
              content: `<div class="shape milestone"><span class="d">${(
                p.distance / 1000
              ).toFixed(1)}km</span><span class="bar"/></div>`,
              position: p.toLatLng(),
              yAnchor: 1
            })
        )
    } else {
      const ms = this.milestones
      ms.forEach((ms) => ms.setMap(null))
      ms.splice(0, ms.length)
    }
    return this
  }
  dispose() {
    ;(this.milestones || []).forEach((ms) => {
      ms.setMap(null)
    })
    this.shape.setMap(null)
  }
}
