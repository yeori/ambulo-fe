import { KakaoPos } from './KakaoMap.js'

export class KakaoPath {
  polyLine: any // PolyLine
  pathes: KakaoPos[]
  constructor(readonly pathId: string, readonly mapHandle: any) {
    this.pathes = []
    this.polyLine = new window.kakao.maps.Polyline({
      path: [],
      strokeWeight: 8,
      strokeColor: '#FFAE00',
      strokeOpacity: 0.8,
      strokeStyle: 'solid'
    })
    this.polyLine.setMap(mapHandle)
  }
  addPosition(pos: GeolocationPosition) {
    // const { coords, timestamp } = pos
    this.pathes.push(new KakaoPos(pos))
    this.polyLine.setPath(this.pathes.map((pos) => pos.toLatLng()))
    console.log(this.pathes)
  }
}
