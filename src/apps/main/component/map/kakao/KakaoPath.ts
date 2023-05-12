import type { IMapPath } from '../IMapSpec.js'
import { KakaoPos } from './KakaoPos.js'

export class KakaoPath implements IMapPath {
  polyLine: kakao.maps.Polyline
  pathes: KakaoPos[]
  constructor(readonly pathId: string, readonly mapHandle: kakao.maps.Map) {
    this.pathes = []
    this.polyLine = new window.kakao.maps.Polyline({
      path: [],
      strokeWeight: 8,
      strokeColor: '#FFAE00',
      strokeOpacity: 0.8
    } as kakao.maps.PolylineOption)
    this.polyLine.setMap(mapHandle)
  }
  addPosition(pos: GeolocationPosition) {
    this.pathes.push(new KakaoPos(pos))
    this.polyLine.setPath(this.pathes.map((pos) => pos.toLatLng()))
    console.log(this.pathes)
    return this
  }
}
