import type { IMapPos, IMapSpec } from '../IMapSpec.js'

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
  toCoord() {
    return new window.kakao.maps.LatLng(this.lat, this.lng)
  }
}

export class KakaoMap implements IMapSpec {
  pos: IMapPos
  apiKey: string
  zoom: number
  mapHandler: any

  constructor(
    readonly el: HTMLElement,
    apiKey: string,
    zoom = 5,
    pos?: IMapPos
  ) {
    this.pos = pos
    this.apiKey = apiKey
    this.zoom = zoom
    this.pos = pos
    this.mapHandler = undefined
  }
  render(pos: IMapPos, zoomLevel) {
    this.pos = pos
    this.zoom = zoomLevel
    this.mapHandler = new window.kakao.maps.Map(this.el, {
      center: pos.toCoord(),
      level: this.zoom
    })
    return this
  }
}
