import type { IMapPos } from '../IMapSpec.js'

export class KakaoPos implements IMapPos {
  constructor(private readonly geoPos: GeolocationPosition) {}
  get lat() {
    return this.geoPos.coords.latitude
  }
  get lng() {
    return this.geoPos.coords.longitude
  }
  get alt() {
    return undefined
  }
  toLatLng() {
    return new window.kakao.maps.LatLng(this.lat, this.lng)
  }
}
