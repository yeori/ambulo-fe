import type { IMapPath } from '../IMapSpec.js'
import { GooglePos } from './GooglePos.js'

export default class GooglePath implements IMapPath {
  polyline: google.maps.Polyline
  pathes: GooglePos[]
  constructor(readonly pathId: string, readonly mapHandle: kakao.maps.Map) {
    this.pathes = []
    this.polyline = new window.google.maps.Polyline({
      path: [],
      strokeWeight: 8,
      strokeColor: '#FFAE00',
      strokeOpacity: 0.8,
      map: mapHandle
    } as google.maps.PolylineOptions)
  }
  addPosition(pos: GeolocationPosition): IMapPath {
    this.pathes.push(new GooglePos(pos))
    this.polyline.setPath(this.pathes.map((pos) => pos.toLatLng()))
    return this
  }
}
