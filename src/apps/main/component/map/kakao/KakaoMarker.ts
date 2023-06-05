import type { IShape } from '../IShape.js'

export class KakaoMarker implements IShape {
  private marker: kakao.maps.Marker
  constructor(marker: kakao.maps.Marker) {
    this.marker = marker
  }
  dispose() {
    this.marker.setMap(null)
  }
}
