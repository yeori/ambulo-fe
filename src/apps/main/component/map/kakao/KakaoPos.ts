import type { IMapPos, PathPoint } from '../IMapSpec.js'

export class KakaoPos implements PathPoint {
  lat: number
  lng: number
  distance: number
  order: number
  milestone: boolean
  constructor({ lat, lng }) {
    this.lat = lat
    this.lng = lng
  }

  get alt() {
    return undefined
  }
  toLatLng() {
    return new window.kakao.maps.LatLng(this.lat, this.lng)
  }
}
